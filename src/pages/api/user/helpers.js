import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.status(405).json({ message: "Method Not Allowed" });
        return;
    }

    try {
        const helpers = await prisma.User.findMany({
            where: {
                is_helper: true,
            },
        });

        res.status(200).json({ helpers });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Something went wrong" });
        return;
    }
};