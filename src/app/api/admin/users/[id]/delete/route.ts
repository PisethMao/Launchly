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

    const newLines = lines.filter(
        (line) =>
            !line.includes(`hostname: ${hostname}`) &&
            !line.includes(`service: http://localhost`)
    );

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
            await execAsync(`pm2 delete launchly_${d.subdomain}`).catch(
                () => {}
            );

            // Delete folder
            await execAsync(`rm -rf ${folder}`).catch(() => {});

            // Delete DNS
            await deleteCloudflareDNS(d.subdomain);

            // Remove ingress entry
            removeIngressEntry(d.subdomain);
        }

        // Restart cloudflared so changes apply
        await execAsync("pm2 restart cloudflare-tunnel");

        // Delete DB entries
        await prisma.deployment.deleteMany({ where: { userId: id } });
        await prisma.user.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
