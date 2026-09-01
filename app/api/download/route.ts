import { NextResponse } from "next/server";
import { getLatestBuild } from "@/lib/blob";

export const dynamic = "force-dynamic";

/**
 * Stable public download link. Redirects to the newest uploaded build.
 *
 * `downloadUrl` (rather than `url`) is what forces the browser to save the
 * file instead of trying to render it.
 */
export async function GET() {
  const build = await getLatestBuild();

  if (!build) {
    return new NextResponse(
      "No build has been uploaded yet. Upload one at /admin.",
      { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  return NextResponse.redirect(build.downloadUrl, 307);
}
