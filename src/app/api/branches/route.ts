import { spawnSync } from "child_process";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { repoUrl } = await req.json();
  const result = spawnSync("git", ["ls-remote", "--heads", repoUrl], {
    encoding: "utf-8",
  });
  if (result.status !== 0) {
    return NextResponse.json({ branches: [] });
  }
  const branches = result.stdout
    .split("\n")
    .map((line) => line.split("refs/heads/")[1])
    .filter(Boolean);
  return NextResponse.json({ branches });
}
