import { PiscineSummary } from "@/utils/piscine";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@testery/ui/components/card";
import { BookOpen, Boxes, Layers3 } from "lucide-react";

export function PiscineCard({ piscine }: { piscine: PiscineSummary }) {
  const zeroed = piscine.questCount === 0 && piscine.exerciseCount === 0;
  const depthMoreThan2 =
    piscine.deepestQuestDepth >= 2 || piscine.deepestQuestDepth === 0;
  const isDisabled = zeroed || depthMoreThan2;

  return (
    <Link
      to="/piscines/$name"
      disabled={isDisabled}
      params={{ name: piscine.name }}
    >
      <Card
        key={piscine.name}
        className={`border transition-transform duration-200 hover:-translate-y-1 ${isDisabled ? "opacity-50" : ""}`}
      >
        <CardHeader>
          <CardTitle className="text-base">{piscine.name}</CardTitle>
          <CardDescription>
            A quick snapshot of the available content inside this piscine.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="size-4" />
                <span>Quests</span>
              </div>
              <p className="mt-3 text-2xl font-semibold">
                {piscine.questCount}
              </p>
            </div>
            <div className="border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Boxes className="size-4" />
                <span>Exercises</span>
              </div>
              <p className="mt-3 text-2xl font-semibold">
                {piscine.exerciseCount}
              </p>
            </div>
            <div className="border p-3">
              <div className={`flex items-center gap-2 `}>
                <Layers3 className="size-4" />
                <span>Depth</span>
              </div>
              <p className="mt-3 text-2xl font-semibold">
                {piscine.deepestQuestDepth}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between text-xs text-muted-foreground">
          <span>Available now</span>
          <span>{piscine.questCount + piscine.exerciseCount} total items</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
