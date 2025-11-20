import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email;
    const plan = body.plan ?? "pro";
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    await prisma.user.update({
      where: { email },
      data: { plan },
    });
    return NextResponse.json({
      success: true,
      message: `User ${email} upgraded to ${plan}`,
    });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
