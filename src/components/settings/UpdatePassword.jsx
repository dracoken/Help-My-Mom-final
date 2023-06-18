import { useState } from "react";
import { toast } from "react-toastify";
import LoadingButton from "../LoadingButton";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function UpdatePassword() {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.target);
        const old_password = formData.get('current-password');
        const new_password = formData.get('new-password');
        const confirm_password = formData.get('confirm-password');

        const res = await fetch(`${getBaseUrl()}/api/user/update/password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                old_password,
                new_password,
                confirm_password
            })
        });
        const data = await res.json();

        if (!res.ok) {
            toast.error(data.error);
        } else {
            toast.success(data.message);
            e.target.reset();
        }
        setIsLoading(false);
    }

    return (<>
        <div className="mt-6 ml-6">
            <h4 className="text-xl font-extrabold text-gray-900">Change Password</h4>
            <div className="mt-6">
                <form action="#" method="POST" onSubmit={(e) => handleUpdatePassword(e)}>
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                                    Current Password
                                </label>
                                <div className="mt-1">
                                    <input type="password" name="current-password" id="current-password" autoComplete="current-password" className="form-input" />
                                </div>

                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <div className="mt-1">
                                    <input type="password" name="new-password" id="new-password" autoComplete="new-password" className="form-input" />
                                </div>

                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="mt-1">
                                    <input type="password" name="confirm-password" id="confirm-password" autoComplete="confirm-password" className="form-input" />
                                </div>

                                <div className="mt-6">
                                    <LoadingButton isLoading={isLoading} type="submit">
                                        Update Password
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