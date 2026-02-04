"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    isActive: boolean;
}

function NavLink({ href, children, isActive }: NavLinkProps) {
    return (
        <Link
            href={href}
            className={cn(
                "px-6 py-2 font-headings uppercase text-lg font-bold border-2 border-festival-black transition-all",
                isActive
                    ? "bg-festival-yellow text-festival-black festival-shadow"
                    : "bg-white text-festival-black hover:bg-festival-red hover:text-white festival-shadow hover:translate-x-[2px] hover:translate-y-[2px]"
            )}
            style={isActive ? {} : { boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
        >
            {children}
        </Link>
    );
}

export function Navigation() {
    const pathname = usePathname();

    if (pathname === "/login" || pathname === "/signup") {
        return null;
    }

    return (
        <nav className="bg-festival-red border-b-4 border-festival-black">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 group"
                    >
                        <div className="w-12 h-12 bg-festival-yellow border-2 border-festival-black flex items-center justify-center festival-shadow group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-transform">
                            <span className="text-2xl font-headings font-bold">🎪</span>
                        </div>
                        <div className="font-headings uppercase">
                            <div className="text-2xl font-bold text-white leading-none">Les Puies</div>
                            <div className="text-xl font-bold text-festival-yellow leading-none">de Juillet</div>
                        </div>
                    </Link>

                    <div className="flex items-center gap-3">
                        <NavLink href="/dashboard" isActive={pathname === "/dashboard"}>
                            Accueil
                        </NavLink>
                        <NavLink
                            href="/conferences"
                            isActive={pathname?.startsWith("/conferences") || false}
                        >
                            Programme
                        </NavLink>
                        <NavLink href="/my-program" isActive={pathname === "/my-program"}>
                            Mon Agenda
                        </NavLink>
                        <NavLink href="/account" isActive={pathname === "/account"}>
                            Compte
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}