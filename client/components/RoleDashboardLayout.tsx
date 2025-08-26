import React from "react";
import { Link } from "react-router-dom";
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, ChevronDown, ChevronRight } from "lucide-react";

// Generic navigation item types
export type NavIcon = React.ComponentType<{ className?: string }>;

export type NavSimple = {
  title: string;
  href: string;
  icon: NavIcon;
  isActive: boolean;
  isExpandable?: false;
};

export type NavSubItem = {
  title: string;
  href: string;
  icon: NavIcon;
  isActive: boolean;
};

export type NavExpandable = {
  title: string;
  icon: NavIcon;
  isExpandable: true;
  isOpen: boolean;
  onToggle: () => void;
  subItems: NavSubItem[];
};

export type NavigationItem = NavSimple | NavExpandable;

interface RoleDashboardLayoutProps {
  title: string;
  navigationItems: NavigationItem[];
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  sidebarProfile?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
}

const isExpandableItem = (i: NavigationItem): i is NavExpandable => (i as any).isExpandable === true;

export default function RoleDashboardLayout({ title, navigationItems, children, headerActions, sidebarProfile, sidebarFooter }: RoleDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          {sidebarProfile ? (
            <SidebarGroup>
              {/* <SidebarGroupLabel>Profile</SidebarGroupLabel> */}
              <SidebarGroupContent>
                <div className="px-2 py-2">{sidebarProfile}</div>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : null}
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
                          {item.isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
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
                        isActive={(item as NavSimple).isActive}
                        className="transition-colors duration-200 hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/15 data-[active=true]:text-primary"
                      >
                        <Link to={(item as NavSimple).href}>
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
        <SidebarFooter>
          {sidebarFooter ? <div className="w-full px-2 py-2">{sidebarFooter}</div> : null}
        </SidebarFooter>


      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
