import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
      const body = await req.json();
      const { monday, tuesday, wednesday, thursday, friday, saturday, sunday, userName } = body;

      const newCalendar = await db.calendar.create({
          data: {
              monday: monday,
              tuesday: tuesday,
              wednesday: wednesday,
              thursday: thursday,
              friday: friday,
              saturday: saturday,
              sunday: sunday,
              createdBy: {
                  connect: { username: userName },
              },
          },
      });
      return NextResponse.json({ newCalendar, message: "Calendar created successfully" }, { status: 200 });
  } catch (error) {
      console.error("Failed to create meal:", error);
      return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

    export async function GET() {
        try {
          const calendar = await db.calendar.findMany({
            select: {
              id: true,
              monday: true,
              username: true
            }
          });
          return NextResponse.json({ calendar }); 
        } catch (error) {
          return NextResponse.json({ message: "something went wrong", error: "err" });
        }
    }