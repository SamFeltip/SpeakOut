import {GetServerSideProps} from "next";
import prisma from "../../lib/prisma";
import React from "react";
import {useSession} from "next-auth/react";
import Layout from "../../components/Layout";
import {UserProps} from "../../types/UserProps";

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
					likedBy: true
				}
			}
		}
	});

	return {
		props: {user},
	};
};



const ShowPost: React.FC<{ user: UserProps } > = ({user}) => {
	const { data: session, status } = useSession();
	if (status === 'loading') {
		return <div>Authenticating ...</div>;
	}

	return (
		<Layout>
			<div>
				{user?.name}
			</div>
		</Layout>
	);
};

export default ShowPost;