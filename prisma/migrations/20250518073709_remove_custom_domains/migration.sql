/*
  Warnings:

  - You are about to drop the column `customDomains` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `selectedDomain` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "customDomains",
DROP COLUMN "selectedDomain";
