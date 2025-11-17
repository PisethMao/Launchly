-- CreateTable
CREATE TABLE "Deployment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repoUrl" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "buildPath" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "liveUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "tempSessionId" TEXT,
    CONSTRAINT "Deployment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_subdomain_key" ON "Deployment"("subdomain");
