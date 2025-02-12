"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

export async function getProfilebyUsername(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        location: true,
        webSite: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    return user;
  } catch (err) {
    console.error("Error fetching user: ", err);
    throw new Error("Error fetching user");
  }
}

export async function getUserPosts(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        likes: {
          select: { userId: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });
    return posts;
  } catch (err) {
    console.error("Error fetching user posts: ", err);
    throw new Error("Error fetching user posts");
  }
}

export async function getUserLikedPosts(userId: string) {
  try {
    const likedPosts = await prisma.post.findMany({
      where: {
        likes: {
          some: {
            userId,
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return likedPosts;
  } catch (err) {
    console.error("Error fetching user liked posts: ", err);
    throw new Error("Error fetching user liked posts");
  }
}

export async function updateUserProfile(formData: FormData) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const webSite = formData.get("webSite") as string;

    console.log("==============================")
    console.log("==============================")
    console.log("==============================")
    console.log("Updating profile: ", { name, bio, location, webSite });
    console.log("==============================")
    console.log("==============================")
    console.log("==============================")

    const user = await prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        name,
        bio,
        location,
        webSite,
      },
    });

    revalidatePath("/profile/");
    return { success: true, user };
  } catch (err) {
    console.error("Failed to update profile: ", err);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function isFollowing(userId: string) {
  try {
    const currentUserId = await getDbUserId();
    if (!currentUserId) return false;

    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    return !!follow;
  } catch (err) {
    console.error("Error checking if following: ", err);
    throw new Error("Error checking if following");
  }
}
