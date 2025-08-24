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

// Alternative: Try tmpfiles.org which is very browser-friendly
export async function uploadToFileIO(
  file: File,
  opts: UploadOptions
): Promise<UploadResult> {
  console.log("Starting upload to tmpfiles.org...", {
    fileName: file.name,
    fileSize: file.size,
    options: opts,
  });

  const form = new FormData();
  form.append("file", file);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: form,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("Response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error("Upload failed:", res.status, errorText);
      throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log("Response data:", data);

    if (!data?.data?.url) {
      throw new Error("Invalid response from upload service");
    }

    const link = data.data.url;
    console.log("Upload successful:", link);

    return {
      success: true,
      link: link,
      expires: opts.expires,
      maxDownloads: opts.maxDownloads,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Upload error:", error);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Upload timed out after 30 seconds");
    }

    throw error;
  }
}
