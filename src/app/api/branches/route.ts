import { spawnSync } from "child_process";
import { NextResponse } from "next/server";

/* -------------------------------------------------
   Helper: Build secure clone URL for any repository
---------------------------------------------------*/
export function buildCloneUrl(originalUrl: string): string {
    let url = originalUrl.trim();

    // If SSH form (git@github.com:user/repo.git), leave as-is
    if (url.startsWith("git@")) return url;

    // Handle HTTPS repos
    if (url.startsWith("https://")) {
        const host = new URL(url).host;
        const ghToken = process.env.GITHUB_TOKEN;
        const glToken = process.env.GITLAB_TOKEN;

        if (host.includes("github.com") && ghToken) {
            url = url.replace("https://", `https://${ghToken}@`);
        } else if (host.includes("gitlab.com") && glToken) {
            url = url.replace("https://", `https://oauth2:${glToken}@`);
        }
    }
    return url;
}

export async function POST(req: Request) {
    const { repoUrl } = await req.json();
    // Ensure we use the same token-injection logic as the deploy flow so
    // HTTPS requests include tokens when available and Git won't prompt.
    const finalUrl = buildCloneUrl(repoUrl);

    const result = spawnSync(
        "git",
        ["ls-remote", "--heads", finalUrl],
        {
            encoding: "utf-8",
            env: {
                ...process.env,
                // disable interactive prompts from git
                GIT_TERMINAL_PROMPT: "0",
            },
            // keep stdout/stderr available in the returned object
        }
    );
    if (result.status !== 0) {
        return NextResponse.json({ branches: [] });
    }
    const branches = result.stdout
        .split("\n")
        .map((line) => {
            // ls-remote format: <hash>\trefs/heads/<branch>
            const parts = line.split(/\s+/);
            const ref = parts[1] || "";
            return ref.replace("refs/heads/", "");
        })
        .filter(Boolean);
    return NextResponse.json({ branches });
}
