import { piscines } from "@/data/data";
import { GenericAttrs, NeededAttrs, Node, NodeSchema } from "@/schemas/bh";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/piscines/$name/")({
  component: RouteComponent,
});

function getSortedChildren(node: Node) {
  return Object.values(node.children ?? {}).sort(
    (left, right) =>
      (left.index ?? Number.MAX_SAFE_INTEGER) -
      (right.index ?? Number.MAX_SAFE_INTEGER),
  );
}

export function getAttrs(attrs: unknown) {
  const neededAttrs = NeededAttrs.safeParse(attrs);
  if (neededAttrs.success) {
    return {
      type: "needed" as const,
      schema: NeededAttrs,
      data: neededAttrs.data,
    };
  }

  return {
    type: "generic" as const,
    schema: GenericAttrs,
    data: GenericAttrs.parse(attrs),
  };
}

function NodeList({ nodes }: { nodes: Node[] }) {
  return (
    <ul className="space-y-2">
      {nodes.map((node) => {
        const children = getSortedChildren(node);
        const { type, data } = getAttrs(node.attrs);
        console.log("Node", node.name, "has type", type, "with data", data);
        if (type !== "needed") {
          console.warn(`Node ${node.name} has unexpected attrs:`, node.attrs);
          return;
        }

        return (
          <li
            key={`${node.path ?? node.key ?? node.name}-${data.level ?? "node"}`}
          >
            <div className="text-sm font-medium">
              {node.name}
              {data.level !== null ? ` - Level ${data.level}` : ""}
              {data.difficulty !== null ? ` - ${data.difficulty}` : ""}
            </div>

            {children.length > 0 ? (
              <div className="mt-2 border-l pl-4">
                <NodeList nodes={children} />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function RouteComponent() {
  const { name } = Route.useParams();
  const piscine = piscines[name as keyof typeof piscines];

  if (!piscine) {
    return <div>Piscine not found</div>;
  }

  const typedPiscine = NodeSchema.parse(piscine);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-muted-foreground text-sm">{typedPiscine.name}</p>
      </div>

      <NodeList nodes={getSortedChildren(typedPiscine)} />
    </div>
  );
}
