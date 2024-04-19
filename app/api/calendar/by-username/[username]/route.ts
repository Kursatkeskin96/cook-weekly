import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, context: any) {
  const { params } = context;
// Debug: Log the params to see what you're getting

  try {
    let calendar;

    if (params.username) {
      calendar = await db.column.findMany({
        where: {
          username: params.username
        },
        select: {
          id: true,
          username: true,
          title: true,
          tasks: {
            select: {
              id: true,
              content: true,
              columnId: true,
            }
          },
        }
      });
    }

    if (!calendar || calendar.length === 0) {
      return NextResponse.json({ meal: null, message: 'Calendar could not be found' }, { status: 404 });
    }

    return NextResponse.json({ calendar }, { status: 200 });
  } catch (error) {
    console.error(error); // Debug: Log the error if any
    return NextResponse.json({ calendar: null, message: 'Something went wrong', error: "error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  const { params } = context;

  try {
    const username = params.username;

    // Delete all columns associated with the username
    const deleteManyResponse = await db.column.deleteMany({
      where: {
        user: {
          username: username,
        },
      },
    });

    if (deleteManyResponse.count === 0) {
      return NextResponse.json({ message: 'No columns found or deleted for the user' }, { status: 404 });
    }

    return NextResponse.json({ message: 'All columns for the user successfully deleted', deletedCount: deleteManyResponse.count }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to delete the columns', error: "error" }, { status: 500 });
  }
}
