"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;

    // check if user exists
    const existsUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existsUser) return existsUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        image: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Error in SyncUser", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
    return await prisma.user.findUnique({
      where: { clerkId },
      include: {
        _count: { select: { followers: true, following: true, posts: true} },
      },
    });
}
