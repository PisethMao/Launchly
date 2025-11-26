/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import formidable from "formidable";
import { exec } from "child_process";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Readable } from "stream";

export const runtime = "nodejs";

// Convert Next.js Request → Node IncomingMessage
async function toNodeRequest(req: Request): Promise<any> {
  const contentType = req.headers.get("content-type");
  const contentLength = req.headers.get("content-length");

  const body = Buffer.from(await req.arrayBuffer());

  const nodeReq: any = new Readable();
  nodeReq._read = () => {};
  nodeReq.push(body);
  nodeReq.push(null);

  nodeReq.headers = {
    "content-type": contentType || "",
    "content-length": contentLength || body.length.toString(),
  };

  return nodeReq;
}

export async function POST(req: Request) {
  try {
    // ------------------------------------------------------------
    // 1️⃣ Convert request & parse multipart data
    // ------------------------------------------------------------
    const nodeReq = await toNodeRequest(req);

    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir: "/tmp",
    });

    const parsed = await new Promise<any>((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const projectName = parsed.fields.projectName?.[0];
    const file = parsed.files.file?.[0];

    if (!projectName || !file) {
      return NextResponse.json(
        { message: "Project name and ZIP required" },
        { status: 400 }
      );
    }

    const localZipPath = file.filepath;
    const fileName = file.originalFilename || "upload.zip";

    // ------------------------------------------------------------
    // 2️⃣ Upload ZIP to VM
    // ------------------------------------------------------------
    const remoteZipPath = `/home/launchly/uploads/${Date.now()}_${fileName}`;

    const scpCmd = `scp -i ${process.env.VM_PRIVATE_KEY_PATH} -o StrictHostKeyChecking=no ${localZipPath} ${process.env.VM_USER}@${process.env.VM_HOST}:${remoteZipPath}`;

    await new Promise((resolve, reject) => {
      exec(scpCmd, (error, stdout, stderr) => {
        if (error) return reject(stderr || stdout);
        resolve(stdout);
      });
    });

    // ------------------------------------------------------------
    // 3️⃣ Run deploy-zip.sh
    // ------------------------------------------------------------
    const sshCmd =
      `ssh -i ${process.env.VM_PRIVATE_KEY_PATH} ` +
      `-o StrictHostKeyChecking=no ` +
      `${process.env.VM_USER}@${process.env.VM_HOST} ` +
      `"bash /home/launchly/deploy-zip.sh '${remoteZipPath}' '${projectName}'"`;

    const deployOutput: string = await new Promise((resolve, reject) => {
      exec(sshCmd, (error, stdout, stderr) => {
        if (error) return reject(stderr || stdout);
        resolve(stdout + stderr);
      });
    });

    console.log("🔥 ZIP DEPLOY OUTPUT:\n" + deployOutput);

    const liveUrl = `https://${projectName}.piseth.space`;

    // ------------------------------------------------------------
    // 4️⃣ Get logged-in user
    // ------------------------------------------------------------
    const session = await getServerSession(authOptions);
    const email = session?.user?.email || null;

    let userId: string | null = null;
    if (email) {
      const user = await prisma.user.findUnique({ where: { email } });
      userId = user?.id || null;
    }

    // ------------------------------------------------------------
    // 5️⃣ Save deployment
    // ------------------------------------------------------------
    await prisma.deployment.create({
      data: {
        repoUrl: null,
        subdomain: projectName,
        tempSessionId: null,
        port: null,
        buildPath: "",
        projectType: "static",
        liveUrl,
        status: "running",
        userId,
      },
    });

    return NextResponse.json({
      message: "🎉 ZIP deployment started!",
      liveUrl,
    });
  } catch (error: any) {
    console.error("❌ ZIP Deployment Error:", error);
    return NextResponse.json({ message: error.toString() }, { status: 500 });
  }
}
