import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { BUILD_PREFIX, getBuilds } from "@/lib/blob";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return request.headers.get("x-admin-password") === password;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // blobConfigured lets the admin page warn about a missing Blob store up
  // front, rather than after an upload fails with an opaque SDK error.
  return NextResponse.json({
    builds: await getBuilds(),
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  });
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pathname } = (await request.json()) as { pathname?: string };

  if (!pathname || !pathname.startsWith(BUILD_PREFIX)) {
    return NextResponse.json(
      { error: "A builds/ pathname is required." },
      { status: 400 },
    );
  }

  try {
    await del(pathname);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
