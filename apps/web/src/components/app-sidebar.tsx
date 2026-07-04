import { BadgeCheck } from "lucide-react";

import { piscines } from "@/data/data";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@testery/ui/components/sidebar";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

const piscineNames = Object.keys(piscines);

export default function AppSidebar() {
  const health = useQuery(orpc.healthCheck.queryOptions());
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Available Piscines</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {piscineNames.map((name) => (
                <SidebarMenuItem key={name}>
                  <SidebarMenuButton tooltip={name}>
                    <span className="truncate">{name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between border px-3 py-2 text-xs">
          {health.isLoading ? (
            <span className="text-muted-foreground">
              Checking connection...
            </span>
          ) : health.isError ? (
            <span className="text-red-500">Disconnected</span>
          ) : (
            <div className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-emerald-500" />
              <span>Connected</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
