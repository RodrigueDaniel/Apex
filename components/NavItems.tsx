'use client'

import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

// --- STEP 1: Add this interface definition ---
interface NavItemsProps {
    isMobile?: boolean;
}

// --- STEP 2: Update the function to accept the props ---
const NavItems = ({ isMobile }: NavItemsProps) => {
    const pathname = usePathname();

    const isActive = (path: string) => {
        // Exact match for dashboard ('/'), partial match for others
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    }

    return (
        // Optional: You can use isMobile to force vertical layout if needed
        // For now, keeping your original classes works if screen size controls it
        <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
            {NAV_ITEMS.map(({ href, label }) => (
                <li key={href}>
                    <Link 
                        href={href} 
                        className={`transition-colors duration-200 ${
                            isActive(href) 
                                ? 'text-yellow-400 font-bold' // ACTIVE: Yellow
                                : 'text-gray-400 hover:text-yellow-200' // INACTIVE: Gray
                        }`}
                    >
                        {label}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default NavItems;