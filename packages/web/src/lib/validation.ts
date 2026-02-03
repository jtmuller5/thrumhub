import { SNIPPET_FREQUENCIES, SNIPPET_CATEGORIES } from "@thrumhub/shared";
import type { SnippetFrequency, SnippetCategory } from "@thrumhub/shared";

const SNIPPET_ID_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
const MAX_ID_LENGTH = 64;
const MIN_ID_LENGTH = 2;
const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_WEBSITE_LENGTH = 500;
const MAX_CONTENT_LENGTH = 50_000;
const MAX_VARIABLES = 20;
const MAX_PLACEHOLDER_LENGTH = 64;
const MAX_PROMPT_TEXT_LENGTH = 200;

export function validateSnippetId(id: unknown): string | null {
  if (typeof id !== "string") return "id must be a string";
  if (id.length < MIN_ID_LENGTH || id.length > MAX_ID_LENGTH)
    return `id must be between ${MIN_ID_LENGTH} and ${MAX_ID_LENGTH} characters`;
  if (!SNIPPET_ID_REGEX.test(id))
    return "id must contain only lowercase letters, numbers, and hyphens, and must start and end with a letter or number";
  return null;
}

export function validateFrequency(value: unknown): value is SnippetFrequency {
  return typeof value === "string" && (SNIPPET_FREQUENCIES as readonly string[]).includes(value);
}

export function validateCategory(value: unknown): value is SnippetCategory {
  return typeof value === "string" && (SNIPPET_CATEGORIES as readonly string[]).includes(value);
}

export function validateSnippetBody(body: Record<string, unknown>, requireId: boolean): string | null {
  if (requireId) {
    const idError = validateSnippetId(body.id);
    if (idError) return idError;
  }

  const { name, content, frequency, category, description, website, variables } = body;

  if (typeof name !== "string" || name.trim().length === 0)
    return "name is required";
  if (name.length > MAX_NAME_LENGTH)
    return `name must be at most ${MAX_NAME_LENGTH} characters`;

  if (typeof content !== "string" || content.trim().length === 0)
    return "content is required";
  if (content.length > MAX_CONTENT_LENGTH)
    return `content must be at most ${MAX_CONTENT_LENGTH} characters`;

  if (!validateFrequency(frequency))
    return `frequency must be one of: ${SNIPPET_FREQUENCIES.join(", ")}`;

  if (!validateCategory(category))
    return `category must be one of: ${SNIPPET_CATEGORIES.join(", ")}`;

  if (description !== undefined && description !== null) {
    if (typeof description !== "string")
      return "description must be a string";
    if (description.length > MAX_DESCRIPTION_LENGTH)
      return `description must be at most ${MAX_DESCRIPTION_LENGTH} characters`;
  }

  if (website !== undefined && website !== null) {
    if (typeof website !== "string")
      return "website must be a string";
    if (website.length > MAX_WEBSITE_LENGTH)
      return `website must be at most ${MAX_WEBSITE_LENGTH} characters`;
  }

  if (variables !== undefined && variables !== null) {
    if (!Array.isArray(variables))
      return "variables must be an array";
    if (variables.length > MAX_VARIABLES)
      return `variables must have at most ${MAX_VARIABLES} entries`;
    for (const v of variables) {
      if (typeof v.placeholder !== "string" || v.placeholder.trim().length === 0)
        return "each variable must have a placeholder";
      if (v.placeholder.length > MAX_PLACEHOLDER_LENGTH)
        return `placeholder must be at most ${MAX_PLACEHOLDER_LENGTH} characters`;
      if (typeof v.prompt_text !== "string" || v.prompt_text.trim().length === 0)
        return "each variable must have a prompt_text";
      if (v.prompt_text.length > MAX_PROMPT_TEXT_LENGTH)
        return `prompt_text must be at most ${MAX_PROMPT_TEXT_LENGTH} characters`;
    }
  }

  return null;
}
