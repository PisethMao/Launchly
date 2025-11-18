/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { exec } from "child_process";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { repoUrl, branch, subdomain, tempSessionId, personalToken } =
      await req.json();

    if (!repoUrl || !subdomain) {
      return NextResponse.json(
        { message: "Repo URL and subdomain required" },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 0️⃣ Detect Provider (GitHub / GitLab)
    // ------------------------------------------------------------
    const provider = repoUrl.includes("github.com")
      ? "github"
      : repoUrl.includes("gitlab.com")
      ? "gitlab"
      : "unknown";

    // ------------------------------------------------------------
    // 1️⃣ Build authenticated URL if token provided
    // ------------------------------------------------------------
    let authRepoUrl = repoUrl;
    const token = personalToken?.trim() || "";

    if (token) {
      if (provider === "github") {
        authRepoUrl = repoUrl.replace("https://", `https://${token}@`);
      }

      if (provider === "gitlab") {
        // GitLab uses oauth2:TOKEN@
        authRepoUrl = repoUrl.replace("https://", `https://oauth2:${token}@`);
      }
    }

    // ------------------------------------------------------------
    // 2️⃣ Sync deploy.sh to VM (optional)
    // ------------------------------------------------------------
    await fetch("http://localhost:3000/api/sync-script", { method: "POST" });

    // ------------------------------------------------------------
    // 3️⃣ SSH Command: send authenticated URL to VM
    // ------------------------------------------------------------
    const sshCommand =
      `ssh -i ${process.env.VM_PRIVATE_KEY_PATH} ` +
      `-o StrictHostKeyChecking=no ` +
      `${process.env.VM_USER}@${process.env.VM_HOST} ` +
      `"bash /home/launchly/deploy.sh '${authRepoUrl}' '${branch}' '${subdomain}' '${token}'"`;

    console.log("🔥 SSH Command:", sshCommand);

    const output: string = await new Promise((resolve, reject) => {
      exec(sshCommand, (error, stdout, stderr) => {
        if (error) return reject(stderr || stdout);
        resolve(stdout + stderr);
      });
    });

    console.log("🔥 VM OUTPUT:\n" + output);

    // ------------------------------------------------------------
    // 4️⃣ Build Live URL
    // ------------------------------------------------------------
    const liveUrl = `https://${subdomain}.piseth.space`;

    // ------------------------------------------------------------
    // 5️⃣ Save Deployment Record
    // ------------------------------------------------------------
    const session = await getServerSession(authOptions);
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
        tempSessionId: userId ? null : tempSessionId,
        port: null,
        buildPath: "",
        projectType: "static",
        liveUrl,
        status: "running",
        userId,
      },
    });

    return NextResponse.json({
      message: "🚀 Deployment started successfully!",
      liveUrl,
    });
  } catch (error: any) {
    console.error("❌ Deployment error:", error);
    return NextResponse.json({ message: error.toString() }, { status: 500 });
  }
}