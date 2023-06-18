import { issueStatus } from "@/lib/issues";
import { sessionOptions } from "@/lib/session";
import { withIronSessionSsr } from "iron-session/next";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function HelperDashboard({ initalIssues }) {
    const router = useRouter();
    const [issues, setIssues] = useState(initalIssues);

    async function changeState(issue) {
        if (issue.status === issueStatus.SOLVING) {
            // navigate to the attach solution page
            router.push(`/issues/attach/${issue.id}`);
        } else if (issue.status === issueStatus.SOLVED) {
            toast.error("Waiting for issue approval.");
        } else {
            const res = await postIssueStatus(issue.id, issue.status);

            // update the issues status on the display
            const newIssues = issues.map((i) => {
                if (i.id === issue.id) {
                    i.status = res.status;
                }
                return i;
            });

            // update the issues state so ui updates
            setIssues(newIssues);
        }
    }

    return <>
        <Head>
            <title>Helper Dashboard</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Helper Dashboard</h2>
            <div className="bg-gray-100 p-4 flex flex-row items-center justify-between">
                <h1 className="text-3xl">Issues</h1>
            </div>
            <div className="grid gap-4 grid-cols-1 mt-4 mx-4">
                {issues && issues.map((issue) => (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg" key={issue.id}>
                        <div className="px-4 py-5 sm:px-6">
                            <div className="flex justify-between items-center mb-2 border-b-2 pb-2" id={`${issue.id}-header`}>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    {issue.title}
                                </h3>
                                <button className="flex items-center justify-center uppercase font-bold bg-green-300 hover:bg-green-400 text-gray-600 p-1 rounded" onClick={() => changeState(issue)}>
                                    {issue.status}
                                </button>
                            </div>
                            <div className="border-b-2 pb-2" id={`${issue.id}-info`}>
                                <h2 className="font-semibold text-md">
                                    Reported At: <span className="font-normal" suppressHydrationWarning>{new Date(issue.createdAt).toLocaleString()}</span>
                                    {/* Created At: <span className="font-normal">{issue.createdAt}</span> */}
                                </h2>
                                <h2 className="font-semibold text-md mb-2">
                                    Complainant&apos;s Email: <span className="font-normal">{issue.complainer?.email ?? "No complainant assigned."}</span>
                                </h2>
                            </div>
                            <div className="mt-2" id={`${issue.id}-details`}>
                                <div className="flex flex-col">
                                    <h3 className="font-semibold">
                                        Issue Description:
                                    </h3>
                                    <p className="ml-1">
                                        {issue.description ?? "No description yet..."}
                                    </p>
                                </div>
                                <div className="flex flex-col mt-2">
                                    <h3 className="font-semibold">
                                        Issue Solution:
                                    </h3>
                                    <p className="ml-1">
                                        {issue.solution ?? "No solution yet..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    </>;
}

export const fetchIssues = async (user) => {
    const response = await fetch(`${getBaseUrl()}/api/issues/helper/` + user.id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status === 200) {
        const data = await response.json();
        return data.issues;
    } else {
        toast.error("Failed to fetch issues");
    }
    return null;
}

// this is the function that is called when the status button is clicked
export const postIssueStatus = async (issueId, status) => {
    const response = await fetch(`${getBaseUrl()}/api/issues/changeIssueStatus`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: issueId,
            status: status,
        })
    });
    const data = await response.json();

    if (response.ok) {
        return data.data;
    } else {
        toast.error(data.message);
        return null;
    }
}

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
    const user = req.session.user;

    if (user == undefined) {
        return {
            props: {
                user: { isLoggedIn: false },
            },
        };
    }

    let issues = await fetchIssues(user);

    return {
        props: {
            initalIssues: issues,
        }
    }
}, sessionOptions)
