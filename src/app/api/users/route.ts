import { NextRequest, NextResponse } from "next/server";
import { withOptionalAuth } from "@/middleware/auth";
import { User } from "@prisma/client";

const getHandler = async (request: NextRequest, currentUser: User | null) => {
  try {
    return NextResponse.json(currentUser);
  } catch (error) {
    console.error("get user error:", error);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
};

export const GET = withOptionalAuth(getHandler);
