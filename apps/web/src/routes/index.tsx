import { createFileRoute } from "@tanstack/react-router";

import { piscines, testerProcedures } from "@/data/data";
import { Hero } from "@/components/hero";
import { PiscineCard } from "@/components/piscine-card";
import { collectSummary } from "@/utils/piscine";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const availablePiscines = Object.entries(piscines).map(([name, node]) =>
    collectSummary(name, node),
  );

  return (
    <div className="min-h-full">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Hero availablePiscines={availablePiscines} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {availablePiscines.map((piscine) => {
            const haveTester = Object.keys(testerProcedures).includes(
              piscine.name,
            );
            const zeroed =
              piscine.questCount === 0 && piscine.exerciseCount === 0;
            const depthMoreThan2 = piscine.deepestQuestDepth >= 2;
            let reason = "";
            if (!haveTester) {
              reason = "NO";
            } else if (zeroed) {
              reason = "This piscine has no quests or exercises.";
            }
            const isDisabled = !haveTester || zeroed || depthMoreThan2;
            return (
              <PiscineCard
                key={piscine.name}
                piscine={piscine}
                isDisabled={isDisabled}
                disableReason={reason}
              />
            );
          })}
        </section>
      </div>
    </div>
  );
}
