export async function stripExifByReencode(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  ctx.drawImage(bitmap, 0, 0);

  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), file.type || "image/jpeg", 0.92)
  );
  return new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
    type: blob.type,
    lastModified: Date.now(),
  });
}
