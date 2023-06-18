import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { getBaseUrl } from '@/lib/getBaseUrl';

export default function AttachSolution({ issue }) {
    const router = useRouter();
    const [solution, setSolution] = useState("");

    const cancel = (e) => {
        e.preventDefault();
        toast.error("Attaching Solution Cancelled");
        router.push("/helper");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (solution === "") {
            toast.error("Solution cannot be empty");
            return;
        }

        const res = await fetch(`${getBaseUrl()}/api/issues/solution/attachSolution`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                issueId: issue.id,
                solution: solution,
            })
        });

        if (res.ok) {
            toast.success("Solution Successfully Attached");
            router.push("/helper");
        } else {
            toast.error("Failed to attach solution");
        }
    };

    return <>
        <Head>
            <title>Attach Solution</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="mx-4 pb-4">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Helper Dashboard - Attach A Solution</h2>
            <div className="bg-gray-100 py-4 flex flex-row items-center justify-between">
                <h1 className="text-3xl">Solution Description</h1>
            </div>
            <div>
                <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
                    <textarea
                        id='textArea'
                        rows={20}
                        className="block p-2.5 w-full text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setSolution(e.target.value)}
                        placeholder="Write your solution here..."
                    ></textarea>
                    <button type="button" className="bg-gray-300 py-3 px-3 mx-3 rounded-lg hover:bg-red-400" onClick={cancel}>Cancel</button>
                    <button type="submit" className="bg-gray-300 py-3 px-3 rounded-lg hover:bg-green-400">Submit</button>
                </form>
            </div>
        </div>
    </>;
}

//gets the issueId that is sent from the helper page
export async function getServerSideProps(context) {
    const { issueId } = context.params;

    const res = await fetch(`${getBaseUrl()}/api/issues/find/${issueId}`);
    const data = await res.json();

    return {
        props: {
            issue: data.issue,
        }
    }
}