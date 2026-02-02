import fs from "node:fs";

const THRUM_ZONE_START = "<!-- thrum-zone:start -->";
const THRUM_ZONE_END = "<!-- thrum-zone:end -->";

function snippetStartTag(snippetId: string): string {
  return `<!-- thrum:${snippetId}:start -->`;
}

function snippetEndTag(snippetId: string): string {
  return `<!-- thrum:${snippetId}:end -->`;
}

export function readHeartbeat(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Heartbeat file not found at ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf-8");
}

export function writeHeartbeat(filePath: string, content: string): void {
  if (fs.existsSync(filePath)) {
    const backup = filePath + ".bak";
    fs.copyFileSync(filePath, backup);
  }
  fs.writeFileSync(filePath, content, "utf-8");
}

export function parseInstalledSnippets(
  content: string
): { id: string; content: string }[] {
  const regex =
    /<!-- thrum:([^:]+):start -->\n([\s\S]*?)<!-- thrum:\1:end -->/g;
  const snippets: { id: string; content: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    snippets.push({
      id: match[1],
      content: match[2].trim(),
    });
  }

  return snippets;
}

export function hasSnippet(content: string, snippetId: string): boolean {
  return (
    content.includes(snippetStartTag(snippetId)) &&
    content.includes(snippetEndTag(snippetId))
  );
}

export function addSnippetBlock(
  content: string,
  snippetId: string,
  snippetContent: string
): string {
  const block = `${snippetStartTag(snippetId)}\n${snippetContent}\n${snippetEndTag(snippetId)}`;
  return content.replace(
    THRUM_ZONE_END,
    `${block}\n${THRUM_ZONE_END}`
  );
}

export function removeSnippetBlock(
  content: string,
  snippetId: string
): string {
  const startTag = snippetStartTag(snippetId);
  const endTag = snippetEndTag(snippetId);
  const regex = new RegExp(
    `${escapeRegex(startTag)}\\n[\\s\\S]*?${escapeRegex(endTag)}\\n?`,
    "g"
  );
  return content.replace(regex, "");
}

export function hasValidThrumZone(content: string): boolean {
  return content.includes(THRUM_ZONE_START) && content.includes(THRUM_ZONE_END);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
