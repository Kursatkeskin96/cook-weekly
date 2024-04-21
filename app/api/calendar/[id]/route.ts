import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Assuming you're using a database setup where you can directly use 'db.column.delete'
export async function DELETE(req: Request, context: any) {
  const { params } = context;

  try {
    const id = params.id; // Assuming the column ID is passed as a URL parameter

    // Delete the specific column by its ID
    const deleteResponse = await db.column.delete({
        where: { id: parseInt(id, 10) },
    });

    // Check if the deletion was actually performed (Prisma example, adjust according to your DB API)
    if (!deleteResponse) {
      return NextResponse.json({ message: 'Column not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Column successfully deleted', deletedId: id }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete the column:', error);
    return NextResponse.json({ message: 'Failed to delete the column', error: "err" }, { status: 500 });
  }
}

