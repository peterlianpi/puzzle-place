/*
  Warnings:

  - You are about to drop the column `windowEnd` on the `rateLimit` table. All the data in the column will be lost.
  - The `lastRequest` column on the `rateLimit` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "rateLimit" DROP COLUMN "windowEnd",
DROP COLUMN "lastRequest",
ADD COLUMN     "lastRequest" BIGINT NOT NULL DEFAULT 0;
