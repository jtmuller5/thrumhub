import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSnippetById, incrementDownloads, updateSnippet } from "@/lib/queries";
import type { ApiResult, Snippet, SnippetWithVariables } from "@thrumhub/shared";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const source = _request.nextUrl.searchParams.get("source");
    const snippet = await getSnippetById(id);

    if (!snippet) {
      const result: ApiResult<never> = { error: "Snippet not found" };
      return NextResponse.json(result, { status: 404 });
    }

    if (source === "cli") {
      await incrementDownloads(id);
    }

    const result: ApiResult<SnippetWithVariables> = { data: snippet };
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const result: ApiResult<never> = { error: message };
    return NextResponse.json(result, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const dbId = (session as unknown as Record<string, unknown>)?.dbId;
    if (!session || !dbId) {
      const result: ApiResult<never> = { error: "Unauthorized" };
      return NextResponse.json(result, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, website, content, frequency, category } = body;

    if (!name || !content || !frequency || !category) {
      const result: ApiResult<never> = { error: "Missing required fields" };
      return NextResponse.json(result, { status: 400 });
    }

    const snippet = await updateSnippet(id, dbId as number, {
      name,
      description,
      website,
      content,
      frequency,
      category,
    });

    if (!snippet) {
      const result: ApiResult<never> = { error: "Snippet not found or not authorized" };
      return NextResponse.json(result, { status: 404 });
    }

    const result: ApiResult<Snippet> = { data: snippet };
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const result: ApiResult<never> = { error: message };
    return NextResponse.json(result, { status: 500 });
  }
}
