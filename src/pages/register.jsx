import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { getBaseUrl } from '@/lib/getBaseUrl';

export default function Register() {
    const router = useRouter();

    const [errorMsg, setErrorMsg] = useState("");
    const [helperBox, setHelperBox] = useState("false");

    const [phoneNumber, setPhoneNumber] = useState("000-000-0000");
    const [canText, setText] = useState(false);
    const [canCall, setCall] = useState(false);

    const [canZoomCall, setZoomCall] = useState(false);
    const [zoomLink, setZoomLink] = useState("000-000-0000");

    const registerAccount = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const helper_box = formData.get('is_helper');

        const is_helper = helper_box === "on" ? true : false;

        const res = await fetch(`${getBaseUrl()}/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
                helper: is_helper,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.error);
            setErrorMsg(data.error);
        } else {
            console.log(data);
            if (helperBox == true) {
                const zoomRequest = await fetch(`${getBaseUrl()}/api/user/update/contact/zoom`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: data.data.id,
                        zoomCode: zoomLink,
                        canZoomCall: canZoomCall,
                    }),
                });

                const phoneRequest = await fetch(`${getBaseUrl()}/api/user/update/contact/phone`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: data.data.id,
                        phoneNumber: phoneNumber,
                        canCall: canCall,
                        canText: canText,
                    }),
                });

                const zoomData = await zoomRequest.json();
                const phoneData = await phoneRequest.json();

                if (!zoomRequest.ok) {
                    toast.error(zoomData.error);
                    return;
                }

                if (!phoneRequest.ok) {
                    toast.error(phoneData.error);
                    return;
                }
            }

            toast.success("Account registered successfully");
            router.push("/");
        }
    }

    return (
        <>
            <Head>
                <title>Settings</title>
            </Head>
            <div className=" pt-2">
                <h1 className="text-2xl text-center uppercase underline">Register a New Account</h1>
                <div>
                    <form className="flex flex-col mx-auto w-1/2 pt-4" onSubmit={(e) => registerAccount(e)}>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                        <input type="email" id="email" name="email" placeholder="bilitski@pitt.edu" className="form-input" required />

                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                        <input type="password" id="password" name="password" className="form-input" required />

                        <div className="flex items-start mb-6 mt-4">
                            <div className="flex items-center h-5">
                                <input type="checkbox" id="helper" name="is_helper" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" onChange={(e) => setHelperBox(e.target.checked)}></input>
                            </div>
                            <label htmlFor="helper" className="ml-2 text-sm font-medium text-gray-900">Are you signing up as a helper?</label>
                        </div>

                        {(helperBox == true) && (
                            <>
                                <label htmlFor="phoneNum" className="block mb-2 text-sm font-medium text-gray-900">Phone Number</label>
                                <input type="input" id="phoneNumber" name="phoneNum" placeholder="000-000-0000" className="form-input" onChange={(e) => setPhoneNumber(e.target.value)} required />

                                <label htmlFor="zoomCode" className="block mb-2 text-sm font-medium text-gray-900">Zoom Room Code</label>
                                <input type="input" id="zoomLink" name="zoomCode" placeholder="1234567890" className="form-input" onChange={(e) => setZoomLink(e.target.value)} required />

                                <div className="flex items-start mb-6 mt-4">
                                    <div className="flex items-center h-5">
                                        <input type="checkbox" id="helper" name="can_text" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" onChange={(e) => setText(e.target.checked)}></input>
                                    </div>
                                    <label htmlFor="helper" className="ml-2 text-sm font-medium text-gray-900">Can a mother text you?</label>
                                </div>
                                <div className="flex items-start mb-6 mt-4">
                                    <div className="flex items-center h-5">
                                        <input type="checkbox" id="helper" name="can_call" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" onChange={(e) => setCall(e.target.checked)}></input>
                                    </div>
                                    <label htmlFor="helper" className="ml-2 text-sm font-medium text-gray-900">Can a mother call you?</label>
                                </div>
                                <div className="flex items-start mb-6 mt-4">
                                    <div className="flex items-center h-5">
                                        <input type="checkbox" id="helper" name="can_zoom_call" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" onChange={(e) => setZoomCall(e.target.checked)}></input>
                                    </div>
                                    <label htmlFor="helper" className="ml-2 text-sm font-medium text-gray-900">Can a mother zoom call you?</label>
                                </div>
                            </>
                        )}
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Register new account</button>
                    </form>
                    {errorMsg && <p className="text-red-500 text-center underline">{errorMsg}</p>}
                </div>
            </div>
        </>
    );
}