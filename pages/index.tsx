import React from "react"
import {GetServerSideProps} from "next"
import Layout from "../components/Layout"
import Post from "../components/Post"
import prisma from '../lib/prisma';
import {PostProps} from "../types/PostProps";
import Router from "next/router";

export const getStaticProps: GetServerSideProps = async () => {
	const feed = await prisma.post.findMany({
		where: { published: true, replyPost: null},
		include: {
			author: true,
			likedBy: true,
			replyPosts: {
				include: {
					author: true,
					likedBy: true
				}
			}
		}
	});
	return {
		props: { feed },
		revalidate: 10,
	};
};

const Feed: React.FC<{ feed: PostProps[] }> = ({feed}) => {
	return (
		<Layout>
			<div className="page">
				<main>
					{feed.map((post) => (
                        <div key={post.id}>
                            <Post post={post}/>
							{post?.replyPosts.slice(0,1).map((replyPost) => (
								<div key={replyPost.id}>
									<Post post={replyPost}/>
								</div>
							))}
							{post?.replyPosts.length > 0 && (
								<div
									onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}
									className={"cursor-pointer text-blue-600 p-2 pl-5"}
								>
									Show {post?.replyPosts.length} Replies
								</div>
							)}
                            <hr/>

                        </div>

					))}
				</main>
			</div>
		</Layout>
	)
}

export default Feed
