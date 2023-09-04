import React from "react"
import {GetServerSideProps, GetStaticProps} from "next"
import Layout from "../components/Layout"
import Post from "../components/Post"
import prisma from '../lib/prisma';
import {PostProps} from "../types/PostProps";

export const getStaticProps: GetServerSideProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true},
    include: {
      author: {
        select: { name: true, image: true },
      },
      likedBy: {
        select: { email: true }
      }
    },
  });
  return {
    props: { feed },
    revalidate: 10,
  };
};

const Feed: React.FC<{ feed: PostProps[] }> = ({feed}) => {
  return (
    <Layout>
      <div className="page">
        <main>
          {feed.map((post) => (
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

export default Feed
