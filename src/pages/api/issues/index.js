import prisma from "@/lib/prisma"

// currently the helper issues request
export default async function handler(req, res) {
    const { userId } = req.body;

    // only allow GET
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    // validate the request body
    if (!userId) {
        return res.status(400).json({ message: 'Bad Request' })
    }

    let issues;
    try {
        issues = await prisma.Issue.findMany({
            where: {
                helper: {
                    id: parseInt(userId)
                }
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }

    res.status(200).json({ success: true, issue: issues })
}