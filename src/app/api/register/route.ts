import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

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

    return new Response("OK");
}
