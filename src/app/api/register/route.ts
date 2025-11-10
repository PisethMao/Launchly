import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return new Response("User already exists", { status: 400 });
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      plan: "Free",
    },
  });
  return new Response("OK");
}
