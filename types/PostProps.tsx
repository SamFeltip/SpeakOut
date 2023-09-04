export type ReplyPostProps = {
	id: string;
	title: string;
	author: {
		name: string;
		email: string;
		image: string;
	} | null;
	content: string;
	published: boolean;
	likedBy: {
		email: string;
	}[];
}

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
	replyPosts: ReplyPostProps[];
	likedBy: {
		email: string;
	}[];
};