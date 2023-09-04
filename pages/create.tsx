import React, { useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import {useSession} from "next-auth/react";
import Post from "../components/Post";

import {TailSpin} from "react-loader-spinner";
import prisma from "../lib/prisma";
import {PostProps} from "../types/PostProps";

export async function getServerSideProps(context) {
    console.log('this is server side props')
    console.log(context.query.replyPostId); // return { movieId: 'Mortal Kombat' }

    if(context.query.replyPostId) {

        const replyPost = await prisma.post.findUnique({
            where: {
                id: String(context.query?.replyPostId),
            },
            include: {
                author: {
                    select: {name: true, email: true, image: true},
                },
            },
        });

        return {props: {replyPost}};
    }else{
        return { props: {} }
    }
}

const Draft: React.FC<{ replyPost: PostProps}> = ({replyPost}) => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { status } = useSession();

    const submitData = async (e: React.SyntheticEvent, published: boolean = false, replyPostId: string = "") => {
        e.preventDefault();

        if(published || confirm('Save as draft?')){

            try {
                setLoading(true);
                const body = { title, content, published, replyPostId };
                await fetch('/api/post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                await Router.push('/');

            } catch (error) {
                console.log('create.tsx post didn\'t work! ');
                console.error(error);
            } finally {
                setLoading(false)
            }
        }else{
            await Router.push('/');
        }
    };

    let displayReplyPost = replyPost ? <Post post={replyPost}></Post> : ''

    return (
        <Layout>
            <div>
                {displayReplyPost}

                <form onSubmit={(e) => submitData(e, true, replyPost.id || "")}>
                    <h1 className={'pt-[0.5rem]'}>{replyPost ? 'Reply' : 'New Post'}</h1>

                    <input
                        autoFocus
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        type="text"
                        value={title}
                        className={'w-full p-[0.5rem] my-[0.5rem] border-[0.15rem] border-gray-300 rounded'}
                    />

                    <textarea
                        cols={50}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Content"
                        rows={8}
                        value={content}
                        className={'w-full p-[0.5rem] my-[0.5rem] border-[0.15rem] border-gray-300 rounded'}
                    />

                    <input
                        disabled={!content || !title}
                        type="submit"
                        value="Create"
                        className={'border-2 py-1.5 px-3 rounded-xl border-black cursor-pointer'}
                    />

                    <a className="ml-3" href="#" onClick={(e) => submitData(e, false, replyPost.id)}>
                        Cancel
                    </a>

                    {(loading || (status === 'loading')) ? <TailSpin
                        height="20"
                        width="20"
                        color="blue"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperClass={"absolute left-50 bottom-50"}
                        visible={true}
                    /> : ''}

                </form>
            </div>
        </Layout>
    );
};

export default Draft;