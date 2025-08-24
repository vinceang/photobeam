import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";

export default function QRBlock({ url }: { url: string }) {
  const ref = useRef<SVGSVGElement | null>(null);

  const downloadSVG = () => {
    if (!ref.current) return;
    const svg = ref.current;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "photobeam-qr.svg";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <QRCodeSVG value={url} size={220} includeMargin ref={ref} />
      <button
        onClick={downloadSVG}
        className="px-3 py-2 rounded bg-black/80 text-white"
      >
        Download QR (SVG)
      </button>
    </div>
  );
}
