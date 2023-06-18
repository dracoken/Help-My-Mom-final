import Head from 'next/head'
import { toast } from 'react-toastify'
import { sessionOptions } from "@/lib/session";
import { withIronSessionSsr } from "iron-session/next";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getBaseUrl } from '@/lib/getBaseUrl';
import { issueStatus as statusLib } from '@/lib/issues';

export default function Dashboard({ user }) {
    const router = useRouter();
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        getIssues().then(async (issues) => {
            setIssues(issues);
        });
    }, []);

    const viewIssue = (id) => {
        router.push(`/issues/${id}`);
    };

    const handlePayment = (userID, helperID, issueID) => {
        //give money to helper
        updateBalance({
            toAdd: 20,
            userId: helperID,
        });
        //create pay history for helper
        createHistory(helperID, 20, "Added balance for completed solution", issueID);
    }

    const updateBalance = async (data) => {
        let wasSuccessful = false;
        const res = await fetch(`${getBaseUrl()}/api/user/update/updateBalance`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (res.status === 200) {
            wasSuccessful = true;
        }
        return wasSuccessful;
    };

    const createHistory = async (userID, amount, desc, issueID) => {
        const res = await fetch(`${getBaseUrl()}/api/user/update/newPayment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                amount: amount,
                userID: userID,
                desc: desc,
                issueID: issueID,
            })
        })
        return res;
    }

    const issueStatusClick = async (issueId, issueStatus, thisIssue) => { //we'll check if the issue's status is awaiting to be approved by the child. if it is, then we update the issue status inside the database
        if (issueStatus === statusLib.SOLVED) {
            const req = await fetch(`${getBaseUrl()}/api/issues/changeIssueStatus`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: parseInt(issueId),
                    status: issueStatus,
                }),
            });

            const res = await req.json();

            if (!req.ok) {
                toast.error("Issue status update failed");
                return;
            }

            if (res.data) {
                toast.success("Issue status updated");
                const newIssues = issues.map((issue) => {
                    if (issue.id === issueId) {
                        issue.status = res.data.status;
                    }
                    return issue;
                });
                setIssues(newIssues);
                handlePayment(thisIssue.complainerId, thisIssue.helperId, thisIssue.id);
            }
        }
    }

    const issueWaitForApproval = (issueStatus) => {
        if (issueStatus === statusLib.SOLVED) {
            return "click to approve issue";
        }
        return issueStatus;
    }

    return (
        <>
            <Head>
                <title>Dashboard </title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="mx-4 pb-10">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900 border-b-2 p-2 border-black">Dashboard</h2>
                <div className="mt-6 ml-2">
                    <h3 className="text-2xl font-extrabold text-gray-900">Active Issues</h3>
                    <p className="text-md font-semibold text-gray-700">These are issues created by you and your {user.is_mother ? "child" : "mother"} combined.</p>

                    <div className="grid gap-4 grid-cols-1 mt-4 mx-4">
                        {issues && issues.map((issue) => (
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg" key={issue.id}>
                                <div className="px-4 py-5 sm:px-6">
                                    <div className="flex justify-between items-center mb-2 border-b-2 pb-2" id={`${issue.id}-header`}>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            {issue.title}
                                        </h3>
                                        <div className="flex flex-row items-center justify-between gap-2">
                                            <button className="flex items-center justify-center uppercase font-bold bg-green-300 text-gray-600 p-1.5 rounded" onClick={(e) => issueStatusClick(issue.id, issue.status, issue)}>
                                                {issueWaitForApproval(issue.status)}
                                            </button>
                                            <button className="flex items-center justify-center uppercase font-bold bg-blue-500 hover:bg-blue-400 text-slate-100 p-1.5 rounded" onClick={() => viewIssue(issue.id)}>
                                                View Issue
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border-b-2 pb-2" id={`${issue.id}-info`}>
                                        <h2 className="font-semibold text-md">
                                            Created At: <span className="font-normal">{new Date(issue.createdAt).toLocaleString()}</span>
                                        </h2>
                                        <h2 className={`font-semibold text-md mb-2 ${issue.helper?.email ? 'text-black' : 'text-red-600'}`}>
                                            Helper&apos;s Email: <span className="font-normal">{issue.helper?.email ?? "Please assign a helper!"}</span>
                                        </h2>
                                    </div>
                                    {issue.helper?.contact && (
                                        <div className='border-b-2 pb-2 mt-2' id={`${issue.id}-contact-info`}>
                                            {(issue.helper?.contact.canCall || issue.helper?.contact.canText) && (
                                                <>
                                                    <h2 className={`font-semibold text-md mb-2 ${issue.helper?.email ? 'text-black' : 'text-red-600'}`}>
                                                        Helper&apos;s Phone Number: <span className="font-normal">{issue.helper?.contact.phoneNum ?? "Please assign a helper!"}</span>
                                                    </h2>
                                                    <h2 className={`font-semibold text-md mb-2 ${issue.helper?.email ? 'text-black' : 'text-red-600'}`}>
                                                        Can you call them?: <span className="font-normal">{issue.helper?.contact.canCall ? "Yes" : "No"}</span>
                                                    </h2>
                                                    <h2 className={`font-semibold text-md mb-2 ${issue.helper?.email ? 'text-black' : 'text-red-600'}`}>
                                                        Can you text them?: <span className="font-normal">{issue.helper?.contact.canText ? "Yes" : "No"}</span>
                                                    </h2>

                                                </>
                                            )}
                                            {(issue.helper?.contact.canZoomCall) && (
                                                <>
                                                    <h2 className={`font-semibold text-md mb-2 ${issue.helper?.email ? 'text-black' : 'text-red-600'}`}>
                                                        Helper&apos;s Zoom Code: <span className="font-normal">{issue.helper?.contact.zoomLink ?? "Please assign a helper!"}</span>
                                                    </h2>
                                                </>
                                            )}
                                        </div>
                                    )}
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
                                                {issue.solution ?? "Waiting for helper to provide a solution..."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

const getIssues = async () => {
    const res = await fetch(`${getBaseUrl()}/api/issues/dashboard`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const issues = await res.json();

    if (issues.error) {
        console.error(issues.error);
        return;
    }

    return issues;
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

    console.log(user);
    //let helperContacts = fetch(`${getBaseUrl()}/api/user/contact/`+ user.id);

    return {
        props: {
            user: user,
        }
    }
}, sessionOptions)
