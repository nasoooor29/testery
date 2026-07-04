import { exerciesMap } from "@/data/data";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardTitle } from "@testery/ui/components/card";
import CodeTester from "@/components/code-tester";
import { Md } from "@/components/render-markdown";

export const Route = createFileRoute("/piscines/$name/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const exercies = exerciesMap.get(Number(id));
  if (!exercies) {
    return <div>Exercise not found</div>;
  }

  return (
    <div className="p-4">
      <div className="min-h-screen bg-linear-to-b from-background to-background/80 pb-12">
        <div className="container mx-auto px-4">
          {/* Main content */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="overflow-hidden border shadow-md lg:col-span-2 py-0">
              <CardTitle className="py-0" />
              <Md exercies={exercies} />
            </Card>

            {/* Test card */}
            <CodeTester />
          </div>
        </div>
      </div>
    </div>
  );
}
