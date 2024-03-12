-- CreateTable
CREATE TABLE "WeeklyMealPlan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "monday" INTEGER[],
    "tuesday" INTEGER[],
    "wednesday" INTEGER[],
    "thursday" INTEGER[],
    "friday" INTEGER[],
    "saturday" INTEGER[],
    "sunday" INTEGER[],

    CONSTRAINT "WeeklyMealPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeeklyMealPlan" ADD CONSTRAINT "WeeklyMealPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
