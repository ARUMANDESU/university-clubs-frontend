'use client';
import Link from 'next/link';
import Image from "next/image";
import {ModeToggle} from "@/components/ui/toggle-mode";
import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

/*function getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}*/

export default function Nav() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        //todo: нужно по другому логику реализовать
        /*const token = getCookie("session_token")
        console.log(token)
        setIsAuthenticated(!!token);*/
    }, []);

    return (
        <header>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

                    <Link href="../" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Image src="" className="h-8" alt=""/>
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">UCMS AITU</span>
                    </Link>

                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <ModeToggle/>
                        <Link href={"/sign-in"}>
                            <Button>
                                Login
                            </Button>
                        </Link>
                    </div>


                    <div className="items-center justify-items-stretch hidden w-full md:flex max-w-xl md:order-1" id="navbar-cta">
                        <Input className="rounded-3xl bg-gray-200"/>
                    </div>
                </div>
            </nav>
        </header>
    );
}


