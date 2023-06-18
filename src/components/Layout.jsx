import useUser from '@/lib/useUser';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import fetchJson from "@/lib/fetchJson";
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import { useRef } from 'react';

export default function Layout({ children }) {
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const menuRef = useRef(null);

    const { user: userFromHook } = useUser();

    useEffect(() => {
        setUser(userFromHook);
    }, [userFromHook]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [router.asPath]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
    });

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            await fetchJson("/api/logout", {
                method: "POST",
            });
            toast.success("Logged out successfully");
            router.push("/");
        } catch (e) {
            console.error(e);
        }
    };

    return <>
        <Head>
            <meta name="description" content="An app to outsource your mother's tech problems" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="min-h-screen bg-gray-100">
            <div className="">
                <nav className="bg-gray-800">
                    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="flex items-center justify-start">
                                <span className="text-white font-bold text-lg mr-4">Help My Mom</span>
                            </div>
                            <div className="flex items-center justify-end">
                                {user?.isLoggedIn ? (<>
                                    {user.is_helper ? (
                                        <Link href="/helper" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Dashboard
                                        </Link>
                                    ) : (<>
                                        <Link href="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Issues
                                        </Link>
                                        <Link href="/issues/create" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Report An Issue
                                        </Link>
                                    </>)}
                                    <div className="relative" ref={menuRef}>
                                        <div onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                            <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                                <span className="flex flex-row items-center">
                                                    {user.email}
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                    </svg>
                                                </span>
                                            </button>
                                        </div>
                                        <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 h-auto' : 'opacity-0 h-0 invisible'}`}>
                                            <div className="py-1 rounded-md bg-white shadow-xs">
                                                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                                    Profile
                                                </Link>
                                                <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                                    Settings
                                                </Link>
                                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" onClick={async (e) => handleLogout(e)}>
                                                    Sign Out
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </>) : (<>
                                    <Link href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Log in</Link>
                                </>)}
                            </div>
                        </div>
                    </div>
                </nav>
                <main className="container mx-auto mt-4">
                    {children}
                    <ToastContainer position='bottom-right' />
                </main>
            </div>
        </div>
    </>
}