import { User } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getFirebaseAuth } from "next-firebase-auth-edge";

import prisma from "@/lib/prisma";

const { verifyIdToken } = getFirebaseAuth({
  serviceAccount: {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n")!,
  },
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
});

export const withOptionalAuth =
  (
    handler: (
      request: NextRequest,
      currentUser: User | null
    ) => Promise<NextResponse>
  ) =>
  async (request: NextRequest) => {
    const authHeader = request.headers.get("authorization");

    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    if (!token) {
      return handler(request, null);
    }

    try {
      const decodedToken = await verifyIdToken(token);

      const user = await prisma.user.findUnique({
        where: { firebaseUid: decodedToken.uid },
      });

      return handler(request, user);
    } catch (error) {
      console.error("Error verifying token:", error);
      return handler(request, null);
    }
  };
