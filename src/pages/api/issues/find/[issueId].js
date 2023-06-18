import prisma from "@/lib/prisma"

export default async function findIssueHandler(req, res) {
    const { issueId } = req.query;

    // only allow PATCH
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    // validate the request body
    if (!issueId) {
        return res.status(400).json({ message: 'Bad Request' })
    }

    let issue;
    try {
        issue = await prisma.Issue.findUnique({
            where: {
                id: parseInt(issueId)
            },
            include: {
                helper: {
                    select: {
                        email: true,
                        contact: true,
                    }
                }
            }
        })

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }

    res.status(200).json({ success: true, issue: issue })
}