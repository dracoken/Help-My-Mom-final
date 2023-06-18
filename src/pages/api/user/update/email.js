import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(updateEmailHandler, sessionOptions);

export async function updateEmailHandler(req, res) {
    const user = req.session.user;

    if (req.method !== "POST") {
        res.status(405).json({ error: "Method Not Allowed" });
        return;
    }

    if (!user) {
        res.status(401).json({ error: "Not Logged In" });
        return;
    }

    const { new_email } = req.body;

    if (!new_email) {
        res.status(400).json({ error: "Missing Fields" });
        return;
    }

    try {
        const userRecord = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        });

        if (!userRecord) {
            res.status(404).json({ error: "User Not Found" });
            return;
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                email: new_email
            }
        });

        if (!updatedUser) {
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        res.status(200).json({ message: "Email updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}