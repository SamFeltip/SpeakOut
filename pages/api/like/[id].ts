import prisma from '../../../lib/prisma';
import {getServerSession} from "next-auth/next";
import {authOptions} from "../auth/[...nextauth]";

// PUT /api/publish/:id
export default async function handle(req, res) {

	const session = await getServerSession(req, res, authOptions)
	const postId = req.query.id;

	if (Boolean(session)){

		const userEmail = session?.user?.email;

		if (!userEmail) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		try {

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

			const post = await prisma.post.update({
				where: { id: postId },
				data: {
					likedBy:
						is_liked
							? { disconnect: { email: session?.user?.email } }
							: { connect: 	{ email: session?.user?.email } },
				},
			});

			res.status(200).json(post);

		} catch (error) {
			res.status(500).json({message: 'An error occurred while liking the post'});
		}
	}else{
		res.status(401).send('Unauthorized');
	}

}