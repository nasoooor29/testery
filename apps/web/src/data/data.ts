import bh from "./bh.json";

export const piscines = {
  "BH Piscine": bh.children["bh-piscine"],
  "Rust Piscine": bh.children["bh-module"].children["piscine-rust"],
  "Java Piscine": bh.children["bh-module"].children["piscine-java"],
  "JS Piscine": bh.children["bh-module"].children["piscine-js"],
  "Flutter Piscine": bh.children["bh-module"].children["piscine-flutter"],
  "Main checkpoint": bh.children["bh-module"].children["checkpoint"],
  "UX Piscine": bh.children["bh-module"].children["piscine-ux"],
  "UI Piscine": bh.children["bh-module"].children["piscine-ui"],
  "Blockchain Piscine": bh.children["bh-module"].children["piscine-blockchain"],
  "Scripting Piscine": bh.children["bh-module"].children["piscine-scripting"],
  "Prompting Piscine": bh.children["bh-module"].children["prompt-piscine"],
  "AI Piscine": bh.children["bh-module"].children["piscine-ai"],
  "AI Forge Piscine": bh.children["ai-forge"],
};

export const avaliableTesters = {
  "ghcr.io/01-edu/imperative-piscine-sh": ["BH Piscine", "Scripting Piscine"],
  "ghcr.io/01-edu/test-sh": ["BH Piscine", "Scripting Piscine"],
  "ghcr.io/01-edu/test-go": ["BH Piscine", "Main checkpoint"],
  "ghcr.io/01-edu/test-dart": ["Flutter Piscine"],
  "ghcr.io/01-edu/module-blockchain": ["Blockchain Piscine"],
  "ghcr.io/01-edu/module-go": ["Main checkpoint", "BH Piscine"],
  "ghcr.io/01-edu/module-sh": ["BH Piscine", "Scripting Piscine"],
  "ghcr.io/01-edu/module-python": ["Scripting Piscine"],
  "ghcr.io/01-edu/module-rust": ["Rust Piscine"],
  "ghcr.io/01-edu/test-rust": ["Rust Piscine"],
  "ghcr.io/01-edu/test-java": ["Java Piscine"],
  "ghcr.io/01-edu/module-java": ["Java Piscine"],
  "ghcr.io/01-edu/test-js": ["JS Piscine"],
  "ghcr.io/01-edu/module-js": ["JS Piscine"],
  "ghcr.io/01-edu/test-dom": ["JS Piscine"],
  "ghcr.io/01-edu/ai-starter-dom": ["AI Piscine"],
  "ghcr.io/01-edu/ai-starter-js": ["AI Piscine"],
};
