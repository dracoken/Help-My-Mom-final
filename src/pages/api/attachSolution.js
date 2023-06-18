import prisma from "@/lib/prisma";

export default async function handler(req,res) //i guess I can just make another api that updates the status of issues
{
    if(req.method != "POST"){
        res.status(405).json({error:"method not allowed"});
        return;
    }

    const {issueId, solutionData} = req.body; //grab the data
    if(issueId <= 0){
        res.status(406).json({error:"Error! issueId send < 1"});
        return;
    }
    if(solutionData == ""){
        res.status(407).json({error:"Error! solution can't be an empty strng"});
        return;
    }

    try{
        let issueWithSolution = await prisma.Issue.update({
            where:
            {
                id:issueId
            },
            data:
            {
                solution:solutionData
            },
        });
        res.status(200);
    }
    catch (error) {
        res.status(400).json({ error: "Error! issue dosen't exist"});  //aka child is not in database
        return;
    }
}