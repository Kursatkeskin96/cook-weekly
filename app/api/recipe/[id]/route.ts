import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, context: any) {
  const { params } = context;

  try {
    const meal = await db.meal.findUnique({
      where: {
        id: parseInt(params.id, 10) 
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        username: true,
        ingredients: {
          select: {
            id: true,
            name: true,
            unit: true,
            amount: true,
          }
        },
        createdBy: {
          select: {
            username: true,
          }
        },
      }
    });
    if (!meal) {
      return NextResponse.json({ meal: null, message: 'Meal could not be found' }, { status: 404 });
    }
    return NextResponse.json({ meal }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ meal: null, message: 'Something went wrong', error: "error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  const { params } = context;

  try {
    // Parse the meal ID from the request
    const mealId = parseInt(params.id, 10);

    if (isNaN(mealId)) {
      return NextResponse.json({ message: 'Invalid meal ID' }, { status: 400 });
    }

    // First, attempt to delete all associated ingredients
    await db.ingredient.deleteMany({
      where: { mealId: mealId },
    });

    // Then, delete the meal itself
    const deletedMeal = await db.meal.delete({
      where: { id: mealId },
    });

    if (!deletedMeal) {
      return NextResponse.json({ message: 'Meal not found' }, { status: 404 });
    }

    // Return a success response
    return NextResponse.json({ message: 'Meal and its ingredients deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete meal and its ingredients:', error);
    // For other errors, return a 500 response
    return NextResponse.json({ message: 'Failed to delete the meal', error:  "e" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  const { params } = context;

  try {
      const mealId = parseInt(params.id, 10);

      if (isNaN(mealId)) {
          return NextResponse.json({ message: 'Invalid meal ID' }, { status: 400 });
      }

      const body = await req.json();
      const { name, ingredients } = body;

      // Update the meal
      const updatedMeal = await db.meal.update({
          where: { id: mealId },
          data: {
              name: name,
              // Assume other fields that might need to be updated are included here
          },
      });

      // If there are ingredients to update
      if (ingredients && ingredients.length > 0) {
          // Delete all existing ingredients for the meal
          await db.ingredient.deleteMany({
              where: { mealId: mealId },
          });

          // Add the new set of ingredients
          await Promise.all(
              ingredients.map(ingredient => db.ingredient.create({
                  data: {
                      name: ingredient.name,
                      unit: ingredient.unit,
                      amount: ingredient.amount,
                      mealId: mealId,
                  },
              }))
          );
      }

      if (!updatedMeal) {
          return NextResponse.json({ message: 'Meal not found' }, { status: 404 });
      }

      // Return a success response
      return NextResponse.json({ message: 'Meal updated successfully', updatedMeal }, { status: 200 });
  } catch (error) {
      console.error('Failed to update meal:', error);
      // For other errors, return a 500 response
      return NextResponse.json({ message: 'Failed to update the meal', error: "error" }, { status: 500 });
  }
}