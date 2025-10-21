import { useState, useEffect, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X, ChevronDown } from "lucide-react";
import { FaUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";

type CartItem = {
    courseId: string;
    title: string;
    price: number;
    thumbnail: string;
    creator: string;
    addedAt: string;
};

const navLinks = [
    {
        label: "Product",
        to: "/product",
        dropdown: [
            {
                section: "What You Want",
                items: [
                    { label: "Online courses", to: "/student" },
                    { label: "Coaching", to: "/creator" },
                    { label: "Memberships", to: "/product/memberships" },
                    { label: "Creator", to: "/creator" },
                    { label: "Business", to: "/business" },
                    {
                        label: "Product overview",
                        to: "/product/overview",
                        highlight: true,
                    },
                ],
            },
            {
                section: "Feature Highlights",
                items: [
                    {
                        label: "Sales & marketing",
                        to: "/sales-marketing",
                        icon: "📢",
                    },
                    { label: "Payments", to: "/payments", icon: "💰" },
                    {
                        label: "Analytics",
                        to: "/analytics",
                        icon: "📊",
                    },
                    { label: "Support services", to: "/support", icon: "💬" },
                    { label: "Site builder", to: "/site-builder", icon: "🖥️" },
                    { label: "Mobile app", to: "/mobile-app", icon: "📱" },
                    { label: "AI features", to: "/ai-features", icon: "🤖" },
                    { label: "App hub", to: "/app-hub", icon: "🔗" },
                    {
                        label: "Student experience",
                        to: "/student-experience",
                        icon: "🎓",
                    },
                    {
                        label: "Advanced features",
                        to: "/advanced-features",
                        icon: "⚙️",
                    },
                    {
                        label: "All product features",
                        to: "/product-features",
                        highlight: true,
                    },
                ],
            },
        ],
    },
    {
        label: "Solutions",
        to: "/solutions",
        dropdown: [
            {
                section: "By Business Stage",
                items: [
                    {
                        label: "I'm starting my business",
                        to: "/solutions/business-stage/starting",
                    },
                    {
                        label: "I'm growing my business",
                        to: "/solutions/business-stage/growing",
                    },
                    {
                        label: "I'm expanding my business",
                        to: "/solutions/business-stage/expanding",
                    },
                    {
                        label: "Enterprise LMS",
                        to: "/solutions/business-stage/enterprise-lms",
                    },
                ],
            },
            {
                section: "By Industry",
                items: [
                    {
                        label: "Marketing & business",
                        to: "/solutions/industry/marketing",
                    },
                    {
                        label: "Health & fitness",
                        to: "/solutions/industry/health-fitness",
                    },
                    {
                        label: "Personal development",
                        to: "/solutions/industry/personal-development",
                    },
                    { label: "Lifestyle", to: "/solutions/industry/lifestyle" },
                    {
                        label: "Academics & languages",
                        to: "/solutions/industry/academics-languages",
                    },
                    {
                        label: "Finance & investing",
                        to: "/solutions/industry/finance-investing",
                    },
                    {
                        label: "Arts & crafting",
                        to: "/solutions/industry/arts-crafting",
                    },
                    {
                        label: "Software & technology",
                        to: "/solutions/industry/software-technology",
                    },
                    {
                        label: "Spirituality & worship",
                        to: "/solutions/industry/spirituality-worship",
                    },
                    {
                        label: "Fashion & beauty",
                        to: "/solutions/industry/fashion-beauty",
                    },
                ],
            },
        ],
    },
    {
        label: "Resources",
        to: "/resources",
        dropdown: [
            {
                section: "Resources",
                items: [
                    {
                        label: "Guides & how-tos",
                        to: "/resources/guides-how-tos",
                        icon: "📁",
                    },
                    {
                        label: "teachable:u",
                        to: "/resources/teachableu",
                        icon: "🎓",
                    },
                    { label: "Blog", to: "/resources/blog", icon: "📰" },
                    { label: "Podcast", to: "/resources/podcast", icon: "🎙️" },
                    {
                        label: "Newsletter",
                        to: "/resources/newsletter",
                        icon: "✉️",
                    },
                    { label: "Events", to: "/resources/events", icon: "📅" },
                    {
                        label: "Resource overview",
                        to: "/resources/overview",
                        highlight: true,
                    },
                ],
            },
            {
                section: "Support Services",
                items: [
                    { label: "Product demo", to: "/support/product-demo" },
                    { label: "Hire an expert", to: "/support/hire-expert" },
                    {
                        label: "Creator stories",
                        to: "/creator-stories",
                    },
                    {
                        label: "Example courses",
                        to: "/example-courses",
                    },
                    { label: "Help center", to: "/help-center" },
                    { label: "Contact", to: "/contact" },
                    {
                        label: "Support services",
                        to: "/support/services",
                        highlight: true,
                    },
                ],
            },
        ],
    },
    { label: "About us", to: "/about" },
    { label: "Contact us", to: "/contact" },
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profile, setProfile] = useState<{
        name?: string;
        email?: string;
        role?: string;
    } | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // get profile data
        const p =
            sessionStorage.getItem("userProfile") ||
            localStorage.getItem("userProfile") ||
            sessionStorage.getItem("user") ||
            localStorage.getItem("user");
        setProfile(p ? JSON.parse(p) : null);

        // get avatar
        const u = localStorage.getItem("studentAvatarUrl") || undefined;
        setAvatarUrl(u);
    }, []);

    // Load cart on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("studentCart");
        if (savedCart) setCartItems(JSON.parse(savedCart));
    }, []);

    // Listen for localStorage changes to update cart
    useEffect(() => {
        const handleStorageChange = () => {
            const savedCart = localStorage.getItem("studentCart");
            if (savedCart) setCartItems(JSON.parse(savedCart));
            else setCartItems([]);
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300
      ${
          scrolled
              ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-md border-slate-200/70 dark:border-slate-800/70"
              : "bg-white/80 dark:bg-slate-900/80 backdrop-blur border-transparent"
      }`}
        >
            <div className="container xl:w-[90%] w-full mx-auto px-4 py-2 flex items-center justify-between gap-2">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    {/* <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        <span className="opacity-80">edu</span>
                        <span className="text-green-600">sathi</span>
                    </span> */}
                    <div>
                        <img
                            src="/logo-light.png"
                            alt="logo"
                            className="bg-transparent md:h-16 h-12 dark:hidden"
                        />
                        <img
                            src="/logo-dark.png"
                            alt="logo"
                            className="bg-transparent md:h-16 h-12 hidden dark:block"
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-center">
                    {navLinks.map((link) => (
                        <Fragment key={link.label}>
                            {!link.dropdown ? (
                                <Link
                                    to={link.to}
                                    className="px-2 py-2 text-sm 2xl:text-lg text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 font-medium rounded-md transition"
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                // Example dropdown (implement hover/focus popover logic as needed)
                                <div className="relative group">
                                    <button className="inline-flex items-center px-2 py-2 text-sm 2xl:text-lg text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 font-medium rounded-md transition">
                                        {link.label}
                                        <ChevronDown className="ml-1 w-4 h-4" />
                                    </button>
                                    {/* Dropdown */}
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-5 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 w-[650px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-b-sm shadow-xl px-10 py-6 z-50">
                                        <div className="flex gap-8">
                                            {/* Left column */}
                                            <div className="flex-[0_0_35%] flex flex-col gap-4">
                                                {link.dropdown
                                                    .filter(
                                                        (_, index) =>
                                                            index === 0
                                                    )
                                                    .map((section) => (
                                                        <div
                                                            key={
                                                                section.section
                                                            }
                                                            className="mb-4 last:mb-2 flex flex-col gap-2"
                                                        >
                                                            <div className="text-xs uppercase text-slate-400 mb-2 border-b border-black/30 dark:border-white pb-2 w-full">
                                                                {
                                                                    section.section
                                                                }
                                                            </div>
                                                            {section.items.map(
                                                                (item) => (
                                                                    <Link
                                                                        key={
                                                                            item.label
                                                                        }
                                                                        to={
                                                                            item.to
                                                                        }
                                                                        className={`block py-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm ${
                                                                            item.highlight
                                                                                ? "text-green-700 dark:text-green-400 font-semibold border-y py-2 border-black/30 dark:border-white"
                                                                                : "text-slate-700 dark:text-slate-300"
                                                                        } flex items-center gap-2`}
                                                                    >
                                                                        {item.icon && (
                                                                            <span className="text-md text-black dark:text-white">
                                                                                {
                                                                                    item.icon
                                                                                }
                                                                            </span>
                                                                        )}
                                                                        {
                                                                            item.label
                                                                        }
                                                                    </Link>
                                                                )
                                                            )}
                                                        </div>
                                                    ))}
                                            </div>
                                            {/* Right column */}
                                            <div className="flex-[0_0_65%] flex flex-col gap-4">
                                                {link.dropdown
                                                    .filter(
                                                        (_, index) =>
                                                            index === 1
                                                    )
                                                    .map((section) => (
                                                        <div
                                                            key={
                                                                section.section
                                                            }
                                                            className="mb-4 last:mb-2 grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="text-xs uppercase text-slate-400 mb-2 col-span-2 border-b border-black/30 dark:border-white pb-2 w-full">
                                                                {
                                                                    section.section
                                                                }
                                                            </div>
                                                            /
                                                            {section.items.map(
                                                                (item) => (
                                                                    <Link
                                                                        key={
                                                                            item.label
                                                                        }
                                                                        to={
                                                                            item.to
                                                                        }
                                                                        className={`block py-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm ${
                                                                            item.highlight
                                                                                ? "text-green-700 dark:text-green-400 font-semibold border-y py-2 border-black/30 dark:border-white"
                                                                                : "text-slate-700 dark:text-slate-300"
                                                                        } flex items-center gap-2`}
                                                                    >
                                                                        {item.icon && (
                                                                            <span className="text-md text-black dark:text-white">
                                                                                {
                                                                                    item.icon
                                                                                }
                                                                            </span>
                                                                        )}
                                                                        {
                                                                            item.label
                                                                        }
                                                                    </Link>
                                                                )
                                                            )}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Fragment>
                    ))}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-1 sm:gap-3">
                    <ThemeToggle />
                    {profile ? (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/student/cart"
                                className="hidden md:block"
                            >
                                <button className="text-sm 2xl:text-lg dark:text-white text-slate-700 p-2 focus:outline-none relative">
                                    <FaShoppingCart className="text-xl" />
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </button>
                            </Link>

                            <Link
                                to="/student"
                                className="hidden md:block group relative"
                            >
                                <button className="">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt="avatar"
                                            className="w-10 h-10 2xl:w-11 2xl:h-11 rounded-full border object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 2xl:w-11 2xl:h-11 rounded-full border flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                            <FaUser className="text-slate-700 dark:text-white text-lg" />
                                        </div>
                                    )}
                                </button>
                                {/* Tooltip */}
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {profile?.name || "Student Dashboard"}
                                </span>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/student" className="hidden md:block">
                                <Button
                                    variant="outline"
                                    className="text-sm 2xl:text-lg text-slate-800 dark:text-slate-900 2xl:px-5 px-4 rounded-sm"
                                >
                                    Student login
                                </Button>
                            </Link>
                            <Link to="/invest" className="hidden md:block">
                                <Button className="bg-green-600 hover:bg-green-700 text-sm 2xl:text-lg text-white font-semibold 2xl:px-5 px-4 rounded-sm transition-all">
                                    Invest Now
                                </Button>
                            </Link>
                        </div>
                    )}
                    {/* Mobile Menu button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setMobileMenuOpen((v) => !v)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </Button>
                </div>
            </div>
            {/* Mobile Navigation Drawer */}
            <div
                className={`lg:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-96 opacity-100 visible" : "max-h-0 opacity-0 invisible overflow-hidden"}`}
            >
                <nav className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            className="py-3 px-3 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {/* Additional mobile CTA */}
                    <Link to="/invest" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">
                            Start for free
                        </Button>
                    </Link>
                </nav>
            </div>
        </header>
    );
}

