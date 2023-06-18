export default function MotherExists({ user }) {
    return (<>
        <h4 className="text-xl font-extrabold text-gray-900">Mother&apos;s Account Info</h4>

        <div className="mt-6">

            <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="mothers-email" className="block text-sm font-medium text-gray-700">
                            Mother&apos;s Email
                        </label>
                        <div className="mt-1">
                            <input type="email" id="mothers-email" className="form-input" value={user.mother.email} disabled />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}