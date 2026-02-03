import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSnippets, searchSnippets, createSnippet } from "@/lib/queries";
import type { ApiResult, Snippet, SnippetCategory, SnippetFrequency } from "@thrumhub/shared";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category") as SnippetCategory | null;
    const frequency = searchParams.get("frequency") as SnippetFrequency | null;

    let snippets: Snippet[];

    if (q) {
      snippets = await searchSnippets(q);
    } else {
      snippets = await getSnippets({
        category: category || undefined,
        frequency: frequency || undefined,
      });
    }

    const result: ApiResult<Snippet[]> = { data: snippets };
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const result: ApiResult<never> = { error: message };
    return NextResponse.json(result, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const dbId = (session as unknown as Record<string, unknown>)?.dbId;
    if (!session || !dbId) {
      const result: ApiResult<never> = { error: "Unauthorized" };
      return NextResponse.json(result, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description, website, content, frequency, category, variables } = body;

    if (!id || !name || !content || !frequency || !category) {
      const result: ApiResult<never> = { error: "Missing required fields" };
      return NextResponse.json(result, { status: 400 });
    }

    const snippet = await createSnippet({
      id,
      name,
      description,
      website,
      content,
      frequency,
      category,
      author_id: dbId as number,
      variables: variables || [],
    });

    const result: ApiResult<Snippet> = { data: snippet };
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const result: ApiResult<never> = { error: message };
    return NextResponse.json(result, { status: 500 });
  }
}
