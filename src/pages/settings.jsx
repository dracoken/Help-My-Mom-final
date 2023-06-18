import UpdateContact from "@/components/settings/UpdateContact";
import UpdateEmail from "@/components/settings/UpdateEmail";
import UpdateNotify from "@/components/settings/UpdateNotify";
import UpdatePassword from "@/components/settings/UpdatePassword";
import LinkMother from "@/components/settings/mother/LinkMother";
import MotherExists from "@/components/settings/mother/MotherExists";
import { sessionOptions } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";
import { useState } from "react";

export default function Settings({ user: initialUser }) {
    const [user, setUser] = useState(initialUser);

    const handleUpdateUser = (updatedUser) => {
        setUser(updatedUser)
    }

    return (
        <>
            <Head>
                <title>Settings</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="mx-4 pb-10">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900 border-b-2 p-2 border-black">Settings&nbsp;-&nbsp;{user.email}</h2>
                <div className="mt-6 ml-4">
                    <h3 className="text-2xl font-extrabold text-gray-900">Account</h3>
                    <UpdatePassword />
                    <UpdateEmail user={user} />
                    <UpdateNotify user={user} />
                </div>

                {/* This form is only shown to children accounts */}
                {(!user.is_mother && !user.is_helper) && (
                    <div className="mt-6 ml-4">
                        <h3 className="text-2xl font-extrabold text-gray-900">Mother&apos;s Account</h3>

                        <div className="mt-6 ml-6">
                            {/* Two Flows ? One Where No Mother Account : One With Linked Mother Account */}
                            {!user.mother ? (<LinkMother user={user} onUpdateUser={handleUpdateUser} />) : (<MotherExists user={user} />)}
                        </div>
                    </div>
                )}

                {/* This form is only shown to helper accounts */}
                {user.is_helper && <UpdateContact user={user} />}
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
        },
        include: {
            mother: true,
            contact: true
        }
    });

    let _ = await prisma.$disconnect();

    return {
        props: {
            user: JSON.parse(JSON.stringify(user)),
        }
    }
}, sessionOptions)