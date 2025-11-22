/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import { buildCloneUrl } from "../branches/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const execAsync = promisify(exec);
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;

export async function POST(req: Request) {
    try {
        const { repoUrl, subdomain, tempSessionId, personalToken, branch } =
            await req.json();

        if (!repoUrl || !subdomain || !branch) {
            return NextResponse.json(
                { message: "Repo URL and subdomain required" },
                { status: 400 }
            );
        }

        // Start deployment in background and return immediately
        deployAsync(
            repoUrl,
            subdomain,
            tempSessionId,
            personalToken,
            branch
        ).catch((error) => {
            console.error("❌ Background deployment error:", error);
        });

        // Return success immediately to UI
        return NextResponse.json(
            {
                success: true,
                message: "✅ Deployment started! Please wait...",
                subdomain,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("❌ Request error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Unexpected error" },
            { status: 500 }
        );
    }
}

// Separate async function for background deployment
async function deployAsync(
    repoUrl: string,
    subdomain: string,
    tempSessionId: string,
    personalToken: string | null,
    branch: string
) {
    try {
        const projectPath = path.join("/home/chanchhay/userdeploy", subdomain);
        if (fs.existsSync(projectPath)) {
            fs.rmSync(projectPath, { recursive: true, force: true });
        }

        const finalUrl = buildCloneUrl(repoUrl, personalToken || undefined);
        console.log("🔗 Final clone URL:", finalUrl.replace(/:.+@/, ":***@"));

        // --- Clone selected branch ---
        await execAsync(
            `git clone --depth=1 --branch ${branch} --single-branch --filter=blob:none ${finalUrl} ${projectPath}`,
            {
                env: {
                    ...process.env,
                    GIT_TERMINAL_PROMPT: "0",
                },
            }
        );

        // ... continues unchanged

        // -------------------------------
        // 🔎 Detect project type
        // -------------------------------
        let projectType = "static";
        const pkgPath = path.join(projectPath, "package.json");

        if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

            if (pkg.dependencies?.next) projectType = "next";
            else if (pkg.dependencies?.vite) projectType = "vite";
            else if (pkg.scripts?.build) projectType = "react";
        }

        // -------------------------------
        // 🛠️ Build project (if needed)
        // -------------------------------
        if (projectType !== "static") {
            await execAsync(
                `cd ${projectPath} && npm install --legacy-peer-deps`
            );

            try {
                await execAsync(`cd ${projectPath} && npm run build`);
            } catch {
                console.log("⚠️ Build failed, fallback to static.");
            }
        }

        // -------------------------------
        // 🚀 Deploy using script
        // -------------------------------
        const scriptPath = path.join(
            "/home",
            "chanchhay",
            "Documents",
            "LinuxBackup",
            "Documents",
            "ISTAD",
            "Semister2",
            "linuxFinalProject",
            "Launchly",
            "Launchly",
            "src",
            "app",
            "scripts",
            "deploy_script.sh"
        );
        const domain = "chanchhay.site";

        const { stdout, stderr } = await execAsync(
            `bash ${scriptPath} ${subdomain} ${projectPath} ${domain} ${projectType}`
        );

        const output = stdout + "\n" + stderr;
        console.log("🔥 RAW SCRIPT OUTPUT:\n", output);

        const portMatch = output.match(/:::PORT:::(\d+):::/);
        const urlMatch = output.match(/:::URL:::(https:\/\/[^\s]+):::/);

        const port = portMatch ? Number(portMatch[1]) : null;
        const liveUrl = urlMatch ? urlMatch[1] : null;

        if (!port) throw new Error("Deploy script did not return a PORT");
        if (!liveUrl) throw new Error("Deploy script did not return a URL");

        // -------------------------------
        // 🧑‍💻 Attach deployment to user
        // -------------------------------
        const session = await getServerSession(authOptions);
        const email = session?.user?.email || null;

        let userId: string | null = null;
        if (email) {
            const user = await prisma.user.findUnique({ where: { email } });
            userId = user?.id || null;
        }

        // -------------------------------
        // 📝 Save deployment record
        // -------------------------------
        await prisma.deployment.create({
            data: {
                repoUrl,
                subdomain,
                port,
                buildPath: projectPath,
                projectType,
                liveUrl,
                status: "running",
                userId,
                tempSessionId: userId ? null : tempSessionId,
            },
        });

        console.log(`✅ Deployment completed for ${subdomain}: ${liveUrl}`);

        // -------------------------
        // 🔔 Notify n8n about deployment
        // -------------------------
        try {
            const session = await getServerSession(authOptions);
            const notifyUserId = (session as any)?.user?.id ?? userId;

            await fetch(N8N_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: "NEW_DEPLOYMENT",
                    user: {
                        id: notifyUserId,
                        email: session?.user?.email || null,
                    },
                    projectName:
                        repoUrl.split("/").pop()?.replace(".git", "") ||
                        subdomain,
                    subdomain,
                    liveUrl,
                    status: "running",
                    timestamp: new Date().toISOString(),
                }),
            });
        } catch (err) {
            console.error("Failed to notify n8n about deployment:", err);
        }
    } catch (error: any) {
        console.error(`❌ Deployment error for ${subdomain}:`, error);

        // Optionally create a failed deployment record
        try {
            await prisma.deployment.create({
                data: {
                    repoUrl,
                    subdomain,
                    port: null,
                    buildPath: "",
                    projectType: "static",
                    liveUrl: "",
                    status: "failed",
                    userId: null,
                    tempSessionId,
                },
            });
        } catch (dbError) {
            console.error("Failed to record deployment failure:", dbError);
        }
    }
}
