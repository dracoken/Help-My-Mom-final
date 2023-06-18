import { toast } from 'react-toastify';
import { useState } from 'react';
import LoadingButton from '@/components/LoadingButton';
import { getBaseUrl } from '@/lib/getBaseUrl';

export const handleCreateMother = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const mothers_email = formData.get('mothers-email');
    const mothers_password = formData.get('mothers-password');

    const res = await fetch(`${getBaseUrl()}/api/user/update/mother`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mothers_email,
            mothers_password
        })
    });
    const data = await res.json();

    if (!res.ok) {
        toast.error(data.error);
        return undefined;
    } else {
        toast.success(data.message);
        e.target.reset();
        return data?.user;
    }
}

export default function LinkMother({ user, onUpdateUser }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const account = await handleCreateMother(e);
        if (account) {
            onUpdateUser(account);
        }
        setIsLoading(false);
    }

    return (<>
        <h4 className="text-xl font-extrabold text-gray-900">Create An Account For Your Mother</h4>

        <div className="mt-6">
            <form action="#" method="POST" onSubmit={(e) => handleSubmit(e)}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="mothers-email" className="block text-sm font-medium text-gray-700">
                                Mother&apos;s Email
                            </label>
                            <div className="mt-1">
                                <input type="email" name="mothers-email" id="mothers-email" className="form-input" />
                            </div>

                            <label htmlFor="mothers-password" className="block text-sm font-medium text-gray-700">
                                Mother&apos;s Password
                            </label>
                            <div className="mt-1">
                                <input type="password" name="mothers-password" id="mothers-password" autoComplete="new-password" className="form-input" />
                            </div>

                            <div className="mt-6">
                                <LoadingButton type="submit" isLoading={isLoading}>
                                    {isLoading ? "Creating Mother's Account": "Create Mother's Account"}
                                </LoadingButton>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </>)
}