/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { execSync, spawnSync } from "child_process";
import path from "path";
import fs from "fs";
import { buildCloneUrl } from "../branches/route";

/* -------------------------------------------------
   Helper: Clone repository
---------------------------------------------------*/
async function cloneRepository(repoUrl: string, targetDir: string) {
    const finalUrl = buildCloneUrl(repoUrl);
    console.log(`📦 Cloning from: ${finalUrl}`);

    try {
        execSync(`git clone --depth=1 ${finalUrl} ${targetDir}`, {
            stdio: "inherit",
            env: {
                ...process.env,
                GIT_TERMINAL_PROMPT: "0",
                GIT_ASKPASS: "true",
            },
        });
    } catch (err: any) {
        console.error("❌ Git clone failed:", err.message);
        throw new Error(
            `Clone failed. Check if repo exists, or tokens are missing/invalid.`
        );
    }
}

/* -------------------------------------------------
   API: POST /api/run-script
---------------------------------------------------*/
export async function POST(req: Request) {
    try {
        const { repoUrl, subdomain } = await req.json();
        if (!repoUrl || !subdomain) {
            return NextResponse.json(
                { message: "Repo URL and subdomain required" },
                { status: 400 }
            );
        }

        // 1️⃣ Clone repository
        const repoName =
            repoUrl.split("/").pop()?.replace(".git", "") || "project";
        const projectPath = path.join("/tmp", repoName);
        if (fs.existsSync(projectPath))
            fs.rmSync(projectPath, { recursive: true, force: true });

        await cloneRepository(repoUrl, projectPath);

        // 2️⃣ Detect project type
        const pkgPath = path.join(projectPath, "package.json");
        let projectType = "static";
        if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
            if (pkg.dependencies?.next) projectType = "next";
            else if (pkg.dependencies?.vite) projectType = "vite";
            else if (pkg.scripts?.build) projectType = "react";
        }
        console.log(`🧠 Detected project type: ${projectType}`);

        // 3️⃣ Install dependencies
        if (fs.existsSync(path.join(projectPath, "package.json"))) {
            console.log("📥 Installing dependencies...");
            execSync(`cd ${projectPath} && npm install --legacy-peer-deps`, {
                stdio: "inherit",
            });
        } else {
            console.log("📁 No package.json found — skipping npm install.");
        }

        // 4️⃣ Build logic
        let buildPath = projectPath;
        if (projectType === "static") {
            console.log("⚙️ Static project — no build needed.");
        } else if (projectType === "next") {
            console.log("⚙️ Building Next.js (safe mode)...");
            execSync(
                `cd ${projectPath} && NODE_ENV=production NEXT_SKIP_PREFLIGHT_CHECK=true NEXT_DISABLE_PRERENDER=true npx next build`,
                { stdio: "inherit" }
            );
            buildPath = projectPath;
        } else {
            console.log("⚙️ Building static project...");
            try {
                execSync(`cd ${projectPath} && npm run build`, {
                    stdio: "inherit",
                });
            } catch {
                console.log("⚠️ No build script found; using raw folder.");
            }

            for (const dir of ["dist", "build", "out"]) {
                const candidate = path.join(projectPath, dir);
                if (fs.existsSync(candidate)) {
                    buildPath = candidate;
                    break;
                }
            }
        }

        // 5️⃣ Deploy using your existing shell script
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
            buildPath,
            domain,
            projectType,
        ]);

        const output =
            deploy.stdout.toString() + "\n" + deploy.stderr.toString();
        console.log(output);

        const match = output.match(/::OUTPUT::(https:\/\/[^\s]+)/);
        const finalUrl = match ? match[1] : "Unknown URL";

        return NextResponse.json({
            message: `✅ Deployed successfully!`,
            url: finalUrl,
        });
    } catch (error: any) {
        console.error("❌ Deployment error:", error.message);
        return NextResponse.json(
            { message: error.stderr?.toString() || error.message },
            { status: 500 }
        );
    }
}
