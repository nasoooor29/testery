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

const BASE_MD_PATH = "01edu/subjects";
export function getRealMarkdownPath(path: string | undefined) {
  if (!path) {
    return "UNKNOWN";
  }
  console.log("getRealMarkdownPath", path);
  if (path.startsWith("/markdown/root/01-edu_module/content/")) {
    return path.replace(
      "/markdown/root/01-edu_module/content/",
      `${BASE_MD_PATH}/`,
    );
  }
  return path;
}
export async function getMarkdown(path: string | undefined) {
  const pp = getRealMarkdownPath(path).replaceAll("-", "_");

  const baseurl = window.location.origin;
  const res = await fetch(`${baseurl}/${pp}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch markdown from ${pp}`);
  }
  return res.text();
}
