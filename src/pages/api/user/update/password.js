import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(updatePasswordHandler, sessionOptions);

export async function updatePasswordHandler(req, res) {
    const user = req.session.user;

    if (req.method !== "POST") {
        res.status(405).json({ error: "Method Not Allowed" });
        return;
    }

    if (!user) {
        res.status(401).json({ error: "Not Logged In" });
        return;
    }

    const { old_password, new_password, confirm_password } = req.body;

    if (!old_password || !new_password || !confirm_password) {
        res.status(400).json({ error: "Missing Fields" });
        return;
    }

    if (new_password !== confirm_password) {
        res.status(400).json({ error: "Passwords do not match" });
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

        if (userRecord.password !== old_password) {
            res.status(400).json({ error: "Incorrect password" });
            return;
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: new_password
            }
        });

        if (!updatedUser) {
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        res.status(200).json({ message: "Password updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}