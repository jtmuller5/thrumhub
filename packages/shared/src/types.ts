export interface User {
  id: number;
  github_id: number;
  username: string;
  avatar_url: string;
  created_at: string;
}

export interface Snippet {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  content: string;
  frequency: SnippetFrequency;
  category: SnippetCategory;
  author_id: number;
  created_at: string;
  updated_at: string;
  downloads: number;
}

export interface SnippetVariable {
  id: number;
  snippet_id: string;
  placeholder: string;
  prompt_text: string;
}

export type SnippetFrequency = "none" | "1h" | "2h" | "4h" | "8h" | "12h" | "24h";

export type SnippetCategory =
  | "utilities"
  | "social"
  | "finance"
  | "productivity"
  | "monitoring"
  | "other";

export interface SnippetWithVariables extends Snippet {
  variables: SnippetVariable[];
  author?: User;
}

export interface ApiResponse<T> {
  data: T;
  error?: never;
}

export interface ApiError {
  data?: never;
  error: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

export interface SnippetSearchParams {
  q?: string;
  category?: SnippetCategory;
  frequency?: SnippetFrequency;
}
