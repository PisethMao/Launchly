import fs from "fs";
import path from "path";
const filePath = path.join(process.cwd(), "deployments.json");
export async function saveDeployment(record: unknown) {
  let data: unknown[] = [];
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  data.push(record);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
