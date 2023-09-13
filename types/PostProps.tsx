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
	replyPostId: string;
	replyPosts: {
		_count: number;
	}
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
	replyPostId: string;
	replyPosts: PostProps[] | null ;
	likedBy: {
		email: string;
	}[];
};