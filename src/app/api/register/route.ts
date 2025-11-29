import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;

export async function POST(req: Request) {
  const { name, email, password, tempSessionId } = await req.json(); // Get tempSessionId from body
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return new Response("User already exists", { status: 400 });

  const hashed = await bcrypt.hash(password, 10);

  // 1️⃣ Create the new user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      plan: "Free",
    },
  });

  // 2️⃣ Link guest deployments (if any) to the new user
  if (tempSessionId) {
    await prisma.deployment.updateMany({
      where: { tempSessionId },
      data: { userId: user.id, tempSessionId: null },
    });
    console.log(
      `✅ Linked deployments from temp session ${tempSessionId} → user ${user.id}`
    );
  }

    // 2️⃣ Link guest deployments (if any) to the new user
    if (tempSessionId) {
        await prisma.deployment.updateMany({
            where: { tempSessionId },
            data: { userId: user.id, tempSessionId: null },
        });
        console.log(
            `✅ Linked deployments from temp session ${tempSessionId} → user ${user.id}`
        );
    }
    try {
        await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                event: "USER_SIGNUP",
                name: user.name,
                email: user.email,
                userId: user.id,
            }),
        });
    } catch (err) {
        console.error("Failed to notify n8n:", err);
    }

    return new Response("OK");
}
