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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@testery/ui/components/collapsible";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { Link, useLocation } from "@tanstack/react-router";
import { Node, NodeSchema } from "@/schemas/bh";
import {
  collectSummary,
  getSortedChildren,
  PiscineSummary,
} from "@/utils/piscine";

const piscineNames = Object.keys(piscines);

export default function AppSidebar() {
  const health = useQuery(
    orpc.healthCheck.queryOptions({
      refetchInterval: 1000,
    }),
  );
  const route = useLocation();
  let name: string | undefined;
  if (route.pathname.startsWith("/piscines/")) {
    name = route.pathname.split("/")[2];
  }
  let piscine: Node | undefined;
  let summary: PiscineSummary | undefined;
  if (route.pathname.startsWith("/piscines/") && name) {
    const node = piscines[name as keyof typeof piscines];
    const typedPiscine = NodeSchema.safeParse(node);
    summary = collectSummary(name, node);
    if (!typedPiscine.success) {
      console.error("Invalid piscine data for", name, node, typedPiscine.error);
      return (
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Invalid Piscine</SidebarGroupLabel>
            <SidebarGroupContent>
              <p className="text-sm text-red-500">
                The piscine data is invalid. Please check the data source {name}
                .
              </p>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      );
    }
    piscine = typedPiscine.data;
  }
  return (
    <Sidebar>
      {route.pathname === "/" && <HomePageSidebar />}
      {piscine &&
        name &&
        summary &&
        route.pathname.startsWith("/piscines/") &&
        summary.deepestQuestDepth === 1 && (
          <PiscineSidebar1 name={name} piscine={piscine} />
        )}

      {piscine &&
        name &&
        summary &&
        route.pathname.startsWith("/piscines/") &&
        summary.deepestQuestDepth === 0 && (
          <PiscineSidebar0 name={name} piscine={piscine} />
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
              <Link to="/piscines/$name" params={{ name: name }}>
                <SidebarMenuItem key={name}>
                  <SidebarMenuButton tooltip={name}>
                    <span className="truncate">{name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

// this sidebar is for the piscine page that does not have nested routes it will directly show the exercises in the sidebar
function PiscineSidebar0({ name, piscine }: { name: string; piscine: Node }) {
  const exercies = getSortedChildren(piscine);
  if (!exercies || Object.keys(exercies).length === 0) {
    return (
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>No Quests</SidebarGroupLabel>
          <SidebarGroupContent>
            <p className="text-sm text-muted-foreground">
              This piscine has no exercises available.
            </p>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    );
  }
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Available Exercises</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {Object.entries(exercies).map(([index, questNode]) => (
              <Link
                to="/piscines/$name/$id"
                params={{ name, id: String(questNode.id) }}
                key={index}
              >
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton tooltip={questNode.name}>
                    {questNode.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

function PiscineSidebar1({ name, piscine }: { name: string; piscine: Node }) {
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
      {Object.entries(quests).map(([index, questNode]) => {
        const childNodes = getSortedChildren(questNode);

        if (childNodes.length === 0) {
          return (
            <SidebarGroup key={index}>
              <SidebarGroupContent>
                <SidebarMenu>
                  <Link
                    to="/piscines/$name/$id"
                    params={{ name, id: String(questNode.id) }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip={questNode.name}>
                        {questNode.name}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </Link>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        }

        return (
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
                    {childNodes.map((childNode, childIndex) => (
                      <Link
                        to="/piscines/$name/$id"
                        params={{ name, id: String(childNode.id) }}
                        key={childIndex}
                      >
                        <SidebarMenuItem>
                          <SidebarMenuButton tooltip={childNode.name}>
                            {childNode.name}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </Link>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        );
      })}
    </SidebarContent>
  );
}
