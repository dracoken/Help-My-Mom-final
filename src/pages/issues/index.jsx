import Head from 'next/head'
import Link from 'next/link'

export default function Issues({ user: helper }) {
    const helperVar = (isHelper, hasIssue) => { console.log("helper"); }
    return <>
        <Head>
            <title>Issues</title>
            <meta name="description" content="Here are your mom's active tech issues" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="text-center">
            <h1 className='text-3xl font-bold'>Issues</h1><br></br>
            <form className="flex flex-col mx-auto w-1/2 pt-4">
                <button className="bg-blue-500 p-2 rounded-md text-white hover:bg-gray-400 mt-4">Assign Helpers</button>
                <select user="Helper" name="Helper" onChange={e => setHelper(e.helperVar, true, false)} className=
                    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option helper="helperVar" selected="selected">Please Choose Helper</option>
                </select>
            </form>
            <br></br>
            <br></br>
            <form className="flex flex-col w-1/2 mx-auto mt-2">
                <Link className="bg-gray-500 p-2 rounded-md text-white hover:bg-gray-400" href='/PastIssues'>Past Issues</Link>
            </form>
        </div>
    </>
}