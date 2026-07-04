import { PiscineSummary } from "@/utils/piscine";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@testery/ui/components/card";
import { BookOpen, Boxes } from "lucide-react";

export function PiscineCard({ piscine }: { piscine: PiscineSummary }) {
  return (
    <Card
      key={piscine.name}
      className="border bg-card/90 transition-transform duration-200 hover:-translate-y-1"
    >
      <CardHeader>
        <CardTitle className="text-base">{piscine.name}</CardTitle>
        <CardDescription>
          A quick snapshot of the available content inside this piscine.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="border p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="size-4" />
              <span>Quests</span>
            </div>
            <p className="mt-3 text-2xl font-semibold">{piscine.questCount}</p>
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
        </div>
      </CardContent>
      <CardFooter className="justify-between text-xs text-muted-foreground">
        <span>Available now</span>
        <span>{piscine.questCount + piscine.exerciseCount} total items</span>
      </CardFooter>
    </Card>
  );
}
