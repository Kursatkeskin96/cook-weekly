// pages/api/meal.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Make sure this path is correct

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { mealName, ingredients, userName } = body;

        const newMeal = await db.meal.create({
            data: {
                name: mealName,
                createdBy: {
                    connect: { username: userName },
                },
            },
        });

        if (ingredients && ingredients.length > 0) {
            await Promise.all(
                ingredients.map(ingredient =>
                    db.ingredient.create({
                        data: {
                            name: ingredient.name,
                            unit: ingredient.unit,
                            amount: ingredient.amount,
                            mealId: newMeal.id,
                        },
                    })
                )
            );
        }

        return NextResponse.json({ newMeal, message: "Meal created successfully" }, { status: 200 });
    } catch (error) {
        console.error("Failed to create meal:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

export async function GET() {
    try {
      const meals = await db.meal.findMany({
        select: {
          id: true,
          name: true,
          username: true,
          ingredients: true,
          createdAt: true,
        }
      });
      return NextResponse.json({ meals }); 
    } catch (error) {
      return NextResponse.json({ message: "something went wrong", error: "err" });
    }
}