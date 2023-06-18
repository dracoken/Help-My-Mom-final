import fetchJson, { FetchError } from '@/lib/fetchJson'
import useUser from '@/lib/useUser'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

export default function Home() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const { mutateUser } = useUser({
        redirectTo: '/auth/routing',
        redirectIfFound: true,
    })

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            mutateUser(
                await fetchJson("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                }),
                false,
            );

            router.push('/auth/routing');
        } catch (error) {
            if (error instanceof FetchError) {
                setErrorMsg(error.data.error);
                toast.error(error.data.error);
            } else {
                console.error("An unexpected error happened:", error);
            }
        }
    }

    return (
        <>
            <Head>
                <title>Help My Mom</title>
                <meta name="description" content="An app to outsource your mother's tech problems" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="text-center container mx-auto">
                <h1 className='text-3xl font-bold mb-2'>Help My Mom</h1>
                <h2 className='text-xl mb-2'>Login to your Account</h2>
                <form className="bg-gray-100 rounded-lg shadow-md p-8 w-3/5 mx-auto" onSubmit={(e) => handleLogin(e)}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Login</h2>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter your email address"
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            placeholder="Enter your password"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            Login
                        </button>
                        <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-6000" href='/register'>Register</Link>
                    </div>
                </form>
            </div>
        </>
    )
}
