import { getBaseUrl } from "@/lib/getBaseUrl";
import { useState } from "react";
import { toast } from "react-toastify";
import LoadingButton from "../LoadingButton";

export default function UpdateNotify({ user }) {
    const [wantsNotify, setNotify] = useState(user.notify);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateNotify = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const request = await fetch(`${getBaseUrl()}/api/user/update/notify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: user.id,
                wantsNotify: wantsNotify,
            }),
        });

        const data = await request.json();

        if (!request.ok) {
            toast.error(data.error);
            setIsLoading(false);
            return;
        }

        toast.success("Notification settings updated!");

        setIsLoading(false);
    }

    return (<>
        <div className="mt-6 ml-6">
            <h4 className="text-xl font-extrabold text-gray-900">Change Notification Settings</h4>
            <div className="mt-6">
                <form action="#" method="POST" onSubmit={(e) => handleUpdateNotify(e)}>
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                            <div className="col-span-6 sm:col-span-3">
                                <div className="flex items-start mb-6 mt-4">
                                    <div className="flex items-center h-5">
                                        <input type="checkbox" id="can-notify" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" onChange={(e) => setNotify(e.target.checked)} checked={wantsNotify}></input>
                                    </div>
                                    <label htmlFor="can-notify" className="ml-2 text-sm font-medium text-gray-900">Do you want to receive email notifications?</label>
                                </div>

                                <div className="mt-6">
                                    <LoadingButton isLoading={isLoading} type="submit">
                                        Update Notification Settings
                                    </LoadingButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </>)
}