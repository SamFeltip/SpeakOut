import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true, replyPostId: ""},
    include: {
      author: {
        select: { name: true, image: true },
      },
    },
  });
  return {
    props: { feed },
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[]
}

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <main>
          {props.feed.map((post) => (
            <div key={post.id}>
              <Post post={post}/>
              <hr/>
            </div>
          ))}
        </main>
      </div>
    </Layout>
  )
}

export default Blog
