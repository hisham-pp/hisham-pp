import { NextRequest } from "next/server";
import { fetchTopLanguages } from "@/utils/github";
import { generateTopLangsSvg } from "@/utils/svg";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return new Response("Missing username parameter", { status: 400 });
  }

  try {
    const langs = await fetchTopLanguages(username);
    const svg = generateTopLangsSvg(langs);

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
