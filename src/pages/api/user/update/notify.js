import prisma from "@/lib/prisma";

export default async function updateNotifyHandler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method Not Allowed" });
        return;
    }

    const { userId, wantsNotify } = req.body;

    if (!userId || (wantsNotify === undefined)) {
        res.status(400).json({ error: "Missing Fields" });
        return;
    }

    try {
        let result = await prisma.User.update({
            where: {
                id: parseInt(userId),
            },
            data: {
                notify: wantsNotify,
            }
        });

        res.status(200).json({ user: result });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}