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
  content: string;
  frequency: SnippetFrequency;
  category: SnippetCategory;
  author_id: number;
  created_at: string;
  updated_at: string;
}

export interface SnippetVariable {
  id: number;
  snippet_id: string;
  placeholder: string;
  prompt_text: string;
}

export type SnippetFrequency = "hourly" | "daily" | "weekly" | "monthly" | "on-demand";

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
