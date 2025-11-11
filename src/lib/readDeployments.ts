import fs from "fs";
import path from "path";
const filePath = path.join(process.cwd(), "deployments.json");
export function readDeployments() {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as unknown[];
  } catch {
    return [];
  }
}
