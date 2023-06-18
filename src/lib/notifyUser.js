import prisma from "@/lib/prisma";
import { getBaseUrl } from "./getBaseUrl";
import sendEmail from "@/lib/sendEmail";
import { issueStatus } from "./issues";

export const notifyUsers = async (issueId) => {
    let issue;
    let complainer;
    let second_complainer;
    let helper;

    try {
        issue = await prisma.Issue.findUnique({
            where: {
                id: parseInt(issueId)
            },
            include: {
                complainer: true,
                helper: true
            }
        })

        complainer = issue.complainer;
        helper = issue.helper;
    } catch (error) {
        console.log(error);
        return;
    }

    if (issue.status === issueStatus.NEW || issue.status === issueStatus.ASSIGNED) return;

    if (complainer.is_mother) {
        second_complainer = await prisma.user.findUnique({
            where: {
                id: parseInt(complainer.id)
            },
            include: {
                child: true
            }
        })

        second_complainer = second_complainer.child;
    } else {
        second_complainer = await prisma.user.findUnique({
            where: {
                id: parseInt(complainer.id)
            },
            include: {
                mother: true
            }
        })

        second_complainer = second_complainer.mother;
    }

    if (!complainer) {
        console.log("No complainer found, aborting notification.");
        return;
    }

    if (complainer.notify) {
        await sendEmail(complainer.email, "Issue status updated",
            `<p>Your issue (${issue.title}), has changed status to ${issue.status}.</p>
            <p>You can view the issue at <a href="${getBaseUrl()}/issues/${issueId}" target="_blank">${getBaseUrl()}/issues/${issueId}</a>.</p>`);
    }

    if (second_complainer.notify) {
        await sendEmail(second_complainer.email, "Issue status updated",
            `<p>Your issue (${issue.title}), has changed status to ${issue.status}.</p>
            <p>You can view the issue at <a href="${getBaseUrl()}/issues/${issueId}" target="_blank">${getBaseUrl()}/issues/${issueId}</a>.</p>`);
    }

    if (issue.status === issueStatus.APPROVED) {
        if (helper.notify) {
            await sendEmail(helper.email, "Issue marked as approved",
                `<p>The issue you helped with (${issue.title}), has changed status to ${issue.status}.</p>
                <p>The complainer has marked the issue as approved.</p>
                <p>Funds have been deposited to your account for solving the issue.</p>
                <p>You can view the past issue at <a href="${getBaseUrl()}/profile" target="_blank">${getBaseUrl()}/profile</a>.</p>`);
        }
    }

    return;
}