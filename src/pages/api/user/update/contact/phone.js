import prisma from "@/lib/prisma";

export default async function updatePhoneContactHandler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method Not Allowed" });
        return;
    }

    const { userId, phoneNumber, canCall, canText } = req.body;

    if (!userId || (phoneNumber === undefined) || (canCall === undefined) || (canText === undefined)) {
        res.status(400).json({ error: "Missing Fields" });
        return;
    }

    try {
        let existingContact = await prisma.ContactMethods.findUnique({
            where: {
                userId: parseInt(userId),
            },
            include: {
                user: true,
            }
        });

        if (!existingContact) {
            existingContact = await prisma.ContactMethods.create({
                data: {
                    userId: parseInt(userId),
                    phoneNum: phoneNumber,
                    canCall: canCall,
                    canText: canText,
                }
            });
            res.status(200).json({ contact: existingContact });
            return;
        }

        existingContact = await prisma.ContactMethods.update({
            where: {
                userId: parseInt(userId),
            },
            data: {
                phoneNum: phoneNumber,
                canCall: canCall,
                canText: canText,
            },
            include: {
                user: true,
            }
        });

        res.status(200).json({ contact: existingContact });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}