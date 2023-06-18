import Helper from "@/components/profile/Helper";
import User from "@/components/profile/User";
import { sessionOptions } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Profile({ user }) {

    return (
        <>
            <Head>
                <title>Profile</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="mx-4 pb-10">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900 border-b-2 p-2 border-black">Profile&nbsp;-&nbsp;{user.email}</h2>
                <div className="mt-6 ml-4">
                    <h3 className="text-2xl font-extrabold text-gray-900">Manage Balance</h3>
                    <h3 className="text-xl font-bold text-gray-900 inline-block">Current Balance: ${user.money.toFixed(2)}</h3>
                    <Link className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg inline-block m-4" href='/payment'>Add Balance</Link>
                    <Link className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg inline-block m-4" href='/paymentHistory'>View Payment History</Link>
                    <h3 className="text-2xl font-extrabold text-gray-900 border-t-2 border-black">Past Issues</h3>
                    <p className="text-md font-semibold text-gray-700">These are issues that have been approved as complete.</p>
                    {user.is_helper ? <Helper user={user} /> : <User user={user} />}
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
    let user = req.session.user;
    const prisma = new PrismaClient();

    if (user == undefined) {
        return {
            props: {
                user: { isLoggedIn: false },
            },
        };
    }

    user = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    let _ = await prisma.$disconnect();

    return {
        props: {
            user: JSON.parse(JSON.stringify(user)),
        }
    }
}, sessionOptions)