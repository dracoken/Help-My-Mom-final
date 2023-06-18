import { getBaseUrl } from "@/lib/getBaseUrl";
import { useState } from "react";
import { toast } from "react-toastify";
import LoadingButton from "../LoadingButton";

export default function UpdateContact({ user }) {
    const [phoneNumber, setPhoneNumber] = useState(user.contact?.phoneNum ? user.contact.phoneNum : "");
    const [canCall, setCall] = useState(user.contact?.canCall ? user.contact.canCall : false);
    const [canText, setText] = useState(user.contact?.canText ? user.contact.canText : false);
    const [isLoadingPhone, setIsLoadingPhone] = useState(false);

    const [zoomLink, setZoomLink] = useState(user.contact?.zoomLink ? user.contact.zoomLink : "");
    const [canZoomCall, setZoomCall] = useState(user.contact?.canZoomCall ? user.contact.canZoomCall : false);
    const [isLoadingZoom, setIsLoadingZoom] = useState(false);


    const updatePhoneContact = async (e) => {
        e.preventDefault();
        setIsLoadingPhone(true);

        const request = await fetch(`${getBaseUrl()}/api/user/update/contact/phone`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: user.id,
                phoneNumber: phoneNumber,
                canCall: canCall,
                canText: canText,
            }),
        });

        const data = await request.json();

        if (!request.ok) {
            toast.error(data.error);
            setIsLoadingPhone(false);
            return;
        }

        toast.success("Phone contact updated!");

        setIsLoadingPhone(false);
    };

    const updateZoomContact = async (e) => {
        e.preventDefault();
        setIsLoadingZoom(true);

        const request = await fetch(`${getBaseUrl()}/api/user/update/contact/zoom`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: user.id,
                zoomCode: zoomLink,
                canZoomCall: canZoomCall,
            }),
        });

        const data = await request.json();

        if (!request.ok) {
            toast.error(data.error);
            setIsLoadingZoom(false);
            return;
        }

        toast.success("Zoom contact updated!");

        setIsLoadingZoom(false);
    };

    return (<>
        <div className="mt-6 ml-4">
            <h3 className="text-2xl font-extrabold text-gray-900">Contact Methods</h3>
            <div className="mt-6 ml-6">
                <form action="#" method="POST" onSubmit={(e) => updatePhoneContact(e)} id="phone-contact">
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="px-4 py-5 bg-white space=y=6 sm:p-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <div className="mt-1">
                                    <input type="text" id="phone-number" className="form-input" placeholder={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                </div>

                                <div className="flex items-start mb-6 mt-4">
                                    <div className="flex items-center h-5">
                                        <input type="checkbox" id="can-text" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" onChange={(e) => setText(e.target.checked)} checked={canText}></input>
                                    </div>
                                    <label htmlFor="can-text" className="ml-2 text-sm font-medium text-gray-900">Can a mother text you?</label>
                                </div>

                                <div className="flex items-start mb-6 mt-4">
                                    <div className="flex items-center h-5">
                                        <input type="checkbox" id="can-call" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" onChange={(e) => setCall(e.target.checked)} checked={canCall}></input>
                                    </div>
                                    <label htmlFor="can-call" className="ml-2 text-sm font-medium text-gray-900">Can a mother call you?</label>
                                </div>

                                <div className="mt-6">
                                    <LoadingButton isLoading={isLoadingPhone} type="submit">
                                        Update Phone Number
                                    </LoadingButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <form action="#" method="POST" onSubmit={(e) => updateZoomContact(e)} id="zoom-contact">
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="px-4 py-5 bg-white space=y=6 sm:p-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="zoom-code" className="block text-sm font-medium text-gray-700">
                                    Zoom Room Code
                                </label>
                                <div className="mt-1">
                                    <input type="text" id="zoom-code" className="form-input" placeholder={zoomLink} onChange={(e) => setZoomLink(e.target.value)} />
                                </div>

                                <div className="flex items-start mb-6 mt-4">
                                    <div className="flex items-center h-5">
                                        <input type="checkbox" id="can-zoom" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" onChange={(e) => setZoomCall(e.target.checked)} checked={canZoomCall}></input>
                                    </div>
                                    <label htmlFor="can-zoom" className="ml-2 text-sm font-medium text-gray-900">Can a mother zoom call you?</label>
                                </div>

                                <div className="mt-6">
                                    <LoadingButton isLoading={isLoadingZoom} type="submit">
                                        Update Zoom Code
                                    </LoadingButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </>);
}