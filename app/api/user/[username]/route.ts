import { NextResponse } from 'next/server';
import {db} from '@/lib/db'; 

export async function GET(req: Request, context: any ) {
  const { params } = context

  try {
  const username = await db.user.findUnique({
    where: {
      username: params.username
    },
    select: {
      id: true,
      username: true,
      email: true,
    }
  })
  if(!username) {
    return NextResponse.json({username: null, message: 'Username couldnt found'}, {status: 404})
  }
  return NextResponse.json({username}, {status: 200})
} catch (error) {
  return NextResponse.json({username: null, message: 'something went wrong'}, {status: 500})
}
}