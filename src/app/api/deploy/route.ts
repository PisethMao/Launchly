import { saveDeployment } from "@/lib/saveDeployment";
import { exec } from "child_process";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function toSubdomain(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, "");
}

export async function POST(req: Request) {
  try {
    const { repoUrl, branch, projectName } = await req.json();
    if (!repoUrl || !branch || !projectName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const jobId = Date.now().toString();
    const subdomain = toSubdomain(projectName);
    const domain = `${subdomain}.piseth.space`;

    const sshCommand = `ssh -o StrictHostKeyChecking=no -i /home/launchly/.ssh/id_ed25519 launchly@192.168.1.5 "/home/launchly/deploy.sh '${repoUrl}' '${branch}' '${subdomain}' '${jobId}'"`;

    exec(sshCommand, { maxBuffer: 10 * 1024 * 1024 }, async (error, stderr) => {
      if (error) {
        console.error("Deploy Error:", stderr || error.message);

        await saveDeployment({
          jobId,
          projectName,
          domain: null,
          status: "failed",
          error: stderr || error.message,
          createdAt: new Date().toISOString(),
        });
        return;
      }

      await saveDeployment({
        jobId,
        projectName,
        domain,
        status: "live",
        createdAt: new Date().toISOString(),
      });

      console.log("✅ Deployment Recorded:", domain);
    });

    return NextResponse.json({ status: "ok", jobId, domain });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
