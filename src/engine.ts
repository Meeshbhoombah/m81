// src/engine.ts

import "server-only";

import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

const FILE_REFERENCE = /<([^<>]*?\.md)(?:\/(#{1,6}[^<>/\r\n]*))?>/g;

export class Engine {
  private constructor(
    private readonly logic: string,
  ) {}

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

      if (
        pathFromRoot === ".." ||
        pathFromRoot.startsWith(`..${sep}`) ||
        isAbsolute(pathFromRoot)
      ) {
        throw new Error(
          `File reference escapes project root: ${relativePath}`,
        );
      }

      if (referenceStack.includes(filePath)) {
        throw new Error(
          `Circular file reference detected: ${relativePath}`,
        );
      }

      let fileContents: string;

      try {
        fileContents = await readFile(filePath, "utf8");
      } catch (error) {
        throw new Error(
          `Unable to read "${relativePath}": ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }

      if (heading) {
        fileContents = Engine.extractHeading(fileContents, heading);
      }

      // Resolve references inside the included file.
      const expandedContents = await Engine.expandReferences(
        fileContents,
        rootDirectory,
        [...referenceStack, filePath],
      );

      // Determine whether the reference is already inside a string.
      const insideString = Engine.isInsideString(text, index);

      // Escape the contents so they can safely exist inside a string.
      const escapedContents = insideString
        ? JSON.stringify(expandedContents).slice(1, -1)
        : JSON.stringify(expandedContents);

      result += escapedContents;
      cursor = index + reference.length;
    }

    result += text.slice(cursor);

    return result;
  }

  private static isInsideString(text: string, index: number): boolean {
    let insideString = false;
    let escaped = false;

    for (let i = 0; i < index; i++) {
      const character = text[i];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (character === "\\") {
        escaped = true;
        continue;
      }

      if (character === '"') {
        insideString = !insideString;
      }
    }

    return insideString;
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
}
