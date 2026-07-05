import { piscines } from "@/data/data";
import { NodeSchema } from "@/schemas/bh";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/piscines/$name/")({
  component: RouteComponent,
});

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
        <p>select the exercise you want from the sidebar</p>
      </div>
    </div>
  );
}
