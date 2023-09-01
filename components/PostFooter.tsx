import React from "react";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faHeart as faHeartRegular} from "@fortawesome/free-regular-svg-icons";
import {PostProps, ReplyPostProps} from "./Post";

export const PostFooter: React.FC<{ post: PostProps | ReplyPostProps}> = ({post}) => {

    return (
        <div className={'flex gap-3'}>
            <Link
                href={{pathname: '/create', query: {replyPostId: post.id}}}
                className={'text-gray-500'}
            >
                Reply
                <FontAwesomeIcon className={'pl-1'} icon={faComment} size={"sm"} fixedWidth/>
            </Link>

            <Link
                href={{pathname: '/create', query: {replyPostId: post.id}}}
                className={'text-gray-500'}
            >
                Like
                <FontAwesomeIcon className={'pl-1'} icon={faHeartRegular} size={"sm"} fixedWidth/>

            </Link>
        </div>

    )

}