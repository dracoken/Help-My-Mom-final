import Head from 'next/head'
import { toast } from 'react-toastify'
import { sessionOptions } from "@/lib/session";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from 'next/router';
import { getBaseUrl } from '@/lib/getBaseUrl';

export const createIssue = async (data) => {
    let wasSuccessful = false;
    const res = await fetch(`${getBaseUrl()}/api/issues/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (res.status === 200) {
        wasSuccessful = true;
    }
    const resjson=await res.json();
    const issueID=resjson.issue.id;
    return {wasSuccessful:wasSuccessful, issueID:issueID};
};

export default function Home({ user }) {
    const router = useRouter();

    const getBalance = async () => {
        const data = {
            userId: user.id
        }
        const res = await fetch(`${getBaseUrl()}/api/user/getBalance`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const resjson = await res.json();
        return resjson.balance;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            title: e.target.title.value,
            description: e.target.description.value,
            userId: user.id,
        };
        if (await getBalance()<20){
            toast.error('Add at least $20 to Create Issue');
            return;  
        }
        const response = (await createIssue(data));

        if (response.wasSuccessful) {
            toast.success('Issue created successfully');
            //take money from user
            updateBalance({
                toAdd: -20,
                userId: user.id,
            });
            //create pay history for user
            createHistory(user.id, -20, "Paid to create issue", response.issueID);
            router.push('/dashboard');
        } else {
            toast.error('Issue creation failed');
        }
    };

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
    return (
        <>
            <Head>
                <title>Report a Tech Issue</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="bg-white py-8 px-4 mx-4 shadow rounded-lg sm:px-10">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Report an Issue</h2>
                <form className="mt-8 space-y-6" onSubmit={(e) => handleSubmit(e)}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="title" className="sr-only">
                                Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                autoComplete="off"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Title"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="sr-only">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows="5"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Description"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Report Issue
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
    const user = req.session.user;

    if (user == undefined) {
        res.setHeader("location", "/");
        res.statusCode = 302;
        res.end();
        return {
            props: {
                user: { isLoggedIn: false },
            },
        };
    }

    return {
        props: {
            user: user,
        }
    }
}, sessionOptions)
