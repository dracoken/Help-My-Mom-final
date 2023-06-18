import { issueStatus } from "@/lib/issues";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    const { userId } = req.query;

    if (req.method != "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    if (!userId) {
        res.status(400).json({ error: "Bad request" });
        return;
    }

    let issues;
    try {
        issues = await prisma.Issue.findMany({
            where: {
                helperId: parseInt(userId),
                NOT: {
                    status: {
                        in: [issueStatus.APPROVED, issueStatus.NEW],
                    }
                },
            },
            include: {
                complainer: true,
            },
        });

        if (!issues) {
            res.status(404).json({ error: "Error, no issues found" });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Something went wrong with finding issues" });
        return;
    }

    res.status(200).json({ issues });
}