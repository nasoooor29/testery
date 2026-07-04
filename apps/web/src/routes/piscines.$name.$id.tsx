import { exerciesMap } from "@/data/data";
import { NeededAttrs } from "@/schemas/bh";
import { getMarkdown, getRealMarkdownPath } from "@/utils/piscine";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardTitle } from "@testery/ui/components/card";
import { Button } from "@testery/ui/components/button";
import { ArrowLeft } from "lucide-react";
import CodeTester from "@/components/code-tester";
import { Md } from "@/components/render-markdown";

export const Route = createFileRoute("/piscines/$name/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { name, id } = Route.useParams();

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

      {/* Hello "/piscines/{name}/{id}"!
      <div>Markdown Path: {markdownPath}</div>
      <div className="flex gap-4">
        <Card>
          <CardContent>
            <article className="prose dark:prose-invert max-w-full">
              <div
                dangerouslySetInnerHTML={{
                  __html: processor.processSync(md.data).toString(),
                }}
              />
            </article>
          </CardContent>
        </Card>
        <Card className="h-[75vh] fixed right-10 w-[25vw] overflow-y-auto">
          <CardContent></CardContent>
        </Card>
      </div>
      {/* <div>
        <pre>{JSON.stringify(exercies, null, 2)}</pre>
      </div> */}
    </div>
  );
}
