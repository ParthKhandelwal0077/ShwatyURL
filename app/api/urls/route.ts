import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generateUniqueSlug, isValidUrl } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// Extend the session type to include the user ID
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | undefined;
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the URL ID from the search params if it exists
    const { searchParams } = new URL(req.url);
    const urlId = searchParams.get('id');

    if (urlId) {
      // Fetch specific URL
      const url = await prisma.$queryRaw`
        SELECT * FROM "Url"
        WHERE id = ${urlId} AND "userId" = ${user?.id}
      `;

      if (!url || !Array.isArray(url) || url.length === 0) {
        return NextResponse.json(
          { message: "URL not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(url[0]);
    }

    // Fetch all URLs for the user
    const urls = await prisma.$queryRaw`
      SELECT * FROM "Url"
      WHERE "userId" = ${user?.id}
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | undefined;
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { originalUrl, customExpiry } = await req.json();

    if (!originalUrl) {
      return NextResponse.json(
        { message: "Original URL is required" },
        { status: 400 }
      );
    }

    if (!isValidUrl(originalUrl)) {
      return NextResponse.json(
        { message: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Instead, set prefix based on environment
    const prefix = process.env.NODE_ENV === 'production' ? 'shwatyurl.vercel.app' : 'localhost:3000';

    // Generate a unique slug and check for collisions
    let shortSlug = generateUniqueSlug(originalUrl);
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 5;

    while (!isUnique && attempts < maxAttempts) {
      // Check if slug already exists
      const existingUrl = await prisma.$queryRaw`
        SELECT id FROM "Url"
        WHERE "shortSlug" = ${shortSlug}
      `;

      if (!existingUrl || !Array.isArray(existingUrl) || existingUrl.length === 0) {
        isUnique = true;
      } else {
        shortSlug = generateUniqueSlug(originalUrl);
        attempts++;
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { message: "Failed to generate unique URL. Please try again." },
        { status: 500 }
      );
    }

    // Calculate expiry date (5 years from now by default)
    const expiresAt = customExpiry 
      ? new Date(customExpiry)
      : new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000);

    // Create the URL
    const result = await prisma.$executeRaw`
      INSERT INTO "Url" (
        "id",
        "userId",
        "originalUrl",
        "shortSlug",
        "clickCount",
        "expiresAt",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${crypto.randomUUID()},
        ${user?.id},
        ${originalUrl},
        ${shortSlug},
        0,
        ${expiresAt},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    // Revalidate the dashboard page
    revalidatePath('/dashboard');

    return NextResponse.json({
      id: crypto.randomUUID(),
      userId: user?.id,
      originalUrl,
      shortSlug,
      clickCount: 0,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
      shortUrl: `${prefix}/${shortSlug}`
    });
  } catch (error) {
    console.error("Error creating URL:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | undefined;
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const urlId = searchParams.get('id');

    if (!urlId) {
      return NextResponse.json(
        { message: "URL ID is required" },
        { status: 400 }
      );
    }

    // Delete the URL
    await prisma.$executeRaw`
      DELETE FROM "Url"
      WHERE id = ${urlId} AND "userId" = ${user?.id}
    `;

    // Revalidate the dashboard page
    revalidatePath('/dashboard');

    return NextResponse.json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | undefined;
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(req.url);
    const urlId = searchParams.get('id');
    if (!urlId) {
      return NextResponse.json(
        { message: "URL ID is required" },
        { status: 400 }
      );
    }
    const { expiresAt } = await req.json();
    if (!expiresAt) {
      return NextResponse.json(
        { message: "Expiry date is required" },
        { status: 400 }
      );
    }
    await prisma.$executeRaw`
      UPDATE "Url"
      SET "expiresAt" = ${new Date(expiresAt)}
      WHERE id = ${urlId} AND "userId" = ${user?.id}
    `;
    revalidatePath('/dashboard');
    return NextResponse.json({ message: "Expiry updated successfully" });
  } catch (error) {
    console.error("Error updating expiry:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 