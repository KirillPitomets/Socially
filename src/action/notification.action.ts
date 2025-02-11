"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";

export async function getNotifications() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];

    const notifications = await prisma.notification.findMany({
      where: { userId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            image: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  } catch (err) {
    console.error("Error fetch notifications: ", err);
    throw new Error("Failed to fetch notifications");
  }
}

export async function markNotificationAsRead(notificationId: string[]) {
  try {
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationId,
        },
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Error marking notification as read: ", err);
    return { success: false };
  }
}
