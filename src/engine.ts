// src/engine.ts

import "server-only";

import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

const FILE_REFERENCE = /<([^<>]*?\.md)(?:\/(#{1,6}[^<>/\r\n]*))?>/g;

type SectionField = "instructions" | "about";

type InstructionNode = {
  instructions?: string;
  about?: string;
  [key: string]: InstructionNode | string | undefined;
};

type MarkdownSection = {
  level: number;
  path: string[];
  node: InstructionNode;
  lines: string[];
  field: SectionField;
};

export class Engine {
  private constructor(
    private readonly logic: string,
    private readonly instructions: InstructionNode,
  ) {}

  public static async create(
    rawEngineLogic: string,
    rootDirectory: string = process.cwd(),
  ): Promise<Engine> {
    const instructions = Engine.extractInstructions(rawEngineLogic);

    const logic = await Engine.expandReferences(rawEngineLogic, resolve(rootDirectory));

    return new Engine(logic, instructions);
  }

  private static extractInstructions(markdown: string): InstructionNode {
    const root: InstructionNode = {};
    const stack: MarkdownSection[] = [];

    let insideCodeBlock = false;
    let codeFence = "";
    let codeFenceLength = 0;

    const lines = markdown.split(/\r?\n/);

    for (const line of lines) {
      const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);

      if (fenceMatch) {
        const fence = fenceMatch[1];

        if (!insideCodeBlock) {
          insideCodeBlock = true;
          codeFence = fence[0];
          codeFenceLength = fence.length;
        } else if (fence[0] === codeFence && fence.length >= codeFenceLength) {
          insideCodeBlock = false;
          codeFence = "";
          codeFenceLength = 0;
        }

        continue;
      }

      if (insideCodeBlock) {
        continue;
      }

      const headingMatch = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);

      if (headingMatch) {
        const level = headingMatch[1].length;
        const title = headingMatch[2].trim();

        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
          const section = stack.pop();

          if (section) {
            Engine.saveInstructions(section);
          }
        }

        // Treat the document title as the root.
        if (level === 1 && title.toLowerCase() === "logic") {
          continue;
        }

        const parent = stack.length > 0 ? stack[stack.length - 1].node : root;

        const parentPath = stack.length > 0 ? stack[stack.length - 1].path : [];

        const key = Engine.normalizeKey(title);
        const path = [...parentPath, key];

        const existing = parent[key];

        if (typeof existing === "string") {
          throw new Error(`Instruction key conflicts with a string: ${key}`);
        }

        const field = Engine.getSectionField(path);

        // Insert the descriptive field first.
        const node: InstructionNode = existing ?? {
          [field]: "",
        };

        if (!existing) {
          parent[key] = node;
        } else if (!(field in node)) {
          node[field] = "";
        }

        stack.push({
          level,
          path,
          node,
          lines: [],
          field,
        });

        continue;
      }

      if (stack.length === 0) {
        continue;
      }

      // Blockquotes are notes/references, not instructions.
      if (/^\s*>/.test(line)) {
        continue;
      }

      stack[stack.length - 1].lines.push(line);
    }

    while (stack.length > 0) {
      const section = stack.pop();

      if (section) {
        Engine.saveInstructions(section);
      }
    }

    return root;
  }

  private static getSectionField(path: string[]): SectionField {
    return path[0] === "automations" ? "about" : "instructions";
  }

  private static saveInstructions(section: MarkdownSection): void {
    const content = section.lines.join("\n").trim();

    if (content.length === 0) {
      delete section.node[section.field];
      return;
    }

    section.node[section.field] = content;
  }

  private static normalizeKey(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
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
        throw new Error(`File reference escapes project root: ${relativePath}`);
      }

      if (referenceStack.includes(filePath)) {
        throw new Error(`Circular file reference detected: ${relativePath}`);
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
      const expandedContents = await Engine.expandReferences(fileContents, rootDirectory, [
        ...referenceStack,
        filePath,
      ]);

      // Determine whether the reference is already inside a string.
      const insideString = Engine.isInsideString(text, index);

      // Escape contents so they can safely exist inside a string.
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

  private static extractHeading(markdown: string, headingReference: string): string {
    const requestedLevel = headingReference.match(/^#+/)?.[0].length;

    if (!requestedLevel) {
      throw new Error(`Invalid heading reference: ${headingReference}`);
    }

    const requestedTitle = headingReference.slice(requestedLevel).trim().toLowerCase();

    const lines = markdown.split(/\r?\n/);
    const headingPattern = /^(#{1,6})\s+(.+?)\s*#*\s*$/;

    const startIndex = lines.findIndex((line) => {
      const match = line.match(headingPattern);

      return (
        match?.[1].length === requestedLevel && match[2].trim().toLowerCase() === requestedTitle
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

  public getInstructions(): InstructionNode {
    return this.instructions;
  }

  public getInstructionsJSON(): string {
    return JSON.stringify(this.instructions, null, 4);
  }
}
