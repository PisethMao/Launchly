import { NextResponse } from "next/server";
import { spawnSync } from "child_process";

// ------------------------------
// GITHUB visibility
// ------------------------------
async function isGitHubPrivate(repoUrl: string, token?: string) {
  if (!repoUrl.includes("github.com")) return null;

  const clean = repoUrl.replace("https://github.com/", "").replace(".git", "");
  const apiUrl = `https://api.github.com/repos/${clean}`;

  const res = await fetch(apiUrl, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 404 || res.status === 403) return true;

  const data = await res.json();
  return data.private === true;
}

// ------------------------------
// GITLAB visibility (API uses lowercase)
// ------------------------------
async function isGitLabPrivate(repoUrl: string, token?: string) {
  if (!repoUrl.includes("gitlab.com")) return null;

  const cleanLower = repoUrl
    .replace("https://gitlab.com/", "")
    .replace(".git", "")
    .trim()
    .toLowerCase();

  const encoded = encodeURIComponent(cleanLower);

  const res = await fetch(`https://gitlab.com/api/v4/projects/${encoded}`, {
    headers: token ? { "PRIVATE-TOKEN": token } : {},
  });

  if (res.status === 401 || res.status === 403) return true;
  if (res.status === 200) {
    const data = await res.json();
    return data.visibility === "private";
  }

  return true;
}

// ------------------------------
// MAIN
// ------------------------------
export async function POST(req: Request) {
  const { repoUrl, userToken } = await req.json();

  const isGitHub = repoUrl.includes("github.com");
  const isGitLab = repoUrl.includes("gitlab.com");

  let isPrivate = null;

  if (isGitHub) isPrivate = await isGitHubPrivate(repoUrl, userToken);
  if (isGitLab) isPrivate = await isGitLabPrivate(repoUrl, userToken);

  if (isPrivate && !userToken) {
    return NextResponse.json({ private: true, branches: [] });
  }

  // ------------------------------
  // Build clone URL (correct case!)
  // ------------------------------
  let cloneUrl = repoUrl;

  if (userToken) {
    if (isGitHub) {
      cloneUrl = repoUrl.replace("https://", `https://${userToken}@`);
    }

    if (isGitLab) {
      const cleanOriginal = repoUrl
        .replace("https://gitlab.com/", "")
        .replace(".git", "")
        .trim(); // KEEP EXACT CASE

      cloneUrl = `https://oauth2:${userToken}@gitlab.com/${cleanOriginal}.git`;
    }
  }

  // ------------------------------
  // Fetch branches
  // ------------------------------
  const result = spawnSync("git", ["ls-remote", "--heads", cloneUrl], {
    encoding: "utf-8",
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });

  if (result.status !== 0 || !result.stdout.trim()) {
    return NextResponse.json({ private: true, branches: [] });
  }

  const branches = result.stdout
    .split("\n")
    .map((line) => line.split(/\s+/)[1]?.replace("refs/heads/", ""))
    .filter(Boolean);

  return NextResponse.json({ private: false, branches });
}