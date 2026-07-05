import { useMutation } from "@tanstack/react-query";
import { Button } from "@testery/ui/components/button";
import { Card } from "@testery/ui/components/card";
import { Badge } from "@testery/ui/components/badge";
import { Separator } from "@testery/ui/components/separator";
import { Clock, Copy, Loader2, Play, RefreshCw, Terminal } from "lucide-react";
import { useState } from "react";
import { orpc } from "@/utils/orpc";
import { Node } from "@/schemas/bh";
import { toast } from "sonner";
import { ORPCError } from "@orpc/client";
import { DockerRunResponse } from "@testery/api/utils/docker";

interface Props {
  exercies: Node;
  piscineName: string;
}

const testerProcedures = {
  "Rust Piscine": orpc.tester.rust,
  "JS Piscine": orpc.tester.js,
  "Scripting Piscine": orpc.tester.script,
  "BH Piscine": orpc.tester.bh,
} as const;

type TestedPiscine = keyof typeof testerProcedures;

function getTestedPiscine(piscineName: string): TestedPiscine | null {
  return piscineName in testerProcedures
    ? (piscineName as TestedPiscine)
    : null;
}

function CodeTester({ exercies, piscineName }: Props) {
  const [testOutput, setTestOutput] = useState("");
  const testedPiscine = getTestedPiscine(piscineName);

  const mutationOptions = testedPiscine
    ? testerProcedures[testedPiscine].mutationOptions({
        onError: (e) => {
          const errData = (e as ORPCError<"BAD_REQUEST", DockerRunResponse>)
            .data;
          console.error(e);
          setTestOutput(
            errData.output || "An error occurred while running tests",
          );
          toast.error(errData.error || "An error occurred while running tests");
        },
        onSuccess: (data) => {
          toast.success("Tests completed successfully");
          setTestOutput(data.output || "No output from tests");
        },
      })
    : {
        mutationFn: async (_input: { name: string }) => {
          throw new Error("No tester implemented for this exercise language");
        },
        onError: (e: Error) => {
          setTestOutput(e.message);
          toast.error(e.message);
        },
      };

  const runResult = useMutation(mutationOptions);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(testOutput);
  };

  const clearOutput = () => {
    setTestOutput("");
  };
  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-24 overflow-hidden border shadow-md">
        <div className="flex items-center justify-between bg-muted/50 p-4">
          <div className="flex items-center">
            <Terminal className="mr-2 h-5 w-5" />
            <h3 className="font-medium">Test Runner</h3>
          </div>
          {(runResult.isPending ||
            runResult.isSuccess ||
            runResult.isError) && (
            <Badge
              variant={
                runResult.status === "pending"
                  ? "outline"
                  : runResult.status === "success"
                    ? "default"
                    : "destructive"
              }
              className="px-2 py-0"
            >
              {runResult.status === "pending" && "Running"}
              {runResult.status === "success" && "Passed"}
              {runResult.status === "error" && "Failed"}
            </Badge>
          )}
        </div>

        <Separator />

        <div className="p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                console.log("Running tests for exercise:", exercies);
                runResult.mutate({ name: exercies.name });
              }}
              disabled={runResult.isPending || !testedPiscine}
              className="flex-1 enabled:cursor-pointer"
            >
              {runResult.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Tests
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={clearOutput}
              disabled={runResult.isPending || testOutput === ""}
              title="Clear output"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              disabled={testOutput === ""}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <div
              className={`${runResult.isError ? "text-red-400" : "text-green-400"}
                        bg-opacity-30 h-100 overflow-auto
                          bg-black p-4
                          font-mono text-xs
                      text-green-400`}
            >
              {testOutput ? (
                <pre className="whitespace-pre-wrap">{testOutput}</pre>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>Run tests to see output here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CodeTester;
