import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {hash} from 'bcrypt'

import { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: Request) {
   try {
    const body = await req.json();
    const {username, password, email} = body;

    // check username if already exist

    const existingUserByUserName = await db.user.findUnique({
        where: {username: username}
    });
    const existingUserByEmail = await db.user.findUnique({
        where: {email: email}
    });
    
    if(existingUserByUserName){
        return NextResponse.json({user: null, message: "this username already exist."}, {status: 409})
    }
    if(existingUserByEmail){
        return NextResponse.json({user: null, messagE: 'this email already exist'}, {status: 409})
    }
    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    })
    const {password: newUserPassword, ...rest} = newUser
    return NextResponse.json({user: rest, message: "User created successfully"}, {status: 200});
   } catch (error) {
    return NextResponse.json({message: "Something went wrong"}, {status: 500});
   }
}

export async function GET() {
    try {
      // Fetch all users from the database
      const users = await db.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          // Include other fields you want to return, but exclude sensitive data like passwords
        }
      });
      // Respond with the list of users using users variable
      return NextResponse.json({ users }); // Using the users variable here
    } catch (error) {
      // Handle any errors that occur during the process
      return NextResponse.json({ message: "something went wrong", error: "err" });
    }
}