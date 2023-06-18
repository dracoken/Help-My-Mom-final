import { useState, useEffect } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function User({ user }) {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        getIssues().then((issues) => {
            setIssues(issues);
        });
    }, []);

    return <>
        <div className="grid gap-4 grid-cols-1 mt-4 mx-4">
            {issues && issues.map((issue) => (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg" key={issue.id}>
                    <div className="px-4 py-5 sm:px-6">
                        <div className="flex justify-between items-center mb-2 border-b-2 pb-2" id={`${issue.id}-header`}>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {issue.title}
                            </h3>
                            <div className="flex items-center justify-center uppercase font-bold bg-green-300 hover:bg-purple-400 text-gray-600 py-1 px-1 rounded w-24">
                                {issue.status}
                            </div>
                        </div>
                        <div  className="border-b-2 pb-2" id={`${issue.id}-info`}>
                            <h2 className="font-semibold text-md">
                                Created At: <span className="font-normal">{new Date(issue.createdAt).toLocaleString()}</span>
                            </h2>
                            <h2 className="font-semibold text-md mb-2">
                                Helper&apos;s Email: <span className="font-normal">{issue.helper?.email ?? "No assigned helper."}</span>
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
    </>;
}

const getIssues = async () => {
    const res = await fetch(`${getBaseUrl()}/api/issues/user`, {
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