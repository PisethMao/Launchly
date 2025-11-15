/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { execSync, spawnSync } from "child_process";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Remove 'edge' runtime, use Node.js
export const bodyParser = false;

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const file = formData.get("file") as File;
        const subdomain = formData.get("subdomain") as string;
        const tempSessionId = formData.get("tempSessionId") as string | null;

        if (!file || !subdomain) {
            return NextResponse.json(
                { message: "Missing file or subdomain" },
                { status: 400 }
            );
        }

        // Save uploaded ZIP temporarily
        const tempZipPath = `/tmp/${Date.now()}-${file.name}`;
        const arrayBuffer = await file.arrayBuffer();
        fs.writeFileSync(tempZipPath, Buffer.from(arrayBuffer));

        console.log("📦 Uploaded ZIP saved:", tempZipPath);

        // ------------------- 🛡 Step 1: Virus Scan -------------------
        console.log("🛡 Scanning ZIP with ClamAV...");
        const scanResult = scanForMalware(tempZipPath);
        if (!scanResult) {
            fs.unlinkSync(tempZipPath);
            return NextResponse.json(
                { message: "⚠️ Malware detected. Upload rejected." },
                { status: 400 }
            );
        }

        // ------------------- 🛡 Step 2: Extract Safely -------------------
        const destPath = `/home/chanchhay/userdeploy/${subdomain}`;
        if (fs.existsSync(destPath)) fs.rmSync(destPath, { recursive: true });
        fs.mkdirSync(destPath, { recursive: true });

        const zip = new AdmZip(tempZipPath);
        zip.extractAllTo(destPath, true);

        console.log("📦 ZIP extracted safely.");

        // ------------------- 🛡 Step 3: Scan extracted files -------------------
        console.log("🛡 Scanning extracted files...");
        const extractScan = execSync(`clamscan -r ${destPath}`, {
            encoding: "utf-8",
        });
        if (!extractScan.includes("Infected files: 0")) {
            fs.rmSync(destPath, { recursive: true });
            return NextResponse.json(
                { message: "⚠️ Malware detected in extracted contents." },
                { status: 400 }
            );
        }

        // ------------------- 🧩 Step 4: Handle Project Path and Deploy -------------------
        const projectPath = path.join(destPath, file.name.replace(".zip", ""));
        console.log("📁 Project Path:", projectPath);

        // Ensure we're in the correct directory before starting the project
        execSync(`cd ${projectPath}`, { stdio: "inherit" });

        // ------------------- 🧩 Run deploy script -------------------
        const scriptPath = path.join(
            process.cwd(),
            "src",
            "app",
            "scripts",
            "deploy_zip.sh"
        );
        const domain = "chanchhay.site";
        const deploy = spawnSync("bash", [
            scriptPath,
            subdomain,
            projectPath,
            domain,
            "static",
        ]);

        const output =
            deploy.stdout.toString() + "\n" + deploy.stderr.toString();
        console.log(output);

        // ⛔️ FIX: Extract the port and URL from script output
        const portMatch = output.match(/:::PORT:::(\d+):::/);
        const liveUrlMatch = output.match(/:::URL:::(https:\/\/[^\s]+)::::/);

        const port = portMatch ? Number(portMatch[1]) : null; // Ensure port is a number
        const liveUrl = liveUrlMatch ? liveUrlMatch[1] : null;

        if (!port || !liveUrl) {
            console.error("❌ Deploy script output invalid", output);
            return NextResponse.json(
                { message: "Deploy script failed", output },
                { status: 500 }
            );
        }

        // ------------------- Save Deployment Information -------------------
        const session = await getServerSession(authOptions);
        const email = session?.user?.email || null;
        let userId: string | null = null;

        if (email) {
            const user = await prisma.user.findUnique({ where: { email } });
            userId = user?.id || null;
        }

        // Save deployment details to the database
        try {
            await prisma.deployment.create({
                data: {
                    repoUrl: "ZIP Upload",
                    subdomain,
                    port,
                    buildPath: projectPath,
                    projectType: "static",
                    liveUrl,
                    status: "running",
                    userId,
                    tempSessionId: userId ? null : tempSessionId,
                },
            });
            console.log("✅ Deployment recorded in database");
        } catch (error) {
            console.error("❌ Error saving deployment:", error);
            return NextResponse.json(
                { message: "Database save failed", error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "✅ ZIP uploaded and deployed!",
            liveUrl,
        });
    } catch (error: any) {
        console.error("❌ Error in deploy ZIP:", error);
        return NextResponse.json(
            { message: error.message || "Unexpected error" },
            { status: 500 }
        );
    }
}

function scanForMalware(filePath: string): boolean {
    try {
        const output = execSync(`clamscan ${filePath}`, { encoding: "utf-8" });
        console.log("🛡 ClamAV result:", output);
        return output.includes("Infected files: 0");
    } catch (err) {
        console.error("❌ ClamAV failed:", err);
        return false;
    }
}
