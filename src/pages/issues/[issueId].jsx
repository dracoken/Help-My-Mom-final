import Head from "next/head";
import { useState } from "react";
import { toast } from "react-toastify";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function Issue({ issue: initalIssue, helpers }) {
    const [issue, setIssue] = useState(initalIssue);

    const assignHelper = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const helperId = formData.get("helper");

        const res = await fetch(`${getBaseUrl()}/api/issues/assign`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                helper: helperId,
                issue: issue.id,
            }),
        });
        const updatedIssue = await res.json();

        if (!res.ok) {
            toast.error("Error assigning helper");
            return;
        }

        setIssue(updatedIssue.issue);
        toast.success("Helper assigned successfully");
    };

    return <>
        <Head>
            <title>View An Issue</title>
        </Head>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg" key={issue.id}>
            <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center mb-2 border-b-2 pb-2" id={`${issue.id}-header`}>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {issue.title}
                    </h3>
                    <button className="flex items-center justify-center uppercase font-bold bg-green-300 text-gray-600 p-1.5 rounded" disabled>
                        {issue.status}
                    </button>
                </div>
                <div className="border-b-2 pb-2" id={`${issue.id}-info`}>
                    <h2 className="font-semibold text-md">
                        Created At: <span className="font-normal" suppressHydrationWarning>{new Date(issue.createdAt).toLocaleString()}</span>
                    </h2>
                    {issue.helper ? (
                        <h2 className={`font-semibold text-md mb-2 'text-black`}>
                            Helper&apos;s Email: <span className="font-normal">{issue.helper?.email ?? "Please assign a helper!"}</span>
                        </h2>
                    ) : (<>
                        <h2 className={`font-semibold text-md mb-2 text-red-600`}>
                            Helper&apos;s Email: <span className="font-normal">{issue.helper?.email ?? "Please assign a helper!"}</span>
                        </h2>
                        <form action="" onSubmit={(e) => assignHelper(e)}>
                            <select name="helper" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" defaultValue="default">
                                <option disabled value="default">Please Choose a Helper</option>
                                {helpers?.length > 0 ? helpers.map((helper) => (
                                    <option value={helper.id} key={helper.id}>{helper.email}</option>
                                )) : (
                                    <option disabled>No Helpers Available</option>
                                )}
                            </select>
                            <button type="submit" className="bg-blue-500 p-2 rounded-md text-white hover:bg-gray-400 mt-4">Assign Helper</button>
                        </form>
                    </>)}
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
    </>
}

const getIssue = async (issueId) => {
    const res = await fetch(`${getBaseUrl()}/api/issues/find/${issueId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const issue = await res.json();

    return issue.issue;
};

const getHelpers = async () => {
    const res = await fetch(`${getBaseUrl()}/api/user/helpers`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const helpers = await res.json();

    return helpers.helpers;
}

export async function getServerSideProps(context) {
    const { issueId } = context.params;

    const issue = await getIssue(issueId);
    let helpers = null;

    if (!issue.helper) {
        helpers = await getHelpers();
    }

    return {
        props: {
            issue: issue,
            helpers: helpers,
        }
    }
}
