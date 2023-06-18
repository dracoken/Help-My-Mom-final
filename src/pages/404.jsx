import Link from "next/link";

export default function Custom404() {
    return <>
        <div className="flex flex-col items-center justify-center min-h-screen -z-10">
            <h1 className="text-6xl font-bold text-gray-600">404</h1>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Page Not Found</h2>
            <p className="text-gray-500 mb-4">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. Please check the URL and try again.
            </p>
            <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Go back home
            </Link>
        </div>
    </>
}

Custom404.getLayout = function getLayout(page) {
    return <div>{page}</div>;
};