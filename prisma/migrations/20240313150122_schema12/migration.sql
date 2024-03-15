/*
  Warnings:

  - Added the required column `friday` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saturday` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sunday` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thursday` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tuesday` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wednesday` to the `Calendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Calendar" ADD COLUMN     "friday" TEXT NOT NULL,
ADD COLUMN     "saturday" TEXT NOT NULL,
ADD COLUMN     "sunday" TEXT NOT NULL,
ADD COLUMN     "thursday" TEXT NOT NULL,
ADD COLUMN     "tuesday" TEXT NOT NULL,
ADD COLUMN     "wednesday" TEXT NOT NULL;
