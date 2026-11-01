// src/engine.ts

import "server-only";

import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";

enum Service {
  X = "X",
  LinkedIn = "LinkedIn",
}

enum Stage {
  Awareness = "Awareness",
  Interest = "Interest",
  Consideration = "Consideration",
  Conversion = "Conversion",
  Retention = "Retention",
  Advocacy = "Advocacy",
}

const FILE_REFERENCE = /<([^<>]*?\.md)(?:\/(#{1,6}[^<>/\r\n]*))?>/g;

export class Engine {
  private readonly logic: string;

  private constructor(logic: string) {
    this.logic = logic;
  }

  public static async create(
    rawEngineLogic: string,
    rootDirectory: string = process.cwd(),
  ): Promise<Engine> {
    const logic = await Engine.expandReferences(
      rawEngineLogic,
      resolve(rootDirectory),
    );

    return new Engine(logic);
  }

  private static async expandReferences(
    text: string,
    rootDirectory: string,
    referenceStack: string[] = [],
  ): Promise<string> {
    const matches = Array.from(text.matchAll(FILE_REFERENCE));

    if (matches.length === 0) {
      return text;
    }

    let result = "";
    let cursor = 0;

    for (const match of matches) {
      const [reference, relativePath, heading] = match;
      const index = match.index;

      result += text.slice(cursor, index);

      const filePath = resolve(rootDirectory, relativePath);
      const pathFromRoot = relative(rootDirectory, filePath);

      // Prevent references from escaping the project directory.
      if (
        pathFromRoot === ".." ||
        pathFromRoot.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) ||
        isAbsolute(pathFromRoot)
      ) {
        throw new Error(`File reference escapes project root: ${relativePath}`);
      }

      // Prevent circular references.
      if (referenceStack.includes(filePath)) {
        throw new Error(
          `Circular file reference detected: ${[
            ...referenceStack,
            filePath,
          ].join(" -> ")}`,
        );
      }

      let fileContents: string;

      try {
        fileContents = await readFile(filePath, "utf8");
      } catch (error) {
        throw new Error(
          `Unable to read referenced file "${relativePath}": ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }

      // If a heading was specified, include only that section.
      if (heading) {
        fileContents = Engine.extractHeading(fileContents, heading);
      }

      // Expand any file references inside the included file.
      const expandedContents = await Engine.expandReferences(
        fileContents,
        rootDirectory,
        [...referenceStack, filePath],
      );

      result += expandedContents;
      cursor = index + reference.length;
    }

    result += text.slice(cursor);

    return result;
  }

  private static extractHeading(
    markdown: string,
    headingReference: string,
  ): string {
    const requestedLevel = headingReference.match(/^#+/)?.[0].length;

    if (!requestedLevel) {
      throw new Error(`Invalid heading reference: ${headingReference}`);
    }

    const requestedTitle = headingReference
      .slice(requestedLevel)
      .trim()
      .toLowerCase();

    const lines = markdown.split(/\r?\n/);

    const headingPattern = /^(#{1,6})\s+(.+?)\s*#*\s*$/;

    const startIndex = lines.findIndex((line) => {
      const match = line.match(headingPattern);

      return (
        match?.[1].length === requestedLevel &&
        match[2].trim().toLowerCase() === requestedTitle
      );
    });

    if (startIndex === -1) {
      throw new Error(`Heading not found: ${headingReference}`);
    }

    let endIndex = lines.length;

    for (let i = startIndex + 1; i < lines.length; i++) {
      const match = lines[i].match(headingPattern);

      if (match && match[1].length <= requestedLevel) {
        endIndex = i;
        break;
      }
    }

    return lines.slice(startIndex, endIndex).join("\n");
  }

  public getLogic(): string {
    return this.logic;
  }

  public getLinkedIn(): string {
    return this.logic;
  }

  public getX(): string {
    return this.logic;
  }

}
