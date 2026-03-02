const SCALE = 3;
const CANVAS_W = 2108;
const CANVAS_H = 570;

export async function getLogoPngDataUrl(): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_W * SCALE;
    canvas.height = CANVAS_H * SCALE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("no canvas context"));

    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, CANVAS_W * SCALE, CANVAS_H * SCALE);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("logo render failed"));
    };
    img.src = "/logo.svg";
  });
}
