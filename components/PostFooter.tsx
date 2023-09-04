import React from "react";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faHeart as faHeartRegular} from "@fortawesome/free-regular-svg-icons";
import {faHeart as faHeartFull} from "@fortawesome/free-solid-svg-icons";
import {PostProps, ReplyPostProps} from "../types/PostProps";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";



export const PostFooter: React.FC<{ post: PostProps | ReplyPostProps}> = ({post}) => {
    const router = useRouter()

    const { data: session } = useSession();

    let likeIcon = post?.likedBy?.some(user => user.email === session?.user?.email) ? faHeartFull : faHeartRegular

    const refreshData = () => {
        router.replace(router.asPath)
    }

    async function likePost(): Promise<void> {
        await fetch(`/api/like/${post.id}`, {
            method: 'PUT',
        }).then(refreshData);
    }

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
                onClick={likePost}
                className={'text-gray-500'}
            >
                {post?.likedBy?.length || "0"}

                <FontAwesomeIcon className={'pl-1'} icon={likeIcon} size={"sm"} fixedWidth/>

            </button>
        </div>

    )

}