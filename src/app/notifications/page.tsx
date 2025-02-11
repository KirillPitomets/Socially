"use client"

import { getNotifications, markNotificationAsRead } from "@/action/notification.action";
import NotificationSceleton from "@/components/NotificationSceleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { formatDistanceToNow } from "date-fns";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";

type Notifications = Awaited<ReturnType<typeof getNotifications>>
type Notification = Notifications[number]
type NotificationTypeEnum = Notification["type"]


function getNotificationIcon(type: NotificationTypeEnum): JSX.Element {
  switch (type) {
    case "LIKE":
      return <HeartIcon className="size-4 text-red-500" />
    case "FOLLOW":
      return <MessageCircleIcon className="size-4 text-blue-500" />
    case "COMMENT":
      return <UserPlusIcon className="size-4 text-green-500" />
  }
}

function getNotificationText(type: NotificationTypeEnum): string {
  switch (type) {
    case "LIKE":
      return "Liked your post"
    case "COMMENT":
      return "Commented on your post"
    case "FOLLOW":
      return "Followed you"

  }
}

function NotificationPage() {

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotificaions = async () => {
      setIsLoading(true)
      try {
        const data = await getNotifications();
        setNotifications(data);

        const unreadIds = data.filter(item => !item.read).map(item => item.id);
        if (unreadIds.length > 0) await markNotificationAsRead(unreadIds)
      } catch (error) {
        toast.error("Failed to fetch notifications")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotificaions();
  }, [])

  if (isLoading) return <NotificationSceleton />

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Notification</CardTitle>
            <span className="text-sm text-muted-foreground">
              {notifications.filter(item => !item.read).length} unread
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea>
            {
              notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
              ) : (
                notifications.map(item => (
                  <div
                    key={item.id}
                    className={`flex item-start gap-4 p-4 border-p gover:bg-muted/25 transition-colors ${!item.read ? 'bg-muted/50' : ""}`}
                  >
                    <Avatar className="mt-1">
                      <AvatarImage src={item.creator.image ?? "/avatar.png"} />
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(item.type)}
                        <span>
                          <span className="font-medium">
                            {item.creator.name ?? item.creator.username}
                          </span> {" "}
                          {getNotificationText(item.type)}
                        </span>
                      </div>

                      {item.post &&
                        (item.type === "LIKE" || item.type === "COMMENT") && (
                          <div className="pl-6 space-y-2">
                            <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                              <p>{item.post.content}</p>
                              {item.post.image && (
                                <img
                                  src={item.post.image}
                                  alt="Post content"
                                  className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                                />
                              )}
                            </div>

                            {item.type === "COMMENT" && item.comment && (
                              <div className="text-sm p-2 bg-accent/50 rounded-md">
                                {item.comment.content}
                              </div>
                            )}
                          </div>
                        )}
                      <p className="text-sm text-muted-foreground pl-6">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )
            }
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotificationPage
