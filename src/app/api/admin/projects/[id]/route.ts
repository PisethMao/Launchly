import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

// adjust if needed
const CONFIG_PATH =
    process.env.CF_CONFIG_PATH || "/home/chanchhay/.cloudflared/config.yml";

// Cloudflare config
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID!;
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;

// --- remove ingress entry from config.yml ---
function removeIngressEntry(subdomain: string) {
    const hostname = `${subdomain}.chanchhay.site`;

    const config = fs.readFileSync(CONFIG_PATH, "utf8");
    const lines = config.split("\n");

    const newLines: string[] = [];
    let skipNextServiceLine = false;

    for (const line of lines) {
        if (
            line.includes(`hostname: "${hostname}"`) ||
            line.includes(`hostname: ${hostname}`)
        ) {
            // skip this line and the next line (service)
            skipNextServiceLine = true;
            continue;
        }

        if (skipNextServiceLine) {
            // assume this is the `service` line
            skipNextServiceLine = false;
            continue;
        }

        newLines.push(line);
    }

    fs.writeFileSync(CONFIG_PATH, newLines.join("\n"), "utf8");
}

// --- delete DNS record ---
async function deleteCloudflareDNS(subdomain: string) {
    const fullDomain = `${subdomain}.chanchhay.site`;

    const listUrl = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?name=${fullDomain}`;

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CF_API_TOKEN}`,
    };

    const records = await fetch(listUrl, { headers }).then((r) => r.json());

    if (!records.result || records.result.length === 0) return;

    const recordId = records.result[0].id;

    await fetch(
        `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${recordId}`,
        { method: "DELETE", headers }
    );
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { params } = context;
        const { id } = await params;
        const deploymentId = Number(id);

        if (Number.isNaN(deploymentId)) {
            return NextResponse.json(
                { error: "Invalid project id" },
                { status: 400 }
            );
        }

        const deployment = await prisma.deployment.findUnique({
            where: { id: deploymentId },
        });

        if (!deployment) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        const subdomain = deployment.subdomain;
        const folder = `/home/chanchhay/userdeploy/${subdomain}`;
        const pm2Name = `launchly_${subdomain}`;

        // Stop PM2 process
        await execAsync(`pm2 delete ${pm2Name}`).catch(() => {});

        // Remove folder
        await execAsync(`rm -rf ${folder}`).catch(() => {});

        // Remove DNS
        await deleteCloudflareDNS(subdomain).catch(() => {});

        // Remove ingress entry from config.yml
        try {
            removeIngressEntry(subdomain);
            await execAsync("pm2 restart cloudflare-tunnel >/dev/null 2>&1 &").catch(() => {});
        } catch (err) {
            console.error("Failed to update cloudflared config:", err);
        }

        // Remove from database
        await prisma.deployment.delete({
            where: { id: deploymentId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete project error:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
