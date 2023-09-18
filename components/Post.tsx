import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import prisma from "../lib/prisma";
import {GetServerSideProps} from "next";
import {PostFooter} from "./PostFooter";
import {PostProps} from "../types/PostProps";


export const getServerSideProps: GetServerSideProps = async ({ params }) => {

	const replyPosts = await prisma.post.findMany({
		where: {
			replyPostId: String(params?.id)
		},
		include: {
			author: true,
			likedBy: true,
			replyPosts: true
		}
	})

	return {
		props: {replyPosts},
	};
};

const Post: React.FC<{ post: PostProps }> = ({post}) => {
	const authorName = post.author ? post.author.name : "Unknown author";

	return (
		<div className={"pb-2" + (post?.replyPost ? " pl-5" : "")}>
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

			<PostFooter post={post}/>
		</div>
	);
};

export default Post;
