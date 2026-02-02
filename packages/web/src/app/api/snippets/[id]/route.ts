import { NextRequest, NextResponse } from "next/server";
import { getSnippetById } from "@/lib/queries";
import type { ApiResult, SnippetWithVariables } from "@thrumhub/shared";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const snippet = await getSnippetById(id);

    if (!snippet) {
      const result: ApiResult<never> = { error: "Snippet not found" };
      return NextResponse.json(result, { status: 404 });
    }

    const result: ApiResult<SnippetWithVariables> = { data: snippet };
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const result: ApiResult<never> = { error: message };
    return NextResponse.json(result, { status: 500 });
  }
}
