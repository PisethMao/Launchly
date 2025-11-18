/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { execSync, spawnSync } from "child_process";
import path from "path";
import fs from "fs";
import { buildCloneUrl } from "../branches/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { repoUrl, subdomain, tempSessionId } = await req.json();
        if (!repoUrl || !subdomain) {
            return NextResponse.json(
                { message: "Repo URL and subdomain required" },
                { status: 400 }
            );
        }

        // Clone repo
        // const repoName =
        //     repoUrl.split("/").pop()?.replace(".git", "") || "project";
        const projectPath = path.join("/home/chanchhay/userdeploy", subdomain);
        if (fs.existsSync(projectPath))
            fs.rmSync(projectPath, { recursive: true, force: true });

        const finalUrl = buildCloneUrl(repoUrl);
        execSync(`git clone --depth=1 --filter=blob:none ${finalUrl} ${projectPath}`, {
            stdio: "inherit",
        });

        // Detect project type
        let projectType = "static";
        const pkgPath = path.join(projectPath, "package.json");
        if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
            if (pkg.dependencies?.next) projectType = "next";
            else if (pkg.dependencies?.vite) projectType = "vite";
            else if (pkg.scripts?.build) projectType = "react";
        }

        // Build if needed
        if (projectType !== "static") {
            execSync(`cd ${projectPath} && npm install --legacy-peer-deps`, {
                stdio: "inherit",
            });

            try {
                execSync(`cd ${projectPath} && npm run build`, { stdio: "inherit" });
            } catch {
                console.log("⚠️ Build failed, fallback to static.");
            }
        }

        // Run deploy script
        const scriptPath = path.join(process.cwd(), "src", "app", "scripts", "deploy_script.sh");
        const domain = "chanchhay.site";

        const deploy = spawnSync(
            "bash",
            [scriptPath, subdomain, projectPath, domain, projectType],
            { encoding: "utf-8" }
        );

        const output = deploy.stdout + "\n" + deploy.stderr;
        console.log("🔥 RAW SCRIPT OUTPUT:\n", output);

        // ⛔️ FIX #1 — Match triple-colon markers ONLY
        const portMatch = output.match(/:::PORT:::(\d+):::/);
        const urlMatch = output.match(/:::URL:::(https:\/\/[^\s]+):::/);

        const port = portMatch ? Number(portMatch[1]) : null;
        const liveUrl = urlMatch ? urlMatch[1] : null;

        if (!port) {
            console.error("❌ MISSING PORT, RAW OUTPUT BELOW:");
            console.error(output);
            throw new Error("Deploy script did not return a PORT");
        }

        if (!liveUrl) {
            console.error("❌ MISSING URL, RAW OUTPUT BELOW:");
            console.error(output);
            throw new Error("Deploy script did not return a URL");
        }

        // ⛔️ FIX #2 — Correct session call in route handlers
        const session = await getServerSession(authOptions);
        const email = session?.user?.email || null;

        let userId: string | null = null;
        if (email) {
            const user = await prisma.user.findUnique({ where: { email } });
            userId = user?.id || null;
        }

        // Save deployment
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

        return NextResponse.json({
            message: "✅ Deployed successfully!",
            url: liveUrl,
        });

    } catch (error: any) {
        console.error("❌ Deployment error:", error);
        return NextResponse.json(
            { message: error.message || "Unexpected deployment error" },
            { status: 500 }
        );
    }
}
