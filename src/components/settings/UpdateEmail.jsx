import { useState } from "react";
import { toast } from "react-toastify";
import LoadingButton from "../LoadingButton";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function UpdateEmail({ user: initialUser }) {
    const [user, setUser] = useState(initialUser);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.target);
        const new_email = formData.get('new-email');

        const res = await fetch(`${getBaseUrl()}/api/user/update/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                new_email
            })
        });
        const data = await res.json();

        if (!res.ok) {
            toast.error(data.error);
        } else {
            setUser(data.user);
            toast.success(data.message);
            e.target.reset();
        }
        setIsLoading(false);
    };

    return (<>
        <div className="mt-6 ml-6">
            <h4 className="text-xl font-extrabold text-gray-900">Change Email</h4>
            <div className="mt-6">
                <form action="#" method="POST" onSubmit={(e) => handleUpdateEmail(e)}>
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="current-email" className="block text-sm font-medium text-gray-700">
                                    Current Email
                                </label>
                                <div className="mt-1">
                                    <input type="email" id="current-email" className="form-input" value={user.email} disabled />
                                </div>
                                <label htmlFor="new-email" className="block text-sm font-medium text-gray-700">
                                    New Email
                                </label>
                                <div className="mt-1">
                                    <input type="email" name="new-email" id="new-email" autoComplete="email" className="form-input" />
                                </div>

                                <div className="mt-6">
                                    <LoadingButton isLoading={isLoading} type="submit">
                                        Update Email
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