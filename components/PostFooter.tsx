import React, {useState} from "react";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faHeart as faHeartRegular} from "@fortawesome/free-regular-svg-icons";
import {faHeart as faHeartFull} from "@fortawesome/free-solid-svg-icons";
import {PostProps} from "../types/PostProps";
import {useSession} from "next-auth/react";



export const PostFooter: React.FC<{ post: PostProps}> = ({post}) => {
	const { data: session } = useSession();
	const [likedBy, setLikedBy] = useState(post.likedBy)

	let currentUserLikesPost = likedBy?.some(user => user.email === session?.user?.email)
	let likeIcon = currentUserLikesPost ? faHeartFull : faHeartRegular

	const handleLike = async () => {
		console.log('this is being liked')
		try {
			const response = await fetch(`/api/like/${post.id}`, {
				method: 'PUT'
			});
			if (response.ok) {
				const newPost = await response.json();
				setLikedBy(newPost.likedBy)
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={'flex gap-3'}>
			<Link
				href={{pathname: '/create', query: {replyPostId: post.id}}}
				className={'text-gray-500'}
			>
				Reply
				<FontAwesomeIcon className={'pl-1'} icon={faComment} size={"sm"} fixedWidth/>
			</Link>

			<button
				onClick={handleLike}
				className={'text-gray-500'}
			>
				{likedBy?.length || "0"}

				<FontAwesomeIcon className={`pl-1 ${currentUserLikesPost ? 'text-red-600' : ''}`} icon={likeIcon} size={"sm"} fixedWidth/>

			</button>
		</div>

	)

}