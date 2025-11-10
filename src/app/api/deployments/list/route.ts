import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Deployment {
  createdAt: string;
}

export const dynamic = "force-dynamic";

export async function GET() {
  const filePath = path.join(process.cwd(), "deployments.json");
  let deployments: Deployment[] = [];
  if (fs.existsSync(filePath)) {
    deployments = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  deployments.sort((a: Deployment, b: Deployment) =>
    (b.createdAt || "").localeCompare(a.createdAt || "")
  );
  return NextResponse.json({ deployments });
}
