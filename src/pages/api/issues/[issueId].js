import prisma from "@/lib/prisma"

export default async function updateIssueHandler(req, res) {
    const { issueId } = req.query;
    const { status, description, solution, helperId } = req.body;

    // only allow PATCH
    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    // validate the request body
    if (!issueId || !helperId) {
        return res.status(400).json({ message: 'Bad Request' })
    }

    let issue;
    try {
        issue = await prisma.Issue.findUnique({
            where: {
                id: parseInt(issueId)
            }
        })

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' })
        }

        issue = await prisma.Issue.update({
            where: {
                id: parseInt(issueId)
            },
            data: {
                status: status,
                description: description,
                solution: solution,
                helper: {
                    connect: {
                        id: parseInt(helperId)
                    }
                }
            }
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }

    res.status(200).json({ success: true, issue: issue })
}