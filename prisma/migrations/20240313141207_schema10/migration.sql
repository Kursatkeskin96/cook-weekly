/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `friday` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `saturday` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `sunday` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `thursday` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `tuesday` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `wednesday` on the `Calendar` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Calendar" DROP CONSTRAINT "Calendar_username_fkey";

-- AlterTable
ALTER TABLE "Calendar" DROP COLUMN "createdAt",
DROP COLUMN "friday",
DROP COLUMN "saturday",
DROP COLUMN "sunday",
DROP COLUMN "thursday",
DROP COLUMN "tuesday",
DROP COLUMN "updatedAt",
DROP COLUMN "username",
DROP COLUMN "wednesday";
