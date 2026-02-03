import { NextRequest, NextResponse } from "next/server";
import { getSnippetById } from "@/lib/queries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const snippet = await getSnippetById(id);

    if (!snippet) {
      return new NextResponse("Snippet not found", { status: 404 });
    }

    return new NextResponse(snippet.content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("GET /api/snippets/[id]/raw failed:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
