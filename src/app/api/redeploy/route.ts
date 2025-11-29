import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exec } from "child_process";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const deployment = await prisma.deployment.findUnique({
      where: { id },
    });

    if (!deployment) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const { repoUrl, subdomain } = deployment;
    const branch = "master"; // or read from DB if stored

    const command =
      `ssh -i ${process.env.VM_PRIVATE_KEY_PATH} ` +
      `-o StrictHostKeyChecking=no ` +
      `${process.env.VM_USER}@${process.env.VM_HOST} ` +
      `"bash /home/launchly/deploy.sh \\"${repoUrl}\\" \\"${branch}\\" \\"${subdomain}\\" \\"\\" "`;

    const result = await new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) reject(stderr || stdout);
        resolve(stdout + stderr);
      });
    });

    console.log("Redeploy output:", result);

    return NextResponse.json({ message: "Redeploy started!" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}