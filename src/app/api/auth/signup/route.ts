import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, country, firebaseUid } = body;

    const user = await prisma.user.create({
      data: {
        firebaseUid,
        email,
        name,
        country,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
