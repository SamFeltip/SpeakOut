import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
	const user1 = await prisma.user.create({
		data: {
			name: 'Alice',
			email: 'alice@example.com',
			image: 'https://fastly.picsum.photos/id/420/200/200.jpg?hmac=7hdmWb4uHh3ulb7_b_NXZ6QZY_mpCdVcwji4oMqP1Eg',
			posts: {
				create: [
					{
						title: 'My first post',
						content:
							'Hello world! This is my first post on this platform. Excited to be here! 🎉',
						published: true,
					},
					{
						title: 'My second post',
						content:
							'What a beautiful day it is today! ☀️ How is everyone doing?',
						published: true,
					},
				],
			},
			accounts: {
				create: [
					{
						type: 'google',
						provider: 'google',
						providerAccountId: '1234567890',
					},
				],
			},
		},
		include: {
			posts: true
		}
	})

	const user2 = await prisma.user.create({
		data: {
			name: 'Bob',
			email: 'bob@example.com',
			image: 'https://fastly.picsum.photos/id/469/200/200.jpg?hmac=r_nEPJ5ExnhVEQSrNc19WUPConxJzBC929FJHl_Y5N4',
			posts: {
				create: [
					{
						title: 'My first post',
						content:
							"Hey everyone, I'm Bob! Just joined this platform and looking forward to connecting with you all. 😊",
						published: true,
					},
					{
						title: 'Reply to Alice',
						content:
							"Hi Alice, I'm doing great, thanks for asking! How about you? 😊",
						published: true,
						replyPostId:user1.posts[1].id
					},
				],
			},
		},
		include: {
			posts: true
		}
	})

	const user3 = await prisma.user.create({
		data: {
			name: 'Charlie',
			email: 'charlie@example.com',
			image: 'https://fastly.picsum.photos/id/718/200/200.jpg?hmac=__zLj3h3wgMNm3OM6xAOydBYFAw3V-LoIymGCluM0mY',
			posts: {
				create: [
					{
						title: 'My first post',
						content:
							"Hello everyone, I'm Charlie! Just wanted to say hi and introduce myself. 👋",
						published: true,
					},
					{
						title: 'Reply to Alice',
						content:
							"Hi Alice, I'm doing well, thanks for asking! It's a beautiful day here too. ☀️",
						published:true,
						replyPostId:user1.posts[1].id
					},
					{
						title:'Reply to Bob',
						content:"Hey Bob, nice to meet you! I'm Charlie. Looking forward to connecting with you too. 😊",
						published:true,
						replyPostId:user2.posts[0].id
					},
				],
			},
		},
		include: {
			posts: true
		}
	})

	await prisma.post.create({
		data:{
			title:'Reply to Charlie',
			content:"Hi Charlie, nice to meet you too! I'm doing well, thanks for asking. 😊",
			published:true,
			authorId:user1.id,
			replyPostId:user3.posts[0].id
		}
	})

	await prisma.post.create({
		data:{
			title:'Reply to Bob and Charlie',
			content:"Hey Bob and Charlie, it's great to hear that you're both doing well! 😊",
			published:true,
			authorId:user1.id,
			replyPostId:user2.posts[1].id
		}
	})
}

main()
.then(async () => {
	await prisma.$disconnect()
})
.catch(async (e) => {
	console.error(e)
	await prisma.$disconnect()
	process.exit(1)
})