/*
  Warnings:

  - A unique constraint covering the columns `[providerId,accountId]` on the table `account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier,value]` on the table `verification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "verification_identifier_idx";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "PasswordHash" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "emailVerified" DROP NOT NULL;

-- AlterTable
ALTER TABLE "verification" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "rateLimit" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "windowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "windowEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rateLimit_key_key" ON "rateLimit"("key");

-- CreateIndex
CREATE INDEX "Tbl_EventPrizePool_EventID_idx" ON "Tbl_EventPrizePool"("EventID");

-- CreateIndex
CREATE INDEX "Tbl_GameEvent_CreatorUserID_idx" ON "Tbl_GameEvent"("CreatorUserID");

-- CreateIndex
CREATE INDEX "Tbl_GameEvent_IsActive_idx" ON "Tbl_GameEvent"("IsActive");

-- CreateIndex
CREATE INDEX "Tbl_GameEvent_CreatedAt_idx" ON "Tbl_GameEvent"("CreatedAt");

-- CreateIndex
CREATE INDEX "Tbl_GameHistory_EventID_idx" ON "Tbl_GameHistory"("EventID");

-- CreateIndex
CREATE INDEX "Tbl_GameHistory_PlayerUserID_idx" ON "Tbl_GameHistory"("PlayerUserID");

-- CreateIndex
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "account"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_identifier_value_key" ON "verification"("identifier", "value");

-- AddForeignKey
ALTER TABLE "verification" ADD CONSTRAINT "verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
