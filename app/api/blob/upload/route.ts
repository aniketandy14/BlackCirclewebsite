import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { BUILD_PREFIX } from "@/lib/blob";

/** 5 GB — comfortably above a packaged Unity build, below the Blob per-file cap. */
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 * 1024;

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const password = process.env.ADMIN_PASSWORD;

        if (!password) {
          throw new Error(
            "ADMIN_PASSWORD is not set on the server. Add it in your Vercel project settings.",
          );
        }
        if (clientPayload !== password) {
          throw new Error("Wrong password.");
        }
        if (!pathname.startsWith(BUILD_PREFIX)) {
          throw new Error("Uploads are only allowed under the builds/ prefix.");
        }
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          throw new Error(
            "BLOB_READ_WRITE_TOKEN is missing. Connect a Blob store to this project and redeploy.",
          );
        }

        // Deliberately no allowedContentTypes: browsers label .zip
        // inconsistently (application/zip, application/x-zip-compressed,
        // octet-stream, or empty), and the password above is the real gate.
        return {
          // Keeps older builds intact; the newest upload becomes the live one.
          addRandomSuffix: true,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
        };
      },
      onUploadCompleted: async () => {
        // No database to update — the public download resolves the newest blob
        // at request time.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
