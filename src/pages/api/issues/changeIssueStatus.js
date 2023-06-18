import { issueStatus } from "@/lib/issues";
import prisma from "@/lib/prisma";
import { notifyUsers } from "@/lib/notifyUser";

export default async function changeIssueStatusHandler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Method Not Allowed" });
        return;
    }

    const { id, status } = req.body;

    if(!id || !status) {
        res.status(400).json({ message: "Bad request" });
        return;
    }

    let issue;
    try {
        let nextStatus;

        switch (status) {
            case issueStatus.NEW:
                nextStatus = issueStatus.ASSIGNED;
                break;
            case issueStatus.ASSIGNED:
                nextStatus = issueStatus.SOLVING;
                break;
            case issueStatus.SOLVING:
                nextStatus = issueStatus.SOLVED;
                break;
            case issueStatus.SOLVED:
                nextStatus = issueStatus.APPROVED;
                break;
            case issue.APPROVED:
                nextStatus = issueStatus.SOLVING;
                break;
            default:
                nextStatus = issueStatus.NEW;
                break;
        }

        if (nextStatus) {
            issue = await prisma.Issue.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    status: nextStatus,
                }
            });

            // This function call will notify the users that the issue status has changed if they have opted in for notifications
            const _ = await notifyUsers(issue.id);
        }
    } catch (error) {
        res.status(400).json({ error: "Something went wrong with finding the issue" });  //aka child is not in database
        return;
    }

    res.status(200).json({ data: issue });
}