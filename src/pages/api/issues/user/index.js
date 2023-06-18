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

    if (user.is_helper) {
        res.status(401).json({ error: "Only users can access this data" });
        return;
    }

    let query = {
        orderBy: {
            createdAt: "desc"
        },
        where: {
            AND: {
                status: {
                    equals: "approved"
                }
            }
        },
        include: {
            helper: true
        }
    }

    if (user.is_mother) {
        const mother = await findUserWithChild(user.id);

        if (!mother || !mother.child) {
            query = null;
        } else {
            query.where.OR = [
                {
                    complainerId: user.id,
                },
                {
                    complainerId: mother.child.id,
                }
            ]
        }
    }

    if (!user.is_mother) {
        const child = await findUserWithMother(user.id);

        if (!child || !child.mother) {
            query = null;
        } else {
            query.where.OR = [
                {
                    complainerId: user.id,
                },
                {
                    complainerId: child.mother.id,
                }
            ]
        }
    }

    // handle the case where the user has no mother/child
    if (!query) {
        try {
            const issues = await prisma.issue.findMany({
                where: {
                    complainerId: user.id,
                }
            });
            res.json(issues);
            return;
        } catch (error) {
            res.status(400).json({ error: "Something went wrong" });
            return;
        }
    }

    try {
        const issues = await prisma.issue.findMany(query);
        res.json(issues);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Something went wrong" });
        return;
    }
}, sessionOptions);

const findUserWithMother = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id),
        },
        include: {
            mother: true,
        },
    });

    if (!user) {
        return null;
    }

    return user;
};

const findUserWithChild = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id),
        },
        include: {
            child: true,
        },
    });

    if (!user) {
        return null;
    }

    return user;
};