import prisma from '../../../lib/prisma';
import {getServerSession} from "next-auth/next";
import authOptions from "../auth/[...nextauth]";

// PUT /api/publish/:id
export default async function handle(req, res) {

	const session = await getServerSession(req, res, authOptions)
	const postId = req.query.id;

	if (Boolean(session)){
		console.log('session found, retrieving email and liking post')
		const userEmail = session?.user?.email;

		if (!userEmail) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		try {
			console.log('checking if post is already liked...')
			const is_liked = await prisma.post.count({
				where: {
					id: postId,
					likedBy: {
						some: {
							email: session?.user?.email
						}
					}
				}
			}) > 0
			console.log('result: ', is_liked)
			console.log('updating post accordingly')
			const post = await prisma.post.update({
				where: { id: postId },
				data: {
					likedBy:
						is_liked
							? { disconnect: { email: session?.user?.email } }
							: { connect: 	{ email: session?.user?.email } },
				},
				include: {
					likedBy: true,
				},
			});

			console.log('post changed. responding with new post: ', JSON.stringify(post))
			res.status(200).json(post);

		} catch (error) {
			res.status(500).json({message: 'An error occurred while liking the post'});
		}
	}else{
		res.status(401).send('Unauthorized');
	}

}