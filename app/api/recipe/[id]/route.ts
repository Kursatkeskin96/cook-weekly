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
