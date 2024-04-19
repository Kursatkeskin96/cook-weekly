import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Task {
    content: string;
    columnId: number;
    column: Column[]
  }
  
  interface Column {
    title: string;
    username: string;
    tasks: Task[];
    // Other column properties
  }
  

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { columns, username } = body;

        // Iterate over each column to create them along with their tasks
        const createdColumns = await Promise.all(columns.map(async (column: Column) => {
            // Create the column first
            const createdColumn = await db.column.create({
                data: {
                    title: column.title,
                    user: {
                        connect: { username: username }, // Assuming the column model has a relation with the user model
                    },
                },
                
            });
            // Check if there are tasks for the column and create them
            if (column.tasks && column.tasks.length > 0) {
                const createdTasks = await Promise.all(column.tasks.map(async (task: Task) => {
                    return await db.task.create({
                        data: {
                            content: task.content,
                            columnId: createdColumn.id, // Link the task to the newly created column
                        },
                    });
                }));

                // Combine the column with its tasks
                return {
                    ...createdColumn,
                    tasks: createdTasks,
                };
            }

            // If there are no tasks, just return the column
            return createdColumn;
        }));

        return NextResponse.json({ createdColumns, message: "Columns and tasks created successfully" }, { status: 200 });
    } catch (error) {
        console.error("Failed to create columns and tasks:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Fetch all columns along with their tasks and the user who created each column
        const columns = await db.column.findMany({
            select: {
                title: true, // Include all tasks associated with each column
                username: true,  // Include user information for each column
            },
        });

        // Return the fetched data with a 200 status code
        return NextResponse.json({ columns }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch columns:", error);
        // Return an error message with a 500 status code if something goes wrong
        return NextResponse.json({ message: "Something went wrong", error: "err"}, { status: 500 });
    }
}