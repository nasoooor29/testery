import type { Node } from "@/schemas/bh";

export function collectSummary(name: string, node: Node) {
  let questCount = 0;
  let exerciseCount = 0;
  let deepestQuestDepth = 0;

  const getDepthFromQuest = (current: Node): number => {
    const children = Object.values(current.children ?? {});

    if (children.length === 0) {
      return 0;
    }

    return 1 + Math.max(...children.map(getDepthFromQuest));
  };

  const visit = (current: Node) => {
    if (
      "parentType" in current.attrs &&
      current.attrs.parentType === "piscine"
    ) {
      questCount += 1;
      deepestQuestDepth = Math.max(
        deepestQuestDepth,
        getDepthFromQuest(current),
      );
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
    deepestQuestDepth,
  };
}

export type PiscineSummary = ReturnType<typeof collectSummary>;
export function getSortedChildren(node: Node) {
  return Object.values(node.children ?? {}).sort(
    (left, right) =>
      (left.index ?? Number.MAX_SAFE_INTEGER) -
      (right.index ?? Number.MAX_SAFE_INTEGER),
  );
}
