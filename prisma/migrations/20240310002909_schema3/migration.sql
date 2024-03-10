/*
  Warnings:

  - You are about to drop the column `meal2` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mealId]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Meal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "meal2";

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_mealId_key" ON "Ingredient"("mealId");

-- CreateIndex
CREATE UNIQUE INDEX "Meal_id_key" ON "Meal"("id");
