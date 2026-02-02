import type {
  Snippet,
  SnippetWithVariables,
  SnippetVariable,
  User,
  SnippetCategory,
  SnippetFrequency,
} from "@thrumhub/shared";
import { getDb } from "./db";

export async function getSnippets(params?: {
  category?: SnippetCategory;
  frequency?: SnippetFrequency;
}): Promise<Snippet[]> {
  const sql = getDb();

  if (params?.category && params?.frequency) {
    const rows = await sql`
      SELECT s.*, u.username as author_username
      FROM snippets s
      LEFT JOIN users u ON u.id = s.author_id
      WHERE s.category = ${params.category} AND s.frequency = ${params.frequency}
      ORDER BY s.created_at DESC
    `;
    return rows as unknown as Snippet[];
  }

  if (params?.category) {
    const rows = await sql`
      SELECT s.*, u.username as author_username
      FROM snippets s
      LEFT JOIN users u ON u.id = s.author_id
      WHERE s.category = ${params.category}
      ORDER BY s.created_at DESC
    `;
    return rows as unknown as Snippet[];
  }

  if (params?.frequency) {
    const rows = await sql`
      SELECT s.*, u.username as author_username
      FROM snippets s
      LEFT JOIN users u ON u.id = s.author_id
      WHERE s.frequency = ${params.frequency}
      ORDER BY s.created_at DESC
    `;
    return rows as unknown as Snippet[];
  }

  const rows = await sql`
    SELECT s.*, u.username as author_username
    FROM snippets s
    LEFT JOIN users u ON u.id = s.author_id
    ORDER BY s.created_at DESC
  `;
  return rows as unknown as Snippet[];
}

export async function searchSnippets(query: string): Promise<Snippet[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT s.*, u.username as author_username
    FROM snippets s
    LEFT JOIN users u ON u.id = s.author_id
    WHERE to_tsvector('english', s.name || ' ' || s.content) @@ plainto_tsquery('english', ${query})
    ORDER BY ts_rank(to_tsvector('english', s.name || ' ' || s.content), plainto_tsquery('english', ${query})) DESC
  `;
  return rows as unknown as Snippet[];
}

export async function getSnippetById(
  id: string
): Promise<SnippetWithVariables | null> {
  const sql = getDb();

  const snippetRows = await sql`
    SELECT s.*
    FROM snippets s
    WHERE s.id = ${id}
  `;

  if (snippetRows.length === 0) return null;

  const snippet = snippetRows[0] as unknown as Snippet;

  const variableRows = await sql`
    SELECT * FROM snippet_variables WHERE snippet_id = ${id} ORDER BY id
  `;

  const authorRows = await sql`
    SELECT * FROM users WHERE id = ${snippet.author_id}
  `;

  return {
    ...snippet,
    variables: variableRows as unknown as SnippetVariable[],
    author: authorRows.length > 0 ? (authorRows[0] as unknown as User) : undefined,
  };
}

export async function createSnippet(data: {
  id: string;
  name: string;
  content: string;
  frequency: SnippetFrequency;
  category: SnippetCategory;
  author_id: number;
  variables?: { placeholder: string; prompt_text: string }[];
}): Promise<Snippet> {
  const sql = getDb();

  const rows = await sql`
    INSERT INTO snippets (id, name, content, frequency, category, author_id)
    VALUES (${data.id}, ${data.name}, ${data.content}, ${data.frequency}, ${data.category}, ${data.author_id})
    RETURNING *
  `;

  const snippet = rows[0] as unknown as Snippet;

  if (data.variables && data.variables.length > 0) {
    for (const v of data.variables) {
      await sql`
        INSERT INTO snippet_variables (snippet_id, placeholder, prompt_text)
        VALUES (${data.id}, ${v.placeholder}, ${v.prompt_text})
      `;
    }
  }

  return snippet;
}

export async function getUserByGithubId(
  githubId: number
): Promise<User | null> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM users WHERE github_id = ${githubId}`;
  if (rows.length === 0) return null;
  return rows[0] as unknown as User;
}

export async function getSnippetsByAuthor(
  authorId: number
): Promise<Snippet[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM snippets WHERE author_id = ${authorId} ORDER BY created_at DESC
  `;
  return rows as unknown as Snippet[];
}
