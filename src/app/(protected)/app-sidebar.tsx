'use client'

import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Bot, CircleAlert, CreditCard, LayoutDashboardIcon, Plus, Presentation } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboardIcon
  },
  {
    title: 'Q&A',
    url: '/qa',
    icon: Bot
  },
  {
    title: 'Meetings',
    url: '/meetings',
    icon: Presentation
  },
  {
    title: 'Billing',
    url: '/billing',
    icon: CreditCard
  }
]

const dummyProjects = [
  { name: 'Project 1' },
  { name: 'Project 2' },
  { name: 'Project 3' },
  { name: 'Project 4' }
]

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
    >
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <CircleAlert />
          {
            open && (
              <h1 className="text-xl font-bold text-primary/80 capitalize">Github saas</h1>
            )
          }
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {
                sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn({
                          '!bg-primary !text-white': pathname === item.url
                        }, 'list-none')}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {
                dummyProjects.map((project) => (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <div>
                        <div className={cn(
                          'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',
                          {'bg-primary text-white' : true}
                        )}>
                          {project.name[0]}
                        </div>
                        
                        <span>{project.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              }

              <div className="h-2 mt-2" />
              {
                open && (
                  <SidebarMenuItem>
                    <Link href='/create'>
                      <Button 
                        variant="outline"
                        className="w-fit"
                        size='sm'
                      >
                        <Plus />
                        Create Project
                      </Button>
                    </Link>
                  </SidebarMenuItem>
                )
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}