import { createFileRoute } from "@tanstack/react-router";

import { piscines } from "@/data/data";
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
    <div className="min-h-full bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Hero availablePiscines={availablePiscines} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {availablePiscines.map((piscine) => (
            <PiscineCard key={piscine.name} piscine={piscine} />
          ))}
        </section>
      </div>
    </div>
  );
}
