import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID!;
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
const CONFIG_PATH = "/home/chanchhay/.cloudflared/config.yml";

// Remove ingress entry from config.yml
function removeIngressEntry(subdomain: string) {
    const hostname = `${subdomain}.chanchhay.site`;

    const config = fs.readFileSync(CONFIG_PATH, "utf8");
    const lines = config.split("\n");

    // Remove the entire ingress block for this subdomain (hostname + service lines)
    const newLines: string[] = [];
    let skipNext = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(`hostname: ${hostname}`)) {
            skipNext = true; // Skip this line and the next one (service line)
            continue;
        }
        if (skipNext && lines[i].includes("service:")) {
            skipNext = false; // Skip the service line
            continue;
        }
        newLines.push(lines[i]);
    }

    fs.writeFileSync(CONFIG_PATH, newLines.join("\n"), "utf8");
}

// Delete DNS record
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

        const deployments = await prisma.deployment.findMany({
            where: { userId: id },
        });

        for (const d of deployments) {
            const folder = `/home/chanchhay/userdeploy/${d.subdomain}`;

            // Stop PM2
            await execAsync(`pm2 delete launchly_${d.subdomain}`);

            // Delete folder
            await execAsync(`rm -rf ${folder}`);

            // Delete DNS
            await deleteCloudflareDNS(d.subdomain);

            // Remove ingress entry
            removeIngressEntry(d.subdomain);
        }

        // Restart cloudflared so changes apply
        await execAsync("pm2 restart cloudflare-tunnel >/dev/null 2>&1 &");

        // Delete DB entries
        await prisma.deployment.deleteMany({ where: { userId: id } });
        await prisma.user.delete({ where: { id } });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
