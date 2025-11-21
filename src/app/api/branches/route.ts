import { spawnSync } from "child_process";
import { NextResponse } from "next/server";

/* -------------------------------------------------
   Build clone URL using user-provided token
---------------------------------------------------*/
// export function buildCloneUrl(originalUrl: string, token?: string): string {
//     const url = originalUrl.trim();

//     // SSH URLs don't need token
//     if (url.startsWith("git@")) return url;

//     if (url.startsWith("https://") && token) {
//         const host = new URL(url).host;

//         // GitHub private repo
//         if (host.includes("github.com")) {
//             return url.replace("https://", `https://${token}@`);
//         }

//         // GitLab private repo
//         if (host.includes("gitlab.com")) {
//             return url.replace("https://", `https://oauth2:${token}@`);
//         }
//     }

//     return url;
// }

export function buildCloneUrl(repoUrl: string, personalToken?: string) {
    if (!personalToken) return repoUrl.trim();

    let url = repoUrl.trim();

    // Normalize SSH → HTTPS
    if (url.startsWith("git@")) {
        url = url.replace("git@", "https://").replace(":", "/");
    }

    // Force .git suffix (GitLab requires it)
    if (!url.endsWith(".git")) {
        url += ".git";
    }

    // GITHUB
    if (url.includes("github.com")) {
        return url.replace(/^https:\/\//, `https://${personalToken}@`);
    }

    // GITLAB
    if (url.includes("gitlab.com")) {
        return url.replace(
            /^https:\/\//,
            `https://oauth2:${personalToken}@`
        );
    }

    // fallback
    return url.replace(/^https:\/\//, `https://${personalToken}@`);
}


/* -------------------------------------------------
   Main handler
---------------------------------------------------*/
export async function POST(req: Request) {
    const { repoUrl, personalToken } = await req.json();

    if (!repoUrl) {
        return NextResponse.json(
            { error: "Missing repository URL" },
            { status: 400 }
        );
    }

    // First attempt → no token (unless provided)
    const cloneUrl = buildCloneUrl(repoUrl, personalToken);

    // const result = spawnSync("git", ["ls-remote", "--heads", cloneUrl], {
    //     encoding: "utf-8",
    //     env: {
    //         ...process.env,
    //         GIT_TERMINAL_PROMPT: "0",
    //         GCM_INTERACTIVE: "Never", // disables VS Code credential popup
    //         GIT_ASKPASS: "echo", // forces empty credentials
    //     },
    // });

    const result = spawnSync("git", ["ls-remote", "--heads", cloneUrl], {
    encoding: "utf-8",
    env: {
        ...process.env,

        // Kill ALL prompting
        GIT_TERMINAL_PROMPT: "0",
        GIT_ASKPASS: "echo",
        GCM_INTERACTIVE: "Never",

        // Kill Credential Manager
        GIT_CREDENTIAL_HELPER: " ",
        GIT_CREDENTIAL_USEHTTPPATH: "0",

        // Prevent VS Code from injecting credentials
        GIT_EXEC_PATH: "",
        GIT_CONFIG_GLOBAL: "/dev/null",
    },
});


    // ---------------------- PRIVATE REPO DETECTED ----------------------
    // Status 128 = authentication error, repo not found, permission denied, etc.
    if (result.status !== 0) {
        // If token NOT provided → tell frontend “private repo”
        if (!personalToken) {
            return NextResponse.json(
                { private: true, message: "Token required for private repo" },
                { status: 401 }
            );
        }

        // Token WAS provided but still failing → invalid token
        return NextResponse.json(
            { error: "Invalid token or no access", debug: result.stderr },
            { status: 403 }
        );
    }

    // ---------------------- SUCCESS: extract branches ----------------------
    const branches = result.stdout
        .split("\n")
        .map((line) => {
            const parts = line.split(/\s+/);
            const ref = parts[1] || "";
            return ref.replace("refs/heads/", "");
        })
        .filter(Boolean);

    return NextResponse.json({ branches });
}
