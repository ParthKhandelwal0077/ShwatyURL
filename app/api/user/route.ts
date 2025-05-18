import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from 'next/cache';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, email, image } = await req.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // First, check if the user exists using ID instead of email
    const existingUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!existingUser) {
      console.error('User not found:', session.user.id);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the new email is already taken by another user
    if (email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 400 }
        );
      }
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        name,
        email,
        image,
      },
    });

    // Revalidate relevant paths
    revalidatePath('/settings');
    revalidatePath('/profile');

    return NextResponse.json({
      ...updatedUser,
      message: 'Profile updated successfully. Please sign in again to update your session.'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 