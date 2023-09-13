import {GetServerSideProps} from "next";
import prisma from "../../lib/prisma";
import React from "react";
import {useSession} from "next-auth/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBullhorn, faEllipsisV, faTrash} from "@fortawesome/free-solid-svg-icons";
import Layout from "../../components/Layout";
import DropDown from "../../components/DropDown";
import ReactMarkdown from "react-markdown";
import {PostFooter} from "../../components/PostFooter";
import Post from "../../components/Post";
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