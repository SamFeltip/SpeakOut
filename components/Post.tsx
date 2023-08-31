import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faComment} from '@fortawesome/free-regular-svg-icons'
import Link from "next/link";

export type PostProps = {
    id: string;
    title: string;
    author: {
        name: string;
        email: string;
        image: string;
    } | null;
    content: string;
    published: boolean;
    replyPostId: string;
};

const Post: React.FC<{ post: PostProps}> = ({post}) => {
    const authorName = post.author ? post.author.name : "Unknown author";

    let isReply = post.replyPostId !== ""

    console.log("reply post ", post.replyPostId)

    let menuBar = !isReply && (
        <Link
            href={{pathname: '/create', query: {replyPostId: post.id}}}
            className={'text-gray-500 pb-5'}
        >
            Reply
            <FontAwesomeIcon className={'pl-1'} icon={faComment} size={"sm"} fixedWidth/>
        </Link>
    )
    return (
        <div className={`${isReply ? 'p-[0.5rem] border-gray-300 border-[0.15rem] rounded' : ''}`}>
            <div
                className={`flex flex-row items-center gap-2 rounded bg-white py-3 hover:cursor-pointer `}
                onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}
            >
                <img
                    src={post.author?.image ?? ""}
                    alt={post.author?.name ?? ""}
                    className={"rounded-full h-[48px] w-[48px]"}
                    referrerPolicy={"no-referrer"}
                />

                <div>
                    <h2 className={'font-bold'}>{post.title}</h2>
                    <small>By {authorName}</small>
                    <ReactMarkdown children={post.content} />
                </div>

            </div>

            {menuBar}
        </div>
    );
};

export default Post;
