import { z } from "zod";
const Validation = z.union([
  z.object({
    type: z.literal("tester"),
    testImage: z.string(),
    cooldown: z.number(),
  }),

  z.object({
    type: z.literal("user_audit"),
    delay: z.number(),
    required: z.number(),
  }),

  z.object({
    type: z.string(),
  }),
]);

export const QuestAttrs = z.object({
  campus: z.string(),
  expectedXp: z.number(),
  delay: z.number(),
  difficulty: z.number(),
  duration: z.number(),
  level: z.number(),
  parentType: z.literal("piscine"),
  rootPath: z.string(),
  startDay: z.number(),
  week: z.number(),
  branch: z.number(),
  xpIndex: z.number(),
  videos: z.string().optional(),
  scopeExtraDuration: z.number().optional(),
});

export const ExerciseAttrs = z.object({
  campus: z.string(),
  subject: z.string(),
  validations: z.array(Validation),
  baseXp: z.number(),
  category: z.string(),
  delay: z.number(),
  difficulty: z.number(),
  duration: z.number(),
  level: z.number(),
  parentType: z.literal("quest"),
  rootName: z.string(),
  rootPath: z.string(),
  xpIndex: z.number(),
  language: z.string(),
  expectedFiles: z.array(z.string()),
  allowedFunctions: z.array(z.string()).or(z.array(z.unknown())),
});
export const NeededAttrs = z.object({
  difficulty: z.number(),
  level: z.number(),
});

export const GenericAttrs = z.record(z.string(), z.unknown());

export const Attrs = z.union([
  QuestAttrs,
  ExerciseAttrs,
  NeededAttrs,
  GenericAttrs,
]);

export type Attrs = z.infer<typeof Attrs>;

export type Node = {
  id: number;
  name: string;
  type: string;
  attrs: Attrs;
  children?: Record<string, Node>;
  key?: string;
  path?: string;
  index?: number | null;
  formerVersions?: unknown[] | null;
  latestVersion?: unknown | null;
  replacedAt?: unknown | null;
  replacedBy?: unknown | null;
};

// we use z.lazy to allow for recursive types (children can contain more nodes)
export const NodeSchema: z.ZodType<Node> = z.lazy(() =>
  z.object({
    id: z.number(),
    name: z.string(),
    type: z.string(),
    attrs: Attrs,

    children: z.record(z.string(), NodeSchema).optional(),

    key: z.string().optional(),
    path: z.string().optional(),
    index: z.number().optional().nullable(),

    formerVersions: z.array(z.unknown()).optional(),
    latestVersion: z.unknown().nullable().optional(),
    replacedAt: z.unknown().nullable().optional(),
    replacedBy: z.unknown().nullable().optional(),
  }),
);

export const schema = NodeSchema;
