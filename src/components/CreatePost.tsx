"use client"

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { createPost } from "@/action/post.action";
import { toast } from "react-hot-toast";

function CreatePost() {
	const { user } = useUser()
	const [content, setContent] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [isPosting, setIsPosting] = useState(false);
	const [showImageUpload, setShowImageUpload] = useState(false);

	const handleSubmit = async () => {
		if (!content.trim() && !imageUrl.trim()) return;
		setIsPosting(true)

		try {
			const res = await createPost(content, imageUrl)
			if (res.success) {
				setContent("")
				setImageUrl("")
				setIsPosting(false)
				setShowImageUpload(false)
				toast.success("Post created successfully")
			}
		} catch (err) {
			console.log("Failed to create post: ", err);
			toast.error("Failed to create post")

		}
	}

	return (
		<Card className="mb-6">
			<CardContent className="pt-6">
				<div className="space-y-4">
					<Avatar>
						<AvatarImage src={user?.imageUrl || "/avatar.png"} />
					</Avatar>
					<Textarea
						placeholder="What's on your mind?"
						className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
						value={content}
						onChange={e => setContent(e.target.value)}
						disabled={isPosting}
					/>
				</div>

				{(showImageUpload || imageUrl) && (
					<div className="border rounded-lg p-4">
						<ImageUpload
							endpoint="imageUploader"
							value={imageUrl}
							onChange={(url) => {
								setImageUrl(url);
								if (!url) setShowImageUpload(false);
							}}
						/>
					</div>
				)}

				<div className="flex items-center justify-between border-t pt-4">

					<div className="flex space-x-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="text-muted-foreground hover:text-primary"
							onClick={() => setShowImageUpload(!showImageUpload)}
							disabled={isPosting}
						>
							<ImageIcon className="size-4 mr-2" />
							Photo
						</Button>
					</div>

					<Button
						className="flex items-center"
						onClick={handleSubmit}
						disabled={(!content.trim() && !imageUrl) || isPosting}
					>
						{
							isPosting ? (
								<>
									<Loader2Icon className="size-4 mr-2 animate-spin" />
									Loading...
								</>
							) : (
								<>
									<SendIcon className="size-4 mr-2" />
									Send
								</>
							)
						}

					</Button>
				</div>

			</CardContent>
		</Card>
	)
}

export default CreatePost;