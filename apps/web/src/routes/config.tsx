import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { piscines, testerProcedures } from "@/data/data";
import { orpc } from "@/utils/orpc";
import { Badge } from "@testery/ui/components/badge";
import { Button } from "@testery/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@testery/ui/components/card";
import { Input } from "@testery/ui/components/input";
import { Label } from "@testery/ui/components/label";

export const Route = createFileRoute("/config")({
  component: ConfigComponent,
});

type PiscineName = keyof typeof piscines;
type ConfigForm = Record<PiscineName, string>;

const piscineNames = Object.keys(piscines) as PiscineName[];

function createEmptyConfig(): ConfigForm {
  return piscineNames.reduce((acc, name) => {
    acc[name] = "";
    return acc;
  }, {} as ConfigForm);
}

function ConfigComponent() {
  const [values, setValues] = useState<ConfigForm>(() => createEmptyConfig());
  const [isDirty, setIsDirty] = useState(false);
  const config = useQuery(orpc.conf.getConfig.queryOptions());

  const configuredCount = useMemo(
    () => piscineNames.filter((name) => values[name].trim() !== "").length,
    [values],
  );
  const validCount = useMemo(
    () =>
      piscineNames.filter(
        (name) =>
          config.data?.[name]?.repo.trim() !== "" &&
          config.data?.[name]?.notValidReason === undefined,
      ).length,
    [config.data],
  );

  useEffect(() => {
    if (!config.data || isDirty) {
      return;
    }

    const next = createEmptyConfig();
    for (const name of piscineNames) {
      next[name] = config.data[name]?.repo ?? "";
    }
    setValues(next);
  }, [config.data, isDirty]);

  const saveConfig = useMutation(
    orpc.conf.setConfig.mutationOptions({
      onError: (error) => {
        toast.error(error.message || "Failed to save config");
      },
      onSuccess: async () => {
        const refreshed = await config.refetch();
        if (refreshed.data) {
          const next = createEmptyConfig();
          for (const name of piscineNames) {
            next[name] = refreshed.data[name]?.repo ?? "";
          }
          setValues(next);
        }
        setIsDirty(false);
        toast.success("Config saved");
      },
    }),
  );

  function updateRepo(name: PiscineName, repo: string) {
    setValues((current) => ({ ...current, [name]: repo }));
    setIsDirty(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextConfig = piscineNames.reduce(
      (acc, name) => {
        acc[name] = { repo: values[name] ?? "" };
        return acc;
      },
      {} as Record<PiscineName, { repo: string }>,
    );

    saveConfig.mutate(nextConfig);
  }

  return (
    <main className="min-h-full bg-[radial-gradient(circle_at_top_left,hsl(var(--muted))_0,transparent_28rem)]">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8"
      >
        <section className="grid gap-4 lg:grid-cols-[1fr_22rem]">
          <Card className="border-foreground/15 bg-card/85">
            <CardHeader>
              <CardTitle className="text-2xl tracking-tight">
                Piscine Config
              </CardTitle>
              <CardDescription>
                Set the local repository folder for each piscine. This updates
                the project `config.json` for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="outline">{configuredCount} paths filled</Badge>
              <Badge variant="secondary">{validCount} valid repos</Badge>
              {isDirty && <Badge variant="outline">Unsaved changes</Badge>}
            </CardContent>
          </Card>

          <Card className="border-foreground/15 bg-card/85">
            <CardHeader>
              <CardTitle>Save Changes</CardTitle>
              <CardDescription>
                Validation runs after save, so missing folders will be marked
                below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                type="submit"
                className="w-full"
                disabled={saveConfig.isPending || config.isLoading || !isDirty}
              >
                {saveConfig.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save config
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-3">
          {piscineNames.map((name) => {
            const current = config.data?.[name];
            const hasTester = name in testerProcedures;
            const isValid =
              current?.repo.trim() !== "" &&
              current?.notValidReason === undefined;

            return (
              <Card key={name} className="border-foreground/10 bg-card/80">
                <CardContent className="grid gap-3 pt-0 md:grid-cols-[14rem_1fr_auto] md:items-center">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`repo-${name}`}>{name}</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {hasTester ? (
                        <Badge variant="secondary">tester ready</Badge>
                      ) : (
                        <Badge variant="outline">no tester</Badge>
                      )}
                      {isValid ? (
                        <Badge variant="default">valid</Badge>
                      ) : current?.notValidReason ? (
                        <Badge variant="destructive">
                          {current.notValidReason}
                        </Badge>
                      ) : (
                        <Badge variant="outline">not set</Badge>
                      )}
                    </div>
                  </div>

                  <Input
                    id={`repo-${name}`}
                    value={values[name]}
                    onChange={(event) => updateRepo(name, event.target.value)}
                    placeholder={`/home/you/repos/${name.toLowerCase().replaceAll(" ", "-")}`}
                    autoComplete="off"
                  />

                  <div className="flex items-center gap-2 text-xs text-muted-foreground md:justify-end">
                    {isValid ? (
                      <CheckCircle2 className="size-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="size-4 text-amber-500" />
                    )}
                    <span>{isValid ? "Ready" : "Needs path"}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </form>
    </main>
  );
}
