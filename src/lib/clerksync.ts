// lib/clerkSync.ts
import { auth } from '@clerk/nextjs/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from './prisma';

export async function getOrCreateUserFromClerk() {
  // Ensure there is an authenticated session
  const { userId } = await auth();
  if (!userId) return null;

  // currentUser() returns server-side Clerk user info
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Extract the fields you want to store
  const email = clerkUser.emailAddresses?.[0]?.emailAddress ?? null;
  const firstName = clerkUser.firstName ?? null;
  const lastName = clerkUser.lastName ?? null;

  // Upsert into Prisma DB keyed by clerkId
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email,
      firstName,
      lastName,
    },
    create: {
      clerkId: userId,
      email,
      firstName,
      lastName,
    },
  });

  return user;
}