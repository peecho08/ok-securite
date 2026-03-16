"use client";

import { useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { useLocale } from "@/lib/i18n";

interface InviteQRCodeProps {
  url: string;
  teamName?: string;
}

export function InviteQRCode({ url, teamName }: InviteQRCodeProps) {
  const { t } = useLocale();

  const downloadPrintable = useCallback(() => {
    const canvas = document.createElement("canvas");
    const w = 800;
    const h = 1000;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#F97316";
    ctx.fillRect(0, 0, w, 8);

    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("OK Sécurité", w / 2, 70);

    if (teamName) {
      ctx.fillStyle = "#6b7280";
      ctx.font = "500 20px system-ui, -apple-system, sans-serif";
      ctx.fillText(teamName, w / 2, 105);
    }

    const qrSize = 400;
    const qrX = (w - qrSize) / 2;
    const qrY = teamName ? 140 : 120;

    const svgEl = document.querySelector<SVGElement>("[data-qr-invite]");
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#f9fafb";
      const padding = 30;
      ctx.beginPath();
      const rx = qrX - padding;
      const ry = qrY - padding;
      const rw = qrSize + padding * 2;
      const rh = qrSize + padding * 2;
      const radius = 20;
      ctx.moveTo(rx + radius, ry);
      ctx.lineTo(rx + rw - radius, ry);
      ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
      ctx.lineTo(rx + rw, ry + rh - radius);
      ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh);
      ctx.lineTo(rx + radius, ry + rh);
      ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius);
      ctx.lineTo(rx, ry + radius);
      ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
      ctx.closePath();
      ctx.fill();

      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
      URL.revokeObjectURL(svgUrl);

      const textY = qrY + qrSize + 70;
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(t("qr.scanToJoin"), w / 2, textY);

      ctx.fillStyle = "#6b7280";
      ctx.font = "18px system-ui, -apple-system, sans-serif";
      const instructionLines = wrapText(ctx, t("qr.scanInstruction"), w - 120);
      instructionLines.forEach((line, i) => {
        ctx.fillText(line, w / 2, textY + 40 + i * 26);
      });

      ctx.fillStyle = "#d1d5db";
      ctx.font = "14px system-ui, -apple-system, sans-serif";
      ctx.fillText("ok-securite.com", w / 2, h - 30);

      const link = document.createElement("a");
      link.download = `qr-${teamName?.replace(/\s+/g, "-").toLowerCase() || "equipe"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = svgUrl;
  }, [url, teamName, t]);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
      <div className="flex flex-col items-center px-4 py-5">
        <div className="rounded-xl bg-white p-3">
          <QRCodeSVG
            data-qr-invite=""
            value={url}
            size={160}
            level="M"
            marginSize={0}
            fgColor="#1a1a1a"
            bgColor="#ffffff"
          />
        </div>
        <p className="mt-3 text-center text-xs text-gray-500 dark:text-neutral-400">
          {t("qr.scanToJoin")}
        </p>
      </div>
      <div className="border-t border-gray-100 dark:border-neutral-700">
        <button
          type="button"
          onClick={downloadPrintable}
          className="flex w-full items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors active:bg-gray-50 dark:text-neutral-300 dark:active:bg-neutral-700"
        >
          <Download className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
          {t("qr.downloadPrint")}
        </button>
      </div>
    </div>
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}
