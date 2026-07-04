import jj from "./data/bh.json";

import { NodeSchema } from "./schemas/bh";

const a1 = NodeSchema.parse(jj);
console.log("a1", a1);
