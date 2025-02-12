import { getProfilebyUsername, getUserLikedPosts, getUserPosts, isFollowing } from "@/action/profile.action"
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

export async function generateMetaData({ params }: { params: { username: string } }) {
	const user = await getProfilebyUsername(params.username)
	if (!user) return;

	return {
		title: `${user.name ?? user.username}`,
		description: user.bio || `Check out ${user.username}'s profile`
	}

}

async function ProfilePageServer({ params }: { params: { username: string } }) {
	const user = await getProfilebyUsername(params.username)
	if (!user) notFound();

	const [post, likedPost, isCurrentFollowing] = await Promise.all([
		getUserPosts(user.id),
		getUserLikedPosts(user.id),
		isFollowing(user.id)
	])

	return <ProfilePageClient
		user={user}
		posts={post}
		likedPosts={likedPost}
		isFollowing={isCurrentFollowing}
	/>
}

export default ProfilePageServer
