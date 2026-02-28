const WHITE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 468 570" fill="none">
<path d="M285 0C344.28 0 389.374 15.4537 420.28 46.3604C451.693 77.267 467.4 122.107 467.4 180.88C467.4 217.36 462.84 254.854 453.72 293.36C432.946 384.053 399.507 452.96 353.4 500.08C307.8 546.693 250.8 570 182.4 570C123.12 570 77.7737 554.546 46.3604 523.64C15.4537 492.733 1.60508e-05 447.893 0 389.12C0 352.64 4.55969 315.146 13.6797 276.64C34.453 185.946 67.6403 117.293 113.24 70.6797C159.347 23.5599 216.6 7.0094e-06 285 0ZM371.629 157.345C358.426 147.404 339.578 150.021 329.617 163.302L199.322 336.537L134.126 275.329C122.075 264.021 103.091 264.587 91.7236 276.677C80.3953 288.746 80.9806 307.73 93.0703 319.077L182.662 403.195C188.248 408.429 195.592 411.32 203.189 411.32C204.049 411.32 204.908 411.281 205.768 411.203C214.264 410.481 222.037 406.164 227.174 399.348L377.586 199.355C387.527 186.114 384.871 167.305 371.629 157.345Z" fill="white"/>
</svg>`;

const CANVAS_W = 234;
const CANVAS_H = 285;

export async function getLogoPngDataUrl(): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("no canvas context"));
    const img = new Image();
    const blob = new Blob([WHITE_LOGO_SVG], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("logo render failed"));
    };
    img.src = url;
  });
}
