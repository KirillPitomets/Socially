"use client"

import { useState } from "react"
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { toggleFollow } from "@/action/user.action";

function FollowButton({ userId }: { userId: string }) {
	const [isLoading, setIsLoading] = useState(false);
	const [isFollowed, setIsFollowed] = useState(false)

	const handleFollow = async () => {
		setIsLoading(true)
		try {
			const followData = await toggleFollow(userId)
			if (followData?.follow) {
				setIsFollowed(true)
				toast.success("User Followed successfully!")
			} else {
				setIsFollowed(false)
				toast.success("User Unfollowed successfully!")
			}
		} catch (err) {
			console.error('Error following user', err)
			toast.error("Err")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			size="sm"
			variant="secondary"
			onClick={handleFollow}
			disabled={isLoading}
			className="w-20"
		>
			{isLoading ?
				<Loader2Icon className="size-4 animate-spin" />
				:
				<>
					{isFollowed ? "Unfollow" : " Follow"}
				</>
			}

		</Button>
	)
}

export default FollowButton
