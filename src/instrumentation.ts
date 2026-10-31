import * as fs from "fs/promises";

export async function register() {
  let rawEngineLogic: string;
  try {
    const engineLogicLocation = "./logic";
    rawEngineLogic = await fs.readFile(engineLogicLocation + "/README.md", {
      encoding: "utf8",
    });

    globalThis.engineText = rawEngineLogic;
  } catch (error: any) {
    console.error("Error reading file:", error);
  }

  /*
  const engine = Engine();
  */
}
