import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

export async function GET() {
  const users = await db.select().from(user);
  return NextResponse.json("ok");
}
