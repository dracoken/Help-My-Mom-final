import { issueStatus } from "@/lib/issues";
import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";

// This API route is intended to return all issues for the logged in user, and include issues for the user's parent/child as well.
export default withIronSessionApiRoute(async (req, res) => {
    const user = req.session.user;

    if (!user) {
        res.status(401).json({ error: "Not logged in" });
        return;
    }

    if (!user.is_helper) {
        res.status(401).json({ error: "Only helpers can access this data" });
        return;
    }

    try {
        const issues = await prisma.issue.findMany({
            orderBy: {
                createdAt: "desc"
            },
            where: {
                status: issueStatus.APPROVED,
                helperId: user.id
            },
            include: {
                complainer: true
            }
        });
        res.json(issues);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Something went wrong" });
        return;
    }
}, sessionOptions);