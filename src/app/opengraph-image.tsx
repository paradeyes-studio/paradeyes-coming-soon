import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Paradeyes Agency — On comprend. On conçoit. On construit.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #023236 0%, #003135 60%, #14222E 100%)",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "-200px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "600px",
            background:
              "radial-gradient(ellipse, rgba(87, 238, 161, 0.35) 0%, rgba(87, 238, 161, 0.15) 40%, transparent 70%)",
            filter: "blur(40px)",
            display: "flex",
          }}
        />

        <div
          style={{
            color: "#57EEA1",
            fontSize: "22px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: "40px",
            display: "flex",
          }}
        >
          Agence créative au service de votre croissance
        </div>

        <div
          style={{
            color: "#FFFFFF",
            fontSize: "88px",
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.05,
            letterSpacing: "-2px",
            maxWidth: "1000px",
            display: "flex",
          }}
        >
          On comprend. On conçoit. On construit.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "60px",
            color: "#57EEA1",
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          Paradeyes
        </div>
      </div>
    ),
    { ...size },
  );
}
