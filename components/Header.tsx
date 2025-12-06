import Link from "next/link";
import Image from "next/image";
import UserDropdown from "@/components/UserDropdown";
import NavItems from "@/components/NavItems"; // Import your component

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0B0E14]/80 backdrop-blur-md">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                
                {/* LEFT: Logo Area */}
                <Link href="/" className="flex items-center gap-2">
                    <Image 
                        src="/assets/icons/logo2.svg" 
                        alt="Apex logo" 
                        width={120} 
                        height={32} 
                        className="h-8 w-auto" 
                    />
                </Link>

                {/* CENTER: Navigation Items (Hidden on mobile if needed, or visible) */}
                <div className="hidden md:block">
                    <NavItems />
                </div>

                {/* RIGHT: User Profile */}
                <UserDropdown />
            </div>
        </header>
    )
}

export default Header;