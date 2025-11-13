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

        // 🧱 Clone repository
        const repoName =
            repoUrl.split("/").pop()?.replace(".git", "") || "project";
        const projectPath = path.join("/tmp", repoName);
        if (fs.existsSync(projectPath))
            fs.rmSync(projectPath, { recursive: true, force: true });

        const finalUrl = buildCloneUrl(repoUrl);
        console.log(`📦 Cloning from: ${finalUrl}`);
        execSync(`git clone --depth=1 ${finalUrl} ${projectPath}`, {
            stdio: "inherit",
            env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
        });

        // 🧠 Detect project type
        let projectType = "static";
        const pkgPath = path.join(projectPath, "package.json");
        if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
            if (pkg.dependencies?.next) projectType = "next";
            else if (pkg.dependencies?.vite) projectType = "vite";
            else if (pkg.scripts?.build) projectType = "react";
        }

        console.log(`🧠 Detected project type: ${projectType}`);

        // ⚙️ Build logic
        if (projectType !== "static") {
            console.log("📦 Installing dependencies...");
            execSync(`cd ${projectPath} && npm install --legacy-peer-deps`, {
                stdio: "inherit",
            });

            console.log("⚙️ Building project...");
            try {
                execSync(`cd ${projectPath} && npm run build`, {
                    stdio: "inherit",
                });
            } catch {
                console.log("⚠️ Build failed — fallback to static folder.");
            }
        }

        // 🚀 Deploy script
        const scriptPath = path.join(
            process.cwd(),
            "src",
            "app",
            "scripts",
            "deploy_script.sh"
        );
        const domain = "chanchhay.site";
        console.log("🚀 Running deploy script...");
        const deploy = spawnSync("bash", [
            scriptPath,
            subdomain,
            projectPath,
            domain,
            projectType,
        ]);
        const output =
            deploy.stdout.toString() + "\n" + deploy.stderr.toString();
        console.log(output);

        const match = output.match(/::OUTPUT::(https:\/\/[^\s]+)/);
        const liveUrl = match ? match[1] : "Unknown URL";

        // 🧩 Record deployment in DB
        const session = await getServerSession({ req, ...authOptions }); // ✅ attach req
        const email = session?.user?.email || null;
        let userId: string | null = null;

        if (email) {
            const user = await prisma.user.findUnique({ where: { email } });
            userId = user?.id || null;
        }

        await prisma.deployment.create({
            data: {
                repoUrl,
                subdomain,
                port: 4000,
                buildPath: projectPath,
                projectType,
                liveUrl,
                status: "running",
                userId, // ✅ link logged-in user
                tempSessionId: userId ? null : tempSessionId, // ✅ fallback for guests
            },
        });

        console.log("✅ Deployment recorded in database.");

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
