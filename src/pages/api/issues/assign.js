import prisma from "@/lib/prisma";
import { issueStatus } from "@/lib/issues";
import sendEmail from "@/lib/sendEmail";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default async function assignIssueHandler(req, res) {
    const { helper, issue } = req.body;

    if (req.method !== "POST") {
        res.status(405).json({ message: "Method Not Allowed" });
        return;
    }

    if (!helper || !issue) {
        res.status(400).json({ message: "Bad Request" });
        return;
    }

    try {
        const updatedIssue = await prisma.Issue.update({
            where: {
                id: parseInt(issue),
            },
            include: {
                helper: true,
            },
            data: {
                helperId: parseInt(helper),
                status: issueStatus.ASSIGNED,
            },
        });

        if (updatedIssue.helper.notify) {
            const _ = await sendEmail(updatedIssue.helper.email, "New issue assigned to you.",
                `<p>Hi ${updatedIssue.helper.email},</p>
                    <p>You have been assigned to issue #${updatedIssue.id} (${updatedIssue.title}).</p>
                    <p>Click <a href="${getBaseUrl()}/issues/${updatedIssue.id}">here</a> to view the issue.</p>`);
        }

        res.status(200).json({ issue: updatedIssue });
    } catch (error) {
        res.status(400).json({ error: "Error updating issue" });
        return;
    }
}