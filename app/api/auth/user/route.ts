import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get complete user data including custom domains
    const user = await prisma.$queryRaw`
      SELECT 
        id,
        name,
        email,
        image,
        "emailVerified"
      FROM "User"
      WHERE email = ${session.user.email}
    `;

    if (!user || !Array.isArray(user) || user.length === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user[0]);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 