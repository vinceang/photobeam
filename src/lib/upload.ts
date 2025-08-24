// src/lib/upload.ts

export type UploadOptions = {
  /** Expiry duration: e.g., "30m", "1h", "24h", "7d" */
  expires?: "30m" | "1h" | "24h" | "7d";
  /** Download cap: 1 (single) or ~20 (small group) */
  maxDownloads?: 1 | 20;
  /** Whether file auto-deletes after expiry or final download (true by default server-side) */
  autoDelete?: boolean;
};

export type UploadResult = {
  success: boolean;
  link: string;
  key?: string;
  expires?: string; // RFC3339 timestamp from API
  maxDownloads?: number; // echoed back by API
  message?: string;
};

export async function uploadToFileIO(
  file: File,
  opts: UploadOptions
): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);

  if (opts.expires) form.append("expires", opts.expires); // "30m" | "1h" | "24h" | "7d"
  if (opts.maxDownloads) form.append("maxDownloads", String(opts.maxDownloads));
  if (opts.autoDelete !== undefined)
    form.append("autoDelete", String(opts.autoDelete));

  const res = await fetch("https://file.io", {
    method: "POST",
    body: form,
    // Don't set Content-Type for FormData — browser will add the multipart boundary.
    headers: { Accept: "application/json" },
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // If server didn't return JSON, surface the raw text for debugging
    const txt = await res.text().catch(() => "");
    throw new Error(
      `file.io non-JSON response (${res.status}): ${txt || res.statusText}`
    );
  }

  if (!res.ok || !data?.success || !data?.link) {
    const msg = data?.message || `file.io error ${res.status}`;
    throw new Error(msg);
  }

  return {
    success: true,
    link: data.link,
    key: data.key,
    expires: data.expires,
    maxDownloads: data.maxDownloads,
    message: data.message,
  };
}
