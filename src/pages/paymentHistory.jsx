import { sessionOptions } from "@/lib/session";
import { withIronSessionSsr } from "iron-session/next";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function PaymentHistory({ user, payments }) {

    return (
        <div className="bg-gray-100 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold mb-8">Payment History</h1>
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Payment ID
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Payment Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Payment Amount
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Payment Description
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {payments.map((payment) => (
                                            <tr key={payment.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.createdAt.slice(0, 10)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{"$" + payment.amount.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.desc}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function getPaymentHistory(id) {
    const res = await fetch(`${getBaseUrl()}/api/user/getPaymentHistory`, {
        method: 'PATCH',
        body: JSON.stringify({ user: id }),
    })
    const data = await res.json()
    return data.data;
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
    const payments = await getPaymentHistory(user.id);
    return {
        props: {
            payments: payments,
            user: user,
        }
    }
}, sessionOptions);