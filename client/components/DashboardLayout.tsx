import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Building,
  Plus,
  List,
  BarChart3,
  Settings as SettingsIcon,
  DollarSign,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type NavIcon = React.ComponentType<{ className?: string }>;

type NavSimple = {
  title: string;
  href: string;
  icon: NavIcon;
  isActive: boolean;
  isExpandable: false;
};

type NavSubItem = {
  title: string;
  href: string;
  icon: NavIcon;
  isActive: boolean;
};

type NavExpandable = {
  title: string;
  icon: NavIcon;
  isExpandable: true;
  isOpen: boolean;
  onToggle: () => void;
  subItems: NavSubItem[];
};

type NavigationItem = NavSimple | NavExpandable;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [centerManagementOpen, setCenterManagementOpen] = useState(false);
  const [creatorManagementOpen, setCreatorManagementOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isExpandableItem = (i: NavigationItem): i is NavExpandable => i.isExpandable === true;

  const navigationItems: NavigationItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard/overview",
      icon: LayoutDashboard,
      isActive: location.pathname === "/dashboard/overview",
      isExpandable: false,
    },
    {
      title: "Center Management",
      icon: Building,
      isExpandable: true,
      isOpen: centerManagementOpen,
      onToggle: () => setCenterManagementOpen(!centerManagementOpen),
      subItems: [
        
        {
          title: "Center List",
          href: "/dashboard/centers",
          icon: List,
          isActive: location.pathname === "/dashboard/centers",
        },
        {
          title: "Create Sub Center",
          href: "/dashboard/centers/create",
          icon: Plus,
          isActive: location.pathname === "/dashboard/centers/create",
        },
      ],
    },
     
    {
      title: "Settings",
      icon: SettingsIcon,
      isExpandable: true,
      isOpen: settingsOpen,
      onToggle: () => setSettingsOpen(!settingsOpen),
      subItems: [
        {
          title: "Price Management",
          href: "/dashboard/settings/pricing",
          icon: DollarSign,
          isActive: location.pathname === "/dashboard/settings/pricing",
        },
      ],
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Edusathi</span>
              <span className="text-xs text-muted-foreground">Dashboard</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {isExpandableItem(item) ? (
                      <>
                        <SidebarMenuButton
                          onClick={item.onToggle}
                          className="w-full justify-between transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                          {item.isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </SidebarMenuButton>
                        {item.isOpen && item.subItems && (
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={subItem.isActive}
                                  className="transition-colors duration-200 hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/15 data-[active=true]:text-primary"
                                >
                                  <Link to={subItem.href}>
                                    <subItem.icon className="h-4 w-4" />
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        )}
                      </>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        isActive={item.isActive}
                        className="transition-colors duration-200 hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/15 data-[active=true]:text-primary"
                      >
                        <Link to={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Edusathi Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
