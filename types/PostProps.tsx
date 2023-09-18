export type PostProps = {
	id: string;
	title: string;
	author: {
		name: string;
		email: string;
		image: string;
		id: string;
	} | null;
	content: string;
	published: boolean;
	replyPost: PostProps | null ;
	replyPosts: PostProps[] | null ;
	likedBy: {
		email: string;
	}[];
};