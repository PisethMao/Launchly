/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { execSync, spawn } from "child_process";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const bodyParser = false;

//
// ─────────────────────────────────────────────────────────────
//   MAIN ENTRY — RETURNS IMMEDIATELY SO REDIRECT ALWAYS WORKS
// ─────────────────────────────────────────────────────────────
//
export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const file = formData.get("file") as File;
        const subdomain = formData.get("subdomain") as string;
        const tempSessionId = formData.get("tempSessionId") as string | null;

        if (!file || !subdomain) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Save ZIP file temporarily
        const tempZipPath = `/tmp/${Date.now()}-${file.name}`;
        const arrayBuffer = await file.arrayBuffer();
        fs.writeFileSync(tempZipPath, Buffer.from(arrayBuffer));

        console.log(`📦 ZIP saved to: ${tempZipPath}`);

        // FIRE OFF DEPLOYMENT IN BACKGROUND — NON BLOCKING
        setTimeout(() => {
            deployInBackground(
                tempZipPath,
                file.name,
                subdomain,
                tempSessionId
            ).catch((err) => console.error("🔥 Background deploy error:", err));
        }, 10);

        // RETURN IMMEDIATELY → FRONTEND CAN REDIRECT
        return NextResponse.json({
            ok: true,
            message: "Deployment started",
        });
    } catch (error: any) {
        console.error("❌ Initial error:", error);
        return NextResponse.json(
            { message: error.message ?? "Unexpected error" },
            { status: 500 }
        );
    }
}

//
// ─────────────────────────────────────────────────────────────
//   BACKGROUND DEPLOYMENT (REAL WORK HAPPENS HERE)
//   THIS DOES NOT BLOCK → DOES NOT BREAK REDIRECT
// ─────────────────────────────────────────────────────────────
//
async function deployInBackground(
    tempZipPath: string,
    originalName: string,
    subdomain: string,
    tempSessionId: string | null
) {
    try {
        console.log("🚀 Background deployment started…");

        //
        // ─── MALWARE SCAN ─────────────────────────────────────────────
        //
        console.log("🛡 scanning archive…");
        if (!scanForMalware(tempZipPath)) {
            fs.unlinkSync(tempZipPath);
            console.log("❌ Malware detected!");
            return;
        }

        //
        // ─── EXTRACT ZIP ─────────────────────────────────────────────
        //
        const destPath = `/home/chanchhay/userdeploy/${subdomain}`;
        if (fs.existsSync(destPath)) fs.rmSync(destPath, { recursive: true });
        fs.mkdirSync(destPath, { recursive: true });

        new AdmZip(tempZipPath).extractAllTo(destPath, true);
        console.log("📦 extracted to:", destPath);

        //
        // ─── SCAN EXTRACTED FILES ─────────────────────────────────────
        //
        console.log("🛡 scanning extracted files…");
        const scan = execSync(`clamscan -r ${destPath}`, { encoding: "utf-8" });
        if (!scan.includes("Infected files: 0")) {
            fs.rmSync(destPath, { recursive: true });
            console.log("❌ Malware found in extracted files!");
            return;
        }

        //
        // ─── DETERMINE PROJECT DIRECTORY ──────────────────────────────
        //
        const projectDir = path.join(
            destPath,
            originalName.replace(".zip", "")
        );
        console.log("📁 project directory:", projectDir);

        // Change working directory properly
        process.chdir(projectDir);
        console.log("📍 CWD changed to:", process.cwd());

        //
        // ─── RUN DEPLOY SCRIPT ASYNC ──────────────────────────────────
        //
        const scriptPath = path.join(
            process.cwd(),
            "..",
            "..",
            "..",
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
            "deploy_zip.sh"
        );
        const output = await runDeployScript(
            scriptPath,
            subdomain,
            projectDir,
            "chanchhay.site"
        );

        //
        // ─── PARSE SCRIPT OUTPUT ──────────────────────────────────────
        //
        const portMatch = output.match(/:::PORT:::(\d+):::/);
        const urlMatch = output.match(/:::URL:::(https:\/\/[^\s]+)::::/);

        const port = portMatch ? Number(portMatch[1]) : null;
        const liveUrl = urlMatch ? urlMatch[1] : null;

        if (!port || !liveUrl) {
            console.error("❌ Cannot parse deploy script output:", output);
            return;
        }

        //
        // ─── SAVE DEPLOYMENT TO DATABASE ──────────────────────────────
        //
        const session = await getServerSession(authOptions);
        const email = session?.user?.email ?? null;

        let userId: string | null = null;
        if (email) {
            const user = await prisma.user.findUnique({ where: { email } });
            userId = user?.id ?? null;
        }

        await prisma.deployment.create({
            data: {
                repoUrl: "ZIP Upload",
                subdomain,
                port,
                buildPath: projectDir,
                projectType: "static",
                liveUrl,
                status: "running",
                userId,
                tempSessionId: userId ? null : tempSessionId,
            },
        });

        console.log("🎉 Deployment saved!");
        console.log("🌍 LIVE URL:", liveUrl);
    } catch (err) {
        console.error("💥 deployInBackground fatal:", err);
    }
}

//
// ─────────────────────────────────────────────────────────────
//   UTILS
// ─────────────────────────────────────────────────────────────
//
function scanForMalware(filePath: string): boolean {
    try {
        const output = execSync(`clamscan ${filePath}`, { encoding: "utf-8" });
        return output.includes("Infected files: 0");
    } catch (err) {
        console.error("❌ clamscan failed:", err);
        return false;
    }
}

function runDeployScript(
    script: string,
    sub: string,
    proj: string,
    domain: string
): Promise<string> {
    return new Promise((resolve) => {
        let output = "";
        const child = spawn("bash", [script, sub, proj, domain, "static"]);

        child.stdout.on("data", (d) => (output += d.toString()));
        child.stderr.on("data", (d) => (output += d.toString()));
        child.on("close", () => resolve(output));
    });
}
