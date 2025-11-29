import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // -------------------------------
    // 1. Correct path for Windows + Linux
    // -------------------------------
    const scriptPath = path
      .join(process.cwd(), "infra", "deploy.sh")
      .replace(/\\/g, "/"); // Fix Windows backslashes

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { error: "deploy.sh not found in /infra" },
        { status: 500 }
      );
    }

    // -------------------------------
    // 2. SCP: upload deploy.sh to VM
    // -------------------------------
    const scpCommand =
      `scp -i "${process.env.VM_PRIVATE_KEY_PATH}" ` +
      `-o StrictHostKeyChecking=no ` +
      `"${scriptPath}" ` +
      `${process.env.VM_USER}@${process.env.VM_HOST}:/home/launchly/deploy.sh`;

    console.log("📤 Syncing deploy.sh to VM...");

    await new Promise((resolve, reject) =>
      exec(scpCommand, (err, stdout, stderr) => {
        if (err) {
          console.error(stderr || stdout);
          reject(err);
        } else resolve(null);
      })
    );

    console.log("✔ deploy.sh uploaded");

    // -------------------------------
    // 3. Convert Windows CRLF → Linux LF
    // -------------------------------
    const fixCommand =
      `ssh -i "${process.env.VM_PRIVATE_KEY_PATH}" ` +
      `-o StrictHostKeyChecking=no ` +
      `${process.env.VM_USER}@${process.env.VM_HOST} ` +
      `"dos2unix /home/launchly/deploy.sh"`; // important

    console.log("🔧 Running dos2unix...");

    await new Promise((resolve, reject) =>
      exec(fixCommand, (err, stdout, stderr) => {
        if (err) {
          console.error(stderr || stdout);
          reject(err);
        } else resolve(null);
      })
    );

    console.log("✔ deploy.sh sanitized (LF only)");

    return NextResponse.json({
      success: true,
      message: "deploy.sh synced + sanitized successfully",
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("❌ Sync error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
