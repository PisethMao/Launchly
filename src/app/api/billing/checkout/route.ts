import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    url: "/billing?status=fake-checkout",
    message: "Fake checkout completed. Billing is not implmented yet",
  });
}
