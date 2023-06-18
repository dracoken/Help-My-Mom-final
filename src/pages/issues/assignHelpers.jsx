import Head from 'next/head'
import Link from 'next/link'

export default function assignHelpers() { // localhost:3000/assignHelpers
    return <>
        <Head>
            <title>Issues</title>
            <meta name="description" content="Here is a list of helpers to assign to the issue at hand" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="text-center">
            <h1 className='text-3xl font-bold'>Helpers</h1><br></br>
            <form className="flex flex-col mx-auto w-1/2 pt-4">
                <button className="bg-blue-500 p-2 rounded-md text-white hover:bg-gray-400 mt-4">Assign Helpers</button>
            </form>
        </div>
    </>
}