import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "<> Jay Kim — Software Engineer <>";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050505",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(34,197,94,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Top decorative line */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 120,
            right: 120,
            height: 1,
            background: "rgba(34,197,94,0.2)",
          }}
        />

        {/* Angle brackets + Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <span
            style={{
              fontSize: 72,
              color: "rgba(34,197,94,0.5)",
              fontWeight: 300,
            }}
          >
            &lt;&gt;
          </span>
          <span
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: "#f5f5f5",
              letterSpacing: "-0.02em",
            }}
          >
            Jay Kim
          </span>
          <span
            style={{
              fontSize: 72,
              color: "rgba(34,197,94,0.5)",
              fontWeight: 300,
            }}
          >
            &lt;/&gt;
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.25em",
            textTransform: "uppercase" as const,
            marginTop: 20,
          }}
        >
          Software Engineer // AI-ML
        </div>

        {/* Bottom decorative line */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 120,
            right: 120,
            height: 1,
            background: "rgba(34,197,94,0.2)",
          }}
        />

        {/* Bottom corner accents */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 120,
            fontSize: 12,
            color: "rgba(34,197,94,0.3)",
          }}
        >
          SYS.PORTFOLIO.v2
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 50,
            right: 120,
            fontSize: 12,
            color: "rgba(255,255,255,0.15)",
          }}
        >
          github.com/NyXkim5
        </div>
      </div>
    ),
    { ...size }
  );
}
