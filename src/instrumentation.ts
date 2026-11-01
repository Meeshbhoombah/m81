// src/instrumentation.ts

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { Engine } from "@/engine";

export async function register() {
  const logicPath = join(process.cwd(), "logic", "README.md");

  const rawEngineLogic = await readFile(logicPath, "utf8");

  const engine = await Engine.create(rawEngineLogic);

  console.log(engine.getLogic());
}
