import { issueStatus } from "@/lib/issues";
import prisma from "@/lib/prisma";
import { notifyUsers } from "@/lib/notifyUser";

export default async function handler(req, res) {
    const { issueId, solution } = req.body;

    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    if (!issueId || !solution) {
        res.status(400).json({ error: "Bad request" });
        return;
    }

    try {
        const updatedIssue = await prisma.Issue.update({
            where: {
                id: issueId
            },
            data: {
                solution: solution,
                status: issueStatus.SOLVED
            },
        });

        await notifyUsers(updatedIssue.id);

        res.status(200).json({ issue: updatedIssue });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not attach solution." });
        return;
    }
}