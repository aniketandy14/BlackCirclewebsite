import { list } from "@vercel/blob";

/** All uploaded builds live under this prefix so the store stays tidy. */
export const BUILD_PREFIX = "builds/";

export type BuildInfo = {
  url: string;
  downloadUrl: string;
  pathname: string;
  filename: string;
  size: number;
  uploadedAt: string;
};

function toBuildInfo(blob: {
  url: string;
  downloadUrl: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
}): BuildInfo {
  return {
    url: blob.url,
    downloadUrl: blob.downloadUrl,
    pathname: blob.pathname,
    filename: blob.pathname.slice(BUILD_PREFIX.length) || "black-circle.zip",
    size: blob.size,
    uploadedAt: blob.uploadedAt.toISOString(),
  };
}

/**
 * Whether client (browser) uploads can be issued.
 *
 * Reads and deletes authenticate through resolveBlobAuth, which accepts OIDC
 * (BLOB_STORE_ID + VERCEL_OIDC_TOKEN). Minting a client token for a browser
 * upload is the one operation that needs the long-lived read-write token.
 */
export function canIssueClientTokens(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Every build in the store, newest first.
 *
 * Returns [] rather than throwing when Blob is unreachable — the site has to
 * render fine on the very first deploy, before any store exists.
 */
export async function getBuilds(): Promise<BuildInfo[]> {
  try {
    const { blobs } = await list({ prefix: BUILD_PREFIX });
    return blobs
      .map(toBuildInfo)
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  } catch {
    return [];
  }
}

/** The build the public download button serves: the most recent upload. */
export async function getLatestBuild(): Promise<BuildInfo | null> {
  const builds = await getBuilds();
  return builds[0] ?? null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }

  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
