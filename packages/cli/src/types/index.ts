export type {
  Snippet,
  SnippetWithVariables,
  SnippetVariable,
  User,
  ApiResult,
  SnippetSearchParams,
  SnippetFrequency,
  SnippetCategory,
} from "@thrumhub/shared";

export interface CliConfig {
  apiUrl: string;
  heartbeatPath: string;
}
