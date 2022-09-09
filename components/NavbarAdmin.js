import React, { useState } from 'react';

import Link from 'next/link'

export default function NavbarAdmin() {
    const [menuState, setMenuState] = useState(false);
    function toggleMenu(e) {
        e.preventDefault();
        setMenuState(!menuState);
    }

    return (
        <div className="transition-all duration-300 relative overflow-x-hidden select-none flex items-center justify-between flex-wrap h-14 sm:h-12 bg-slate-800 text-white font-Montserrat">
            <Link href="/">
                <p className="my-auto ml-5 font-extrabold text-2xl sm:text-base sm:text-white hover:cursor-pointer text-white">AskMe</p>
            </Link>

            <div className="inline-block sm:hidden mr-5">
                <div className="w-full h-full relative z-20" onClick={toggleMenu}>
                    <div className={`right-1 ${menuState ? "fixed right-[25px] top-[18px]" : "absolute top-1/2 -translate-y-1/2"}`} onClick={toggleMenu}>
                        <div className={`transition-all duration-700 w-6 h-[3px] bg-white my-[3px] rounded-md ${menuState ? "rotate-45 translate-y-[6px]" : ""}`} />
                        <div className={`transition-all duration-700 w-6 h-[3px] bg-white my-[3px] rounded-md ${menuState ? "opacity-0" : "opacity-100"}`} />
                        <div className={`transition-all duration-700 w-6 h-[3px] bg-white my-[3px] rounded-md ${menuState ? "-rotate-[405deg] -translate-y-[6px]" : ""}`} />
                    </div>
                </div>

                {/* Mobile Version */}
                <div className={`fixed z-10 top-0 left-0 w-full text-xl h-screen overflow-y-auto bg-slate-800 transition-all duration-300 ${menuState ? "translate-y-0" : "-translate-y-full"}`}>
                    {/* Home */}
                    <Link href="/">
                        <p className="ml-5 py-4 bg-slate-800 hover:text-gray-500 hover:cursor-pointer">Home</p>
                    </Link>
                    <div className="bg-gray-700 w-full h-[2px]" />

                    {/* Manage Users */}
                    <Link href="/admin/users">
                        <p className="ml-5 py-4 bg-primary-bg2 hover:text-gray-500 hover:cursor-pointer">Manage users</p>
                    </Link>
                    <div className="bg-gray-700 w-full h-[2px]" />

                    {/* Logout */}
                    <Link href="/api/auth/logout">
                        <p className="ml-5 py-4 bg-primary-bg2 hover:text-gray-500 hover:cursor-pointer">Logout</p>
                    </Link>
                    <div className="bg-gray-700 w-full h-[2px]" />
                </div>
            </div>

            {/* Desktop Version */}
            <div className="my-auto float-right font-medium hidden sm:flex">
                {/* Logout */}
                <Link href="/api/auth/logout">
                    <p className="mx-5 hover:text-gray-500 hover:cursor-pointer">Logout</p>
                </Link>
            </div>
        </div >
    )
}