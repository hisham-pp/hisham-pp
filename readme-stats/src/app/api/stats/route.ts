import { NextRequest } from "next/server";
import { fetchGitHubStats } from "@/utils/github";
import { generateStatsSvg } from "@/utils/svg";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return new Response("Missing username parameter", { status: 400 });
  }

  try {
    const stats = await fetchGitHubStats(username);
    const svg = generateStatsSvg(stats);

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
