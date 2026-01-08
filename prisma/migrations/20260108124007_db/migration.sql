/*
  Warnings:

  - You are about to drop the column `windowStart` on the `rateLimit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rateLimit" DROP COLUMN "windowStart",
ADD COLUMN     "lastRequest" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
