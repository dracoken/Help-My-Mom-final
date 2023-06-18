import { issueStatus } from "@/lib/issues";
import prisma from "@/lib/prisma";

export default async function createIssueHandler(req, res) {
    const { title, description, userId } = req.body;

    // only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    // validate the request body
    if (!title || !description || !userId) {
        return res.status(400).json({ message: 'Bad Request' })
    }

    let issue;
    try {
        issue = await prisma.Issue.create({
            data: {
                title: title,
                description: description,
                status: issueStatus.NEW,
                complainer: {
                    connect: {
                        id: parseInt(userId)
                    }
                }
            }
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }

    res.status(200).json({ success: true, issue: issue })
}