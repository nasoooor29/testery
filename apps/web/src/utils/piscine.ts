import type { Node } from "@/schemas/bh";
export function collectSummary(name: string, node: Node) {
  let questCount = 0;
  let exerciseCount = 0;

  const visit = (current: Node) => {
    if (
      "parentType" in current.attrs &&
      current.attrs.parentType === "piscine"
    ) {
      questCount += 1;
    }

    if ("parentType" in current.attrs && current.attrs.parentType === "quest") {
      exerciseCount += 1;
    }

    Object.values(current.children ?? {}).forEach(visit);
  };

  visit(node);

  return {
    name,
    questCount,
    exerciseCount,
  };
}
export type PiscineSummary = ReturnType<typeof collectSummary>;
