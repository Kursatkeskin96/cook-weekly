import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, context: any) {
  const { params } = context;
// Debug: Log the params to see what you're getting

  try {
    let calendar;

    if (params.username) {
      calendar = await db.calendar.findMany({
        where: {
          username: params.username
        },
        select: {
          id: true,
          username: true,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true
        }
      });
    }

    return NextResponse.json({ calendar }, { status: 200 });
  } catch (error) {
    console.error(error); // Debug: Log the error if any
    return NextResponse.json({ calendar: null, message: 'Something went wrong', error: "error" }, { status: 500 });
  }
}
export async function PUT(req: Request, context: any) {
  const { params } = context;

  try {
    const body = await req.json();
    const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = body;

    // Assuming there's a unique calendar entry per username. Adjust accordingly if it's different.
    const updatedCalendar = await db.calendar.update({
      where: {
        username: params.username // Make sure this matches your schema's unique or primary key.
      },
      data: {
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday
      }
    });

    return NextResponse.json({ updatedCalendar }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update calendar', error: "error" }, { status: 500 });
  }
}
