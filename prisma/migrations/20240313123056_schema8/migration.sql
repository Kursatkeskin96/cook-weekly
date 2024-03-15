/*
  Warnings:

  - You are about to drop the column `userId` on the `WeeklyMealPlan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `WeeklyMealPlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `WeeklyMealPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WeeklyMealPlan" DROP CONSTRAINT "WeeklyMealPlan_userId_fkey";

-- AlterTable
ALTER TABLE "WeeklyMealPlan" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyMealPlan_username_key" ON "WeeklyMealPlan"("username");

-- AddForeignKey
ALTER TABLE "WeeklyMealPlan" ADD CONSTRAINT "WeeklyMealPlan_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
