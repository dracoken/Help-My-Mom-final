import Head from 'next/head'

export default function PastIssues() { // localhost:3000/issues/past
    return (
        <>
            <Head>
                <title>Issues</title>
                <meta name="description" content="Issues that have been resolved" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="text-center">
                <h1 className='text-3xl font-bold'>Issues</h1><br></br>
                <h2>View Details</h2>
                <form className="flex flex-col mx-auto w-1/2 pt-4">
                    <button className="bg-blue-500 p-2 rounded-md text-white hover:bg-gray-400 mt-4">View Details</button>
                </form>
            </div>
        </>
    )
}