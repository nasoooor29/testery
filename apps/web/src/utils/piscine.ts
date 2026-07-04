import { exerciesMap } from "@/data/data";
import { NeededAttrs, type Node } from "@/schemas/bh";

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
type PathRule = {
  when?: (exercisePath: string) => boolean;
  from: string;
  to: string;
};

const pathRules: PathRule[] = [
  {
    when: (path) => path.includes("ai-forge"),
    from: "/api/content/root/01-edu_ai-starter/content/",
    to: `${BASE_MD_PATH}/AI.GO/`,
  },
  {
    when: (path) => path.includes("blockchain"),
    from: "/api/content/root/01-edu_module/content/",
    to: `${BASE_MD_PATH}/blockchain/`,
  },
  {
    when: (path) => path.includes("piscine-scripting"),
    from: "/api/content/root/01-edu_module/content/",
    to: `${BASE_MD_PATH}/devops/`,
  },
  {
    from: "/markdown/root/public/subjects/",
    to: `${BASE_MD_PATH}/`,
  },
  {
    from: "/api/content/root/01-edu_module/content/",
    to: `${BASE_MD_PATH}/`,
  },
  {
    from: "/api/content/root/01-edu_imperative-piscine/content/",
    to: `${BASE_MD_PATH}/`,
  },
  {
    from: "/markdown/root/01-edu_module/content/",
    to: `${BASE_MD_PATH}/`,
  },
];

export function getRealMarkdownPath(id: number) {
  const exercise = exerciesMap.get(id);
  if (!exercise?.path) return null;

  const parsed = NeededAttrs.safeParse(exercise.attrs);
  if (!parsed.success || !parsed.data.subject) return null;

  const { subject } = parsed.data;

  for (const rule of pathRules) {
    if (rule.when && !rule.when(exercise.path)) continue;
    if (!subject.startsWith(rule.from)) continue;

    return subject.replace(rule.from, rule.to);
  }

  return subject;
}

async function fetchMarkdownContent(path: string) {
  const BASE_URL = window.location.origin;
  const res = await fetch(`${BASE_URL}/${path}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch markdown from ${path}`);
  }
  return res.text();
}
export async function getMarkdown(id: number) {
  const allPPs = [
    getRealMarkdownPath(id),
    getRealMarkdownPath(id)?.replaceAll("-", "_"),
  ];
  return Promise.any(
    allPPs.map((path) => {
      if (!path) {
        return Promise.reject(new Error("Invalid path"));
      }
      return fetchMarkdownContent(path);
    }),
  );
}
