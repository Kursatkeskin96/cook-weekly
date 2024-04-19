import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, context: any) {
  const { params } = context;
// Debug: Log the params to see what you're getting

  try {
    let meal;

    if (params.username) {
      meal = await db.meal.findMany({
        where: {
          username: params.username
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
    }

    if (!meal || meal.length === 0) {
      return NextResponse.json({ meal: null, message: 'Meal could not be found' }, { status: 404 });
    }

    return NextResponse.json({ meal }, { status: 200 });
  } catch (error) {
    console.error(error); // Debug: Log the error if any
    return NextResponse.json({ meal: null, message: 'Something went wrong', error: "error" }, { status: 500 });
  }
}