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

export async function PUT(req: Request, context: any) {
  const { params } = context;
  const username = params.username; // Extract username from the URL parameter

  try {
      const data = await req.json(); // Assuming the body contains the new state of the calendar

      if (!username) {
          return NextResponse.json({ message: 'Username is required' }, { status: 400 });
      }

      // Start a transaction to update the entire calendar for the user
      const updatedCalendar = await db.$transaction(async (prisma) => {
          // Optionally, you might want to first delete all existing columns to replace them completely
          await prisma.column.deleteMany({
              where: { username: username }
          });

          // Process each column and their tasks
          const columnPromises = data.columns.map(column => {
              return prisma.column.create({
                  data: {
                      title: column.title,
                      username: username, // Make sure columns are linked to the correct user
                      tasks: {
                          createMany: {
                              data: column.tasks.map(task => ({
                                  content: task.content
                              }))
                          }
                      }
                  }
              });
          });

          return await Promise.all(columnPromises); // Execute all operations simultaneously within the transaction
      });

      return NextResponse.json({ calendar: updatedCalendar, message: 'Calendar updated successfully' }, { status: 200 });
  } catch (error) {
      console.error('Error updating calendar:', error);
      return NextResponse.json({ message: 'Failed to update calendar', error: 'err' }, { status: 500 });
  }
}

