import { NextResponse } from "next/server";
import { getLatestBuild, ITCH_URL } from "@/lib/blob";

export const dynamic = "force-dynamic";

/**
 * Stable public download link. Resolves to the newest uploaded build, or falls
 * back to the itch.io page while no build has been uploaded.
 */
export async function GET() {
  const build = await getLatestBuild();
  return NextResponse.redirect(build ? build.downloadUrl : ITCH_URL, 307);
}
