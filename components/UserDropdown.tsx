"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import NavItems from "@/components/NavItems";
import { signOut, useSession } from "@/lib/auth-client"; 

const UserDropdown = () => {
    const router = useRouter();
    
    const { data: session } = useSession();
    const user = session?.user;

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                },
            },
        });
    }

    if (!user) return null;

    const userInitial = user.name ? user.name[0].toUpperCase() : "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 hover:bg-gray-800 focus:ring-0">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="bg-purple-600 text-white text-sm font-bold">
                            {userInitial}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start text-left">
                        <span className='text-sm font-medium text-white'>
                            {user.name} 
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 bg-gray-900 border-gray-800 text-gray-200" align="end">
                <DropdownMenuLabel>
                    <div className="flex items-center gap-3 py-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user.image || ""} />
                            <AvatarFallback className="bg-purple-600 text-white text-sm font-bold">
                                {userInitial}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                            <span className='text-sm font-medium text-white truncate'>
                                {user.name}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                                {user.email}
                            </span> 
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-800" />
                
                <div className="sm:hidden">
                     <NavItems isMobile={true} />
                     <DropdownMenuSeparator className="bg-gray-800" />
                </div>

                <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer py-2"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown;