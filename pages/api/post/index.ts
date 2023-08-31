// import { getSession } from 'next-auth/react'

import { authOptions } from '../auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

import prisma from '../../../lib/prisma';


// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
    // const session = await getSession({req});
    const session = await getServerSession(req, res, authOptions)

    const { title, content, published, replyPostId } = req.body;

    if (session) {
        const result = await prisma.post.create({
            data: {
                title,
                content,
                published,
                replyPostId,
                author: { connect: { email: session?.user?.email } },


            },
        });
        res.json(result);
    } else {
        res.status(401).send('Unauthorized');
    }
}