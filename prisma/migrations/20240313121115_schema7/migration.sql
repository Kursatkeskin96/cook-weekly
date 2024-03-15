/*
  Warnings:

  - You are about to drop the column `friday` on the `WeeklyMealPlan` table. All the data in the column will be lost.
  - You are about to drop the column `saturday` on the `WeeklyMealPlan` table. All the data in the column will be lost.
  - You are about to drop the column `sunday` on the `WeeklyMealPlan` table. All the data in the column will be lost.
  - You are about to drop the column `thursday` on the `WeeklyMealPlan` table. All the data in the column will be lost.
  - You are about to drop the column `tuesday` on the `WeeklyMealPlan` table. All the data in the column will be lost.
  - You are about to drop the column `wednesday` on the `WeeklyMealPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WeeklyMealPlan" DROP COLUMN "friday",
DROP COLUMN "saturday",
DROP COLUMN "sunday",
DROP COLUMN "thursday",
DROP COLUMN "tuesday",
DROP COLUMN "wednesday",
ALTER COLUMN "monday" DROP NOT NULL,
ALTER COLUMN "monday" SET DATA TYPE TEXT;
