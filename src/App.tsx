import { useMemo, useRef, useState } from "react";
import { uploadToFileIO, type UploadOptions } from "./lib/upload";
import QRBlock from "./components/QRBlock";
import { stripExifByReencode } from "./lib/image";
import { z } from "zod";

const expirySchema = z.enum(["30m", "1h", "24h", "7d"]);
const downloadsSchema = z.union([z.literal(1), z.literal(20)]);

type Phase = "idle" | "selected" | "uploading" | "done" | "error";

export default function App() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [stripExif, setStripExif] = useState(true);
  const [expires, setExpires] = useState<z.infer<typeof expirySchema>>("24h");
  const [maxDownloads, setMaxDownloads] =
    useState<z.infer<typeof downloadsSchema>>(1);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const canUpload = useMemo(() => !!rawFile, [rawFile]);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setRawFile(f);
    setLink(null);
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
    setPhase(f ? "selected" : "idle");
  };

  const reset = () => {
    setPhase("idle");
    setRawFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setLink(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const doUpload = async () => {
    if (!rawFile) return;
    setPhase("uploading");
    setError(null);
    try {
      // optional EXIF strip
      const file = stripExif ? await stripExifByReencode(rawFile) : rawFile;

      const opts: UploadOptions = { expires, maxDownloads };
      const { link } = await uploadToFileIO(file, opts);
      setLink(link);
      setPhase("done");
    } catch (e: any) {
      setError(e?.message ?? "Upload error");
      setPhase("error");
    }
  };

  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-xl p-6 flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">PhotoBeam</h1>
          <button onClick={reset} className="text-sm underline">
            Reset
          </button>
        </header>

        {/* Picker */}
        <section className="rounded-2xl border bg-white p-4">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onPick}
              className="block w-full text-sm"
            />
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="preview"
                className="max-h-64 rounded-lg border"
              />
            </div>
          )}

          {/* Options */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={stripExif}
                onChange={(e) => setStripExif(e.target.checked)}
              />
              Strip EXIF
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Expiry</span>
              <select
                value={expires}
                onChange={(e) => setExpires(expirySchema.parse(e.target.value))}
                className="rounded border p-2"
              >
                <option value="30m">30 minutes</option>
                <option value="1h">1 hour</option>
                <option value="24h">24 hours</option>
                <option value="7d">7 days</option>
              </select>
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Downloads</span>
              <select
                value={maxDownloads}
                onChange={(e) =>
                  setMaxDownloads(downloadsSchema.parse(Number(e.target.value)))
                }
                className="rounded border p-2"
              >
                <option value={1}>Single (1)</option>
                <option value={20}>Group (~20)</option>
              </select>
            </label>
          </div>

          <div className="mt-4">
            <button
              onClick={doUpload}
              disabled={!canUpload || phase === "uploading"}
              className="px-4 py-2 rounded bg-black text-white disabled:opacity-40"
            >
              {phase === "uploading" ? "Uploading…" : "Upload & Get Link"}
            </button>
          </div>
        </section>

        {/* Result */}
        {phase === "done" && link && (
          <section className="rounded-2xl border bg-white p-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <input
                readOnly
                value={link}
                className="flex-1 rounded border p-2 text-sm"
                onFocus={(e) => e.currentTarget.select()}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(link);
                }}
                className="px-3 py-2 rounded bg-neutral-900 text-white"
              >
                Copy
              </button>
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded border"
              >
                Open
              </a>
            </div>

            <div className="pt-2">
              <QRBlock url={link} />
            </div>
          </section>
        )}

        {phase === "error" && error && (
          <p className="text-red-600 text-sm">Error: {error}</p>
        )}
      </div>
    </div>
  );
}
