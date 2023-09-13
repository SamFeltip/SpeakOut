import {PostProps} from "./PostProps";

export type UserProps = {
	id: string;
	name: string;
	email: string;
	image: string;
	posts: PostProps[];
	likedPosts: PostProps[];
};