import React from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Layout from '../components/Layout';
import Post from '../components/Post';
import prisma from '../lib/prisma';
import Link from "next/link";
import {PostProps} from "../types/PostProps";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });

    if (!session) {
        res.statusCode = 403;
        return { props: { drafts: [] } };
    }

    const drafts = await prisma.post.findMany({
        where: {
            author: { email: session.user.email },
            published: false,
        },
        include: {
            author: {
                select: { name: true, image: true },
            },
        },
    });
    return {
        props: { drafts },
    };
};

type Props = {
    drafts: PostProps[];
};

const Drafts: React.FC<Props> = (props) => {
    const { data: session, status } = useSession();

    if (!session) {
        return (
            <Layout>
                <h1>My Drafts</h1>

                <div>
                    authenticating session...
                </div>
            </Layout>
        );
    }

    if (status === 'loading'){
        return (
            <Layout>
                <div>
                    loading pages...
                </div>

            </Layout>
        )
    }
    if (session){

        return (
            <Layout>
                <div className="page">

                    <div className="flex justify-between">

                        <h1>My Drafts</h1>

                        <Link href="/create" className={'border-2 py-1.5 px-3 rounded-xl border-black cursor-pointer'}>
                            New post
                        </Link>
                    </div>
                    <main>
                        {props.drafts.map((post) => (
                            <div key={post.id} className="bg-white mt-[2rem] hover:cursor-pointer">
                                <Post post={post} />
                            </div>
                        ))}
                    </main>
                </div>
                <style jsx>{`
                
            `}</style>
            </Layout>
        );
    }

};

export default Drafts;