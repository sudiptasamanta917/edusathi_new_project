import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    FileVideo,
    BarChart3,
    ClipboardList,
    BookOpen,
    DollarSign,
    Banknote,
    GraduationCap,
} from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "../../components/ui/avatar";
import { useAuth } from "../../src/contexts/AuthContext";

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
    navItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
    { name: "Dashboard", href: "/creator", icon: LayoutDashboard },
    { name: "Content", href: "/dashboard/creator/contents", icon: FileVideo },
    {
        name: "Analytics",
        href: "/dashboard/creator/analytics",
        icon: BarChart3,
    },
    {
        name: "Assessment",
        href: "/dashboard/creator/assessments",
        icon: ClipboardList,
    },
    { name: "Resources", href: "/dashboard/creator/resources", icon: BookOpen },
    {
        name: "Monetization",
        href: "/dashboard/creator/monetization",
        icon: DollarSign,
    },
    { name: "Payment", href: "/dashboard/creator/payment", icon: Banknote },
];

const Sidebar: React.FC<SidebarProps> = ({ navItems = defaultNavItems }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    // Optional: Fetch user from API if not in context
    useEffect(() => {
        // The user should already be available from AuthContext after login
        // If user is null, they might not be logged in
        if (!user) {
            console.log("No user found in AuthContext. User might not be logged in.");
        }
    }, [user]);

    const initials = (user?.name || "C").slice(0, 1).toUpperCase();

    return (
        <aside className="sticky top-0 left-0 w-60 h-screen bg-[#282828] flex flex-col justify-between border-r border-gray-600 p-5">
            <div className="flex flex-col flex-1">
                {/* Logo */}
                <div className="flex items-center justify-center mb-6 border-b border-gray-600 text-[10px] pb-4 gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-300">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-display">
                        Edusathi
                    </span>
                </div>

                {/* User Avatar + Name */}
                <div className="flex flex-col items-center pb-6">
                    <Avatar className="h-24 w-24">
                        {user?.avatarUrl ? (
                            <AvatarImage
                                src={user.avatarUrl}
                                alt={user?.name || "User"}
                            />
                        ) : (
                            <AvatarFallback className="flex items-center justify-center bg-gray-600">
                                <FaUserCircle className="h-24 w-24 text-gray-300" />
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <h2 className="mt-3 font-semibold text-sm text-center">
                        {user?.name || "Creator"}
                    </h2>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col p-2 flex-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex my-1 items-center text-md gap-3 rounded-sm p-3 hover:bg-[#1f1f1f] ${
                                    isActive
                                        ? "bg-[#1f1f1f] text-white font-semibold"
                                        : "text-gray-200"
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="pt-4 border-t border-gray-600">
                <Button 
                    className="w-full" 
                    variant="destructive"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;
