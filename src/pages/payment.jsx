import { sessionOptions } from "@/lib/session";
import { withIronSessionSsr } from "iron-session/next";
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getBaseUrl } from "@/lib/getBaseUrl";

export const updateBalance = async (data) => {
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
export const createHistory = async (userID, amount) => {
    const res = await fetch(`${getBaseUrl()}/api/user/update/newPayment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: amount,
            userID: userID,
            desc: "Added Balance"
        })
    })
    return res;
}

export default function Payment({ user }) {
    const [userBalance, setUserBalance] = useState(false);

    useEffect(() => {
        getBalance().then(balance => setUserBalance(balance));
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            toAdd: e.target.amount.value,
            userId: user.id,
        };
        const wasSuccessful = await updateBalance(data);
        const h1 = await createHistory(data.userId, data.toAdd);
        if (wasSuccessful) {
            toast.success('Balance added successfully');
            getBalance().then(balance => setUserBalance(balance));
        } else {
            toast.error('Balance add failed');
        }
    };

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

    return (
        <>
            <Head>
                <title>Help My Mom</title>
                <meta name="description" content="An app to outsource your mother's tech problems" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="bg-gray-100 min-h-screen">
                <div className="max-w-lg mx-auto p-8">
                    <h1 className="text-xl font-bold mb-4">Current Balance: ${parseInt(userBalance).toFixed(2)}</h1>
                    <h1 className="text-2xl font-bold mb-4">Add Balance</h1>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <div className="mb-4">
                                <label htmlFor="cardNumber" className="block text-gray-700 font-bold mb-2">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    className="w-full border border-gray-300 p-2 rounded-lg"
                                    placeholder="Enter your card number"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="expirationDate" className="block text-gray-700 font-bold mb-2">
                                    Expiration Date
                                </label>
                                <input
                                    type="text"
                                    id="expirationDate"
                                    name="expirationDate"
                                    className="w-full border border-gray-300 p-2 rounded-lg"
                                    placeholder="MM / YY"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="cvv" className="block text-gray-700 font-bold mb-2">
                                    CVV
                                </label>
                                <input
                                    type="text"
                                    id="cvv"
                                    name="cvv"
                                    className="w-full border border-gray-300 p-2 rounded-lg"
                                    placeholder="Enter your CVV"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    id="amount"
                                    name="amount"
                                    className="w-full border border-gray-300 p-2 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="Enter the amount to add"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-500 text-white py-2 font-bold hover:bg-blue-600"
                            >
                                Add Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
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