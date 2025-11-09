import { exec } from "child_process";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { repoUrl, branch, projectName } = await req.json();
    if (!repoUrl || !branch || !projectName) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }
    const jobId = Date.now().toString();
    const sshCommand = `ssh launchly@192.168.1.5 "~/deploy.sh '${repoUrl}' '${branch}' '${projectName}' '${jobId}'"`;
    exec(sshCommand, (error, stderr) => {
      if (error) {
        console.error("Deploy error: ", stderr);
      }
    });
    return NextResponse.json({ message: "Deployment started.", jobId });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
