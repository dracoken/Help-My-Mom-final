import prisma from "@/lib/prisma";

// params:
// order_data: json object of order data
// orderTime: time order should be ready
// price: total price of order
// derived params:
// createdAt: time order was placed
// orderStatus: status of order

export default async function handler(req, res) {
    const { amount, userID, desc, issueID } = req.body;

    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    if (!userID || !amount) {
        res.status(400).json({ error: "Missing required parameters" });
        return;
    }

    let confUser;

    try {
        confUser = await prisma.User.findUnique({ where: { id: parseInt(userID) } })
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Something unexpected occurred." });
    }
    let issue;
    if (issueID) {
        try {
            issue = await prisma.Issue.findUnique({ where: { id: issueID } })
        } catch (e) {
            console.log(e);
            res.status(501).json({ error: "Something unexpected occurred." });
        }
    }
    let paymentHistory;
    if (issueID) {
        paymentHistory = await prisma.paymentHistory.create({
            data: {
                amount: parseFloat(amount),
                desc: desc,
                payer: {
                    connect: {
                        id: confUser.id,
                    }
                },
                issue: {
                    connect: {
                        id: issue.id,
                    }
                },
            },
        }).catch((e) => {
            console.log(e);
            res.status(500).json({ error: "Something unexpected occurred." });
            return;
        });
    } else {
        paymentHistory = await prisma.paymentHistory.create({
            data: {
                amount: parseFloat(amount),
                desc: desc,
                payer: {
                    connect: {
                        id: confUser.id,
                    }
                },
            }
        }).catch((e) => {
            console.log(e);
            res.status(500).json({ error: "Something unexpected occurred." });
            return;
        });
    }
    res.status(200).json({ data: paymentHistory });
}