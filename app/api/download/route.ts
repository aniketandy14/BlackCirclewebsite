import { issueSignedToken, presignUrl } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getLatestBuild, isPrivateBlobUrl } from "@/lib/blob";

export const dynamic = "force-dynamic";

/** How long a handed-out download link stays valid. */
const LINK_TTL_MS = 30 * 60 * 1000;

/**
 * Stable public download link. Redirects to the newest uploaded build.
 *
 * A public store serves its blob URL directly. A private store rejects
 * anonymous requests, so mint a short-lived signed URL instead — that keeps
 * the bytes flowing straight from Blob rather than through this function.
 */
export async function GET() {
  const build = await getLatestBuild();

  if (!build) {
    return new NextResponse(
      "No build has been uploaded yet. Upload one at /admin.",
      { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  if (!isPrivateBlobUrl(build.url)) {
    return NextResponse.redirect(build.downloadUrl, 307);
  }

  try {
    const signedToken = await issueSignedToken({
      pathname: build.pathname,
      operations: ["get"],
      validUntil: Date.now() + LINK_TTL_MS,
    });

    const { presignedUrl } = await presignUrl(signedToken, {
      operation: "get",
      pathname: build.pathname,
      access: "private",
      validUntil: Date.now() + LINK_TTL_MS,
    });

    return NextResponse.redirect(presignedUrl, 307);
  } catch (error) {
    return new NextResponse(
      "Could not sign the download link: " + (error as Error).message,
      { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }
}
