-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Deployment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repoUrl" TEXT,
    "subdomain" TEXT NOT NULL,
    "port" INTEGER,
    "buildPath" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "liveUrl" TEXT,
    "projectName" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "tempSessionId" TEXT,
    CONSTRAINT "Deployment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Deployment" ("buildPath", "createdAt", "id", "liveUrl", "port", "projectType", "repoUrl", "status", "subdomain", "tempSessionId", "updatedAt", "userId") SELECT "buildPath", "createdAt", "id", "liveUrl", "port", "projectType", "repoUrl", "status", "subdomain", "tempSessionId", "updatedAt", "userId" FROM "Deployment";
DROP TABLE "Deployment";
ALTER TABLE "new_Deployment" RENAME TO "Deployment";
CREATE UNIQUE INDEX "Deployment_subdomain_key" ON "Deployment"("subdomain");
PRAGMA foreign_key_check("Deployment");
PRAGMA foreign_keys=ON;
