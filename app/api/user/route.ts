import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {hash} from 'bcrypt'

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