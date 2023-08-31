import React from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import Layout from '../../components/Layout';

import Post from "../../components/Post"
import { PostProps } from '../../components/Post';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

async function deletePost(id: string): Promise<void> {

  if(confirm('are you sure you want to delete this post?')){

    await fetch(`/api/post/${id}`, {
      method: 'DELETE',
    });
    Router.push('/');
  }

}

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: 'PUT',
  });
  await Router.push('/');
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      }
    },
  });

  const replyPosts = await prisma.post.findMany({
    where: {
      replyPostId: String(post.id)
    },
    include: {
      author: {
        select: { name: true, email: true, image: true },
      }
    }
  })

  return {
    props: {post, replyPosts},

  };
};

type Props = {
  post: PostProps,
  replyPosts: PostProps[]
}

const ShowPost: React.FC<Props> = ({post, replyPosts}) => {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === post.author?.email;
  let title = post.title;

  if (!post.published) {
    title = `${title} (Draft)`;
  }

  return (
      <Layout>
        <div>
          <h2 className={'text-3xl font-extrabold'}>{title}</h2>

          <p>By {post?.author?.name || 'Unknown author'}</p>

          <ReactMarkdown children={post.content} className={'my-2 '}/>

          {!post.published && userHasValidSession && postBelongsToUser && (
              <div className="w-full text-right">
                  <button className={' border-2 my-2 py-1.5 px-3 rounded-xl border-black'} onClick={() => publishPost(post.id)}>Publish</button>
              </div>
          )}

          {userHasValidSession && postBelongsToUser && (
              <div className="w-full text-right">
                <button className={'text-red-600 border-2 my-2 py-1.5 px-3 rounded-xl border-red-600'} onClick={() => deletePost(post.id)}>Delete</button>
              </div>
          )}
        </div>

        <div>
          <div>
            {replyPosts.length} replies
          </div>
          {replyPosts.map((post) => (
              <div key={post.id}>
                <Post post={post}/>
                <hr/>
              </div>
          ))}
        </div>

      </Layout>
  );
};

export default ShowPost;