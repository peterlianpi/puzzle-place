/*
  Warnings:

  - Made the column `windowEnd` on table `rateLimit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "rateLimit" ALTER COLUMN "windowEnd" SET NOT NULL,
ALTER COLUMN "windowEnd" SET DEFAULT CURRENT_TIMESTAMP;
