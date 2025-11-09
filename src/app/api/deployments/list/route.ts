import { execSync } from "child_process";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const output = execSync(
      `ssh launchly@192.168.1.5 "ls /srv/launchly/work"`,
      { encoding: "utf-8" }
    );
    const jobIds = output
      .trim()
      .split("\n")
      .filter((line) => /^\d+$/.test(line));
    const deployments = jobIds.map((jobId) => ({
      jobId,
      project: jobId,
      branch: "unknown",
      repo: "unknown",
    }));
    return NextResponse.json({ deployments });
  } catch (error: unknown) {
    console.error(
      "READ DEPLOYMENTS FAILED:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json({ deployments: [] });
  }
}
