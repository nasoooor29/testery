import { BadgeCheck, ChevronDown } from "lucide-react";

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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@testery/ui/components/collapsible";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { useLocation, useParams } from "@tanstack/react-router";
import { NodeSchema } from "@/schemas/bh";
import { getSortedChildren } from "@/utils/piscine";

const piscineNames = Object.keys(piscines);

export default function AppSidebar() {
  const health = useQuery(orpc.healthCheck.queryOptions());
  const route = useLocation();
  return (
    <Sidebar>
      {route.pathname === "/" && <HomePageSidebar />}
      {route.pathname.startsWith("/piscines/") && (
        <PiscineSidebar name={route.pathname.split("/")[2]} />
      )}

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

function HomePageSidebar() {
  return (
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
  );
}

function PiscineSidebar({ name }: { name: string }) {
  const node = piscines[name as keyof typeof piscines];
  const typedPiscine = NodeSchema.safeParse(node);
  if (!typedPiscine.success || typedPiscine.data.type !== "piscine") {
    return (
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Invalid Piscine</SidebarGroupLabel>
          <SidebarGroupContent>
            <p className="text-sm text-red-500">
              The piscine data is invalid. Please check the data source {name}.
            </p>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    );
  }
  const piscine = typedPiscine.data;
  const quests = getSortedChildren(piscine);
  if (!quests || Object.keys(quests).length === 0) {
    return (
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>No Quests</SidebarGroupLabel>
          <SidebarGroupContent>
            <p className="text-sm text-muted-foreground">
              This piscine has no quests available.
            </p>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    );
  }
  return (
    <SidebarContent>
      {Object.entries(quests).map(([index, questNode]) => (
        <Collapsible
          key={index}
          defaultOpen={false}
          className="group/collapsible"
        >
          <SidebarGroup>
            <CollapsibleTrigger>
              <SidebarGroupLabel className="hover:bg-secondary hover:text-secondary-foreground">
                {questNode.name}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {questNode.children &&
                    Object.entries(questNode.children).map(
                      ([childName, childNode]) => (
                        <SidebarMenuItem key={childName}>
                          <SidebarMenuButton
                            tooltip={childName}
                            onClick={() => {
                              console.log(childName, childNode);
                            }}
                          >
                            {childName}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ),
                    )}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      ))}
    </SidebarContent>
  );
}
