import React from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import Layout from '../../components/Layout';

import Post from "../../components/Post"
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import {PostFooter} from "../../components/PostFooter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisV, faTrash, faBullhorn} from "@fortawesome/free-solid-svg-icons";
import DropDown from "../../components/DropDown";
import {PostProps} from "../../types/PostProps";

async function deletePost(id: string): Promise<void> {

	if(confirm('are you sure you want to delete this post?')){

		await fetch(`/api/post/${id}`, {
			method: 'DELETE',
		});
		await Router.push('/');
	}
}

async function publishPost(id: string): Promise<void> {
	await fetch(`/api/publish/${id}`, {
		method: 'PUT',
	});
	await Router.push('/');
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const post = await prisma.post.findUnique({
		where: {
			id: String(params?.id),
		},
		include: {
			author: {
				select: { name: true, email: true },
			},
			replyPosts: {
				include: {
					author: {
						select: {name: true, email: true, image: true},
					},
				},
			},
			likedBy: {
				select: {email: true}
			}
		},
	});

	return {
		props: {post},
	};
};

const ShowPost: React.FC<{ post: PostProps } > = ({post}) => {
	const { data: session, status } = useSession();
	if (status === 'loading') {
		return <div>Authenticating ...</div>;
	}

	const userHasValidSession = Boolean(session);
	const postBelongsToUser = session?.user?.email === post.author?.email;
	let title = post.title;

	if (!post.published) {
		title = `${title} (Draft)`;
	}

	const postMenuButton = (
		<div className="p-3">
			<FontAwesomeIcon icon={faEllipsisV}/>
		</div>
	)

	const postDropDownMenu = (
		<>
			{userHasValidSession && (
				<div className={'mx-3'}>
					<button className={' text-gray-400 my-3 flex gap-3 items-center'}>
						<FontAwesomeIcon icon={faBullhorn}/>
						Report
					</button>
					{postBelongsToUser && (

						<button
							className={'text-red-600 my-2 w-full'}
							onClick={() => deletePost(post.id)}
						>
							<div className="flex gap-3 items-center">
								<FontAwesomeIcon icon={faTrash}/>
								<div>Delete</div>
							</div>
						</button>

					)}
				</div>

			)}

		</>
	)

	return (
		<Layout>
			<div className={'mb-3'}>
				<div className="flex flex-row justify-between">

					<h2 className={'text-3xl font-extrabold'}>{title}</h2>

					<DropDown dropDownMenu={postDropDownMenu} dropDownButton={postMenuButton}/>


				</div>

				<p>By {post?.author?.name || 'Unknown author'}</p>

				<ReactMarkdown children={post.content} className={'my-2 '}/>

				{!post.published && userHasValidSession && postBelongsToUser && (
					<div className="w-full text-right">
						<button
							className={' border-2 my-2 py-1.5 px-3 rounded-xl border-black'}
							onClick={() => publishPost(post.id)}
						>
							Publish
						</button>
					</div>
				)}

				<PostFooter post={post}/>
			</div>

			<div>
				{post?.replyPosts.map((replyPost) => (
					<div key={replyPost.id}>
						<hr/>
						<Post post={replyPost}/>
					</div>
				))}
			</div>

		</Layout>
	);
};

export default ShowPost;