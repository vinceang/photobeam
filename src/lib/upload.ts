// Uploader abstraction (file.io now, S3 later)
import axios from "axios";

export type UploadOptions = {
  expires?: "30m" | "1h" | "24h" | "7d";
  maxDownloads?: 1 | 20; // 1 for single, ~20 for small groups
};

export type UploadResult = {
  link: string; // the share URL
  expiry?: string; // echo back what we requested
  maxDownloads?: number;
};

export async function uploadToFileIO(
  file: File,
  opts: UploadOptions
): Promise<UploadResult> {
  const params = new URLSearchParams();
  if (opts.expires) params.set("expires", opts.expires);
  if (opts.maxDownloads) params.set("maxDownloads", String(opts.maxDownloads));

  const url = `https://file.io/?${params.toString()}`;
  const form = new FormData();
  form.append("file", file);

  const res = await axios.post(url, form, {
    headers: { Accept: "application/json" },
    // file.io is simple; no auth for anonymous uploads
  });

  // file.io returns shapes like { success, link, ... } when successful
  if (!res.data?.link) throw new Error("Upload failed.");
  return {
    link: res.data.link,
    expiry: opts.expires,
    maxDownloads: opts.maxDownloads,
  };
}
