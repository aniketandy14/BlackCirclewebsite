"use client";

import { upload } from "@vercel/blob/client";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import {
  BUILD_PREFIX,
  formatBytes,
  formatDate,
  type BuildInfo,
} from "@/lib/blob";

type Status =
  | { kind: "idle" }
  | { kind: "uploading"; percentage: number }
  | { kind: "done"; filename: string }
  | { kind: "error"; message: string };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [builds, setBuilds] = useState<BuildInfo[]>([]);
  const [blobConfigured, setBlobConfigured] = useState(true);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const loadBuilds = useCallback(async (pw: string) => {
    const response = await fetch("/api/builds", {
      headers: { "x-admin-password": pw },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Wrong password.");
    const data = (await response.json()) as {
      builds: BuildInfo[];
      blobConfigured: boolean;
    };
    setBuilds(data.builds);
    setBlobConfigured(data.blobConfigured);
  }, []);

  async function handleUnlock(event: React.FormEvent) {
    event.preventDefault();
    setUnlockError(null);
    try {
      await loadBuilds(password);
      setUnlocked(true);
    } catch (error) {
      setUnlockError((error as Error).message);
    }
  }

  async function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setStatus({ kind: "error", message: "That is not a .zip file." });
      return;
    }

    setStatus({ kind: "uploading", percentage: 0 });

    try {
      await upload(BUILD_PREFIX + file.name, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: password,
        // Splits large builds into parallel parts and retries the ones that fail.
        multipart: true,
        onUploadProgress: ({ percentage }) =>
          setStatus({ kind: "uploading", percentage }),
      });

      setStatus({ kind: "done", filename: file.name });
      await loadBuilds(password);
    } catch (error) {
      setStatus({ kind: "error", message: explainUploadError(error) });
    }
  }

  async function handleDelete(build: BuildInfo) {
    if (!confirm("Delete " + build.filename + "? This cannot be undone.")) {
      return;
    }

    await fetch("/api/builds", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ pathname: build.pathname }),
    });
    await loadBuilds(password);
  }

  if (!unlocked) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
        <Ring className="h-10 w-10" />
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Admin</h1>
        <p className="mt-2 text-sm text-ash">
          Enter the admin password to manage the downloadable build.
        </p>

        <form onSubmit={handleUnlock} className="mt-8">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border border-edge bg-surface px-4 py-3 text-sm outline-none transition placeholder:text-dim focus:border-blood"
          />
          {unlockError ? (
            <p className="mt-3 text-sm text-blood">{unlockError}</p>
          ) : null}
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-blood px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Unlock
          </button>
        </form>

        <Link
          href="/"
          className="mt-8 text-center text-sm text-dim transition hover:text-ash"
        >
          Back to site
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Ring className="h-7 w-7" />
          <h1 className="text-xl font-bold tracking-tight">Build manager</h1>
        </div>
        <Link href="/" className="text-sm text-dim transition hover:text-ash">
          Back to site
        </Link>
      </div>

      {!blobConfigured ? (
        <div className="mt-8 rounded-xl border border-blood/40 bg-blood/5 p-5">
          <p className="text-sm font-semibold text-blood">
            Blob storage is not connected
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ash">
            Uploads will fail until this deployment can see a Blob store. In
            Vercel: <strong className="text-chalk">Storage</strong> &rarr;{" "}
            <strong className="text-chalk">Create Database</strong> &rarr;{" "}
            <strong className="text-chalk">Blob</strong>, connect it to this
            project, then redeploy so{" "}
            <code className="text-chalk">BLOB_READ_WRITE_TOKEN</code> reaches
            the running build.
          </p>
        </div>
      ) : null}

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) void handleFile(file);
        }}
        className={
          "mt-10 rounded-xl border border-dashed p-10 text-center transition " +
          (dragging ? "border-blood bg-blood/5" : "border-edge bg-surface")
        }
      >
        <p className="text-sm font-medium">Drop your .zip here</p>
        <p className="mt-1 text-sm text-dim">or</p>

        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="mt-3 rounded-lg border border-edge px-4 py-2 text-sm font-medium transition hover:border-blood"
        >
          Choose file
        </button>

        <input
          ref={fileInput}
          type="file"
          accept=".zip"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
            event.target.value = "";
          }}
        />

        <p className="mt-4 text-xs text-dim">
          The newest upload is what the site serves. Up to 5 GB.
        </p>
      </div>

      {status.kind === "uploading" ? (
        <div className="mt-6">
          <div className="flex justify-between text-sm">
            <span className="text-ash">Uploading</span>
            <span className="tabular-nums text-ash">
              {Math.round(status.percentage)}%
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-raised">
            <div
              className="h-full rounded-full bg-blood transition-[width]"
              style={{ width: status.percentage + "%" }}
            />
          </div>
          <p className="mt-2 text-xs text-dim">
            Keep this tab open until it finishes.
          </p>
        </div>
      ) : null}

      {status.kind === "done" ? (
        <p className="mt-6 text-sm text-jade">
          {status.filename} is live on the site.
        </p>
      ) : null}

      {status.kind === "error" ? (
        <p className="mt-6 text-sm text-blood">{status.message}</p>
      ) : null}

      <h2 className="mt-14 text-sm font-semibold uppercase tracking-wide text-ash">
        Uploaded builds
      </h2>

      {builds.length === 0 ? (
        <p className="mt-4 text-sm text-dim">
          Nothing uploaded yet. The download button on the site stays inactive
          until you add a build.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-edge rounded-xl border border-edge">
          {builds.map((build, index) => (
            <li
              key={build.pathname}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {build.filename}
                  {index === 0 ? (
                    <span className="ml-2 rounded bg-jade/15 px-1.5 py-0.5 text-xs font-semibold text-jade">
                      LIVE
                    </span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-xs text-dim">
                  {formatBytes(build.size)} &middot; {formatDate(build.uploadedAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleDelete(build)}
                className="shrink-0 text-xs text-dim transition hover:text-blood"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

/**
 * The Blob SDK throws a bare "Failed to retrieve the client token" for every
 * non-2xx from our token route and discards the body, so translate it into
 * something a human can act on.
 */
function explainUploadError(error: unknown): string {
  const message = (error as Error).message ?? "Upload failed.";

  if (message.toLowerCase().includes("client token")) {
    return (
      "Could not start the upload. This almost always means the Blob store " +
      "is not connected to this deployment: create one under Storage, then " +
      "redeploy so BLOB_READ_WRITE_TOKEN reaches the running build."
    );
  }

  return message;
}

function Ring({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle
        cx="20"
        cy="20"
        r="17"
        fill="none"
        stroke="var(--color-blood)"
        strokeWidth="2.5"
      />
    </svg>
  );
}
