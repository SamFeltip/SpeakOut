import {GetServerSideProps} from "next";
import prisma from "../../lib/prisma";
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import Layout from "../../components/Layout";
import {UserProps} from "../../types/UserProps";
import Post from "../../components/Post";
import {PostProps} from "../../types/PostProps";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const user = await prisma.user.findUnique({
		where: {
			id: String(params?.id),
		},
		include: {
			likedPosts: {
				include: {
					author: true,
					likedBy: true
				}
			},
			posts: {
				include: {
					author: true,
					likedBy: true,
					replyPost: {
						include: {
							author: true,
							likedBy: true
						}
					}
				}
			}
		}
	});

	return {
		props: {user},
	};
};

const turnStringIntoRandomColourValue = (input) => {

	console.log(input)

	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = input.charCodeAt(i) + ((hash << 5) - hash);
	}
	let color = '#';
	for (let i = 0; i < 3; i++) {
		let value = (hash >> (i * 8)) & 0xFF;
		color += ('00' + value.toString(16)).substr(-2);
	}
	console.log(color)

	return color;
}


function MyPosts(props: { posts: PostProps[] }) {
	let {posts} = props;
	return (
		<div className={'pt-3'}>
			{
				posts.length > 0
				? posts.map((post) => (<Post key={"post" + post.id} post={post}/>))
				: "no posts yet"
			}
		</div>
	)
}


function MyReplies(props: { posts: PostProps[] }) {
	let {posts} = props;
	return (
		<div className={'pt-3'}>
			{
				posts.length > 0
				? posts.map((post) => (
					<div key={"postAndReply" + post.id}>
						<Post key={"post" + post.id} post={post.replyPost}/>
						<Post key={"postReply" + post.id} post={post}/>
					</div>))
				: "no replies yet"
			}

		</div>
	)
}


function MyLikes(props: { posts: PostProps[] }) {
	let {posts} = props;
	return (
		<div className={'pt-3'}>
			{
				posts.length > 0
				? posts.map((post) => (<Post key={"post" + post.id} post={post}/>))
				: "no likes yet"
			}
		</div>
	)
}

const ShowUser: React.FC<{ user: UserProps } > = ({user}) => {
	const { status } = useSession();

	if (status === 'loading') {
		return <div>Authenticating ...</div>;
	}

	let posts = user.posts.filter((post) => post.replyPost === null)
	let replies = user.posts.filter((post) => post.replyPost !== null)
	let likes = user.likedPosts

	let postElement = <MyPosts posts={posts}/>
	let repliesElement = <MyReplies posts={replies}/>
	let likesElement = <MyLikes posts={likes}/>

	const [displayPosts, setDisplayPosts] = useState(postElement)

	const colourBasedOnId = turnStringIntoRandomColourValue(user.id)

	return (
		<Layout>
			{/*banner image*/}
			<div className={'left-0 top-0 w-full h-[100px]'} style={{backgroundColor: colourBasedOnId}}></div>

			{/*header*/}
			<div className={'flex flex-col gap-4 translate-y-[-50px]'}>
				<div className={'flex justify-between items-end'}>
					<img
						src={user?.image ?? ""}
						alt={user?.name ?? ""}
						className={"rounded-full h-[100px] w-[100px] border-2 border-gray-500"}
						referrerPolicy={"no-referrer"}
					/>
					<div className="border-2 rounded-md py-2 px-3 border-black h-full">
						Edit profile
					</div>
				</div>
				<div>
					<h1 className={'text-xl font-bold '}>
						{user?.name || 'no user found'}
					</h1>
					<h1 className={'text-gray-500'}>
						{user?.email}
					</h1>
				</div>
			</div>

			{/*tab options*/}

			<div className={'flex justify-between px-5 py-2 border-b-2 text-gray-700 font-medium'}>
				<button onClick={() => setDisplayPosts(postElement)}>Posts</button>
				<button onClick={() => setDisplayPosts(repliesElement)}>Replies</button>
				<button onClick={() => setDisplayPosts(likesElement)}>Likes</button>
			</div>

			{displayPosts}

		</Layout>
	);
};

export default ShowUser;