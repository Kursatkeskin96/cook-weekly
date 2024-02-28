import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {hash} from 'bcrypt'

export async function POST(req: Request) {
   try {
    const body = await req.json();
    const {username, password} = body;

    // check username if already exist

    const existingUserByUserName = await db.user.findUnique({
        where: {username: username}
    });
    if(existingUserByUserName){
        return NextResponse.json({user: null, message: "this username already exist."}, {status: 409})
    }
    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
        data: {
            username,
            password: hashedPassword
        }
    })
    const {password: newUserPassword, ...rest} = newUser
    return NextResponse.json({user: rest, message: "User created successfully"}, {status: 200});
   } catch (error) {
    return NextResponse.json({message: "Something went wrong"}, {status: 500});
   }
}