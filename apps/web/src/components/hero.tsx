import { PiscineSummary } from "@/utils/piscine";
import { Card } from "@testery/ui/components/card";
import { Layers2 } from "lucide-react";

export function Hero({
  availablePiscines,
}: {
  availablePiscines: PiscineSummary[];
}) {
  return (
    <Card className="overflow-hidden border">
      <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 border px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            <Layers2 className="size-3.5" />
            Piscine Directory
          </div>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Browse every available piscine in one clean overview.
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              The index page now focuses on the catalogue itself, with a quick
              visual summary for each piscine instead of the backend status
              block.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="border p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
              Piscines
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {availablePiscines.length}
            </p>
          </div>
          <div className="border p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
              Quests
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {availablePiscines.reduce(
                (sum, piscine) => sum + piscine.questCount,
                0,
              )}
            </p>
          </div>
          <div className="border p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
              Exercises
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {availablePiscines.reduce(
                (sum, piscine) => sum + piscine.exerciseCount,
                0,
              )}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
