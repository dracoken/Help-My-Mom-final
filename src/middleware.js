import { NextResponse } from "next/server";
import { getIronSession } from "iron-session/edge";
import { sessionOptions } from "@/lib/session";

// this middleware is to handle a basic form of authorization
export const middleware = async (req) => {
    const res = NextResponse.next();
    const session = await getIronSession(req, res, sessionOptions);

    const { user } = session;

    if (user == undefined) {
        return NextResponse.redirect(new URL('/', req.url)) // redirect to home page
    }

    if (req.nextUrl.pathname.startsWith('/auth/routing')) {
        if (user.is_helper) {
            return NextResponse.redirect(new URL('/helper', req.url)) // redirect to worker page
        } else {
            return NextResponse.redirect(new URL('/dashboard', req.url)) // redirect to customer page
        }
    }

    if(req.nextUrl.pathname.startsWith('/issues/create')) {
        if (user.is_helper) {
            return NextResponse.redirect(new URL('/helper', req.url)) // redirect to worker page
        }
    }

    if(req.nextUrl.pathname.startsWith('/dashboard')) {
        if (user.is_helper) {
            return NextResponse.redirect(new URL('/helper', req.url)) // redirect to worker page
        }
    }

    if(req.nextUrl.pathname.startsWith('/helper')) {
        if (!user.is_helper) {
            return NextResponse.redirect(new URL('/dashboard', req.url)) // redirect to customer page
        }
    }

    return res;
};

// users that are not logged in will be unable to access these pages
export const config = {
    matcher: ['/dashboard', '/helper', '/auth/routing', '/issues/create', '/issues', '/issues/past', '/issues/[id]', '/settings'],
};