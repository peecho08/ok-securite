import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OK Sécurité — Sécurité chantier simplifiée";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#1E2324",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              backgroundColor: "#22c55e",
              fontSize: "44px",
              fontWeight: 800,
              color: "white",
            }}
          >
            OK
          </div>
          <span
            style={{
              fontSize: "52px",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            Sécurité
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#22c55e",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            Sécurité chantier. Simplifiée.
          </span>
          <span
            style={{
              fontSize: "22px",
              color: "rgba(255,255,255,0.7)",
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: 1.5,
            }}
          >
            Listes de vérification CNESST, rapports PDF et gestion
            d&apos;équipe — tout dans une seule app.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "40px",
            gap: "32px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "1px",
              textTransform: "uppercase" as const,
            }}
          >
            ok-securite.com
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Fait au Canada
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
