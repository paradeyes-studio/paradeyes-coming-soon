import satori from "satori";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

async function renderLogoToPng() {
  const logoSvgPath = path.join(
    process.cwd(),
    "public",
    "logos",
    "paradeyes-logo-white-green.svg",
  );
  const logoSvgBuffer = fs.readFileSync(logoSvgPath);

  const logoPng = await sharp(logoSvgBuffer)
    .resize(520, 65, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return logoPng;
}

async function generateOGImage() {
  console.log("Rendering logo SVG to transparent PNG...");
  const logoPngBuffer = await renderLogoToPng();
  const logoBase64 = `data:image/png;base64,${logoPngBuffer.toString("base64")}`;

  console.log("Loading fonts from @fontsource/dm-sans...");

  const FONT_DIR = path.join(
    process.cwd(),
    "node_modules",
    "@fontsource",
    "dm-sans",
    "files",
  );

  const dmRegular = fs.readFileSync(
    path.join(FONT_DIR, "dm-sans-latin-400-normal.woff"),
  );
  const dmSemibold = fs.readFileSync(
    path.join(FONT_DIR, "dm-sans-latin-600-normal.woff"),
  );
  const dmBold = fs.readFileSync(
    path.join(FONT_DIR, "dm-sans-latin-700-normal.woff"),
  );

  console.log("Building SVG via satori...");

  const node = {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        background:
          "linear-gradient(135deg, #023236 0%, #003135 55%, #012426 100%)",
        padding: "70px 90px",
        fontFamily: "DM Sans",
        overflow: "hidden",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: "-260px",
              right: "-180px",
              width: "780px",
              height: "780px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(87, 238, 161, 0.28) 0%, rgba(87, 238, 161, 0.08) 45%, transparent 70%)",
              display: "flex",
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: "-160px",
              left: "-140px",
              width: "560px",
              height: "560px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(87, 238, 161, 0.14) 0%, transparent 65%)",
              display: "flex",
            },
          },
        },
        // TOP : Paradeyes logo (eye + wordmark SVG)
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              position: "relative",
              zIndex: 10,
            },
            children: [
              {
                type: "img",
                props: {
                  src: logoBase64,
                  width: 520,
                  height: 65,
                  style: {
                    width: "520px",
                    height: "65px",
                  },
                },
              },
            ],
          },
        },
        // CENTER : main signature
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              zIndex: 10,
              flex: 1,
              paddingTop: "30px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: "80px",
                    height: "2px",
                    background: "#57EEA1",
                    marginBottom: "38px",
                    display: "flex",
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    color: "#FFFFFF",
                    fontSize: "76px",
                    fontWeight: 700,
                    lineHeight: 1.08,
                    letterSpacing: "-2px",
                    fontFamily: "DM Sans",
                    maxWidth: "980px",
                    display: "flex",
                    flexWrap: "wrap",
                  },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: { color: "#FFFFFF" },
                        children: "Agence créative au service de votre ",
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: { color: "#57EEA1" },
                        children: "croissance.",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // BOTTOM : tag line + URL
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              zIndex: 10,
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "20px",
                    fontWeight: 600,
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    fontFamily: "DM Sans",
                    display: "flex",
                  },
                  children: "On comprend. On conçoit. On construit.",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    color: "#57EEA1",
                    fontSize: "20px",
                    fontWeight: 600,
                    letterSpacing: "1.5px",
                    fontFamily: "DM Sans",
                    display: "flex",
                  },
                  children: "paradeyesagency.com",
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(node, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "DM Sans", data: dmRegular, weight: 400, style: "normal" },
      { name: "DM Sans", data: dmSemibold, weight: 600, style: "normal" },
      { name: "DM Sans", data: dmBold, weight: 700, style: "normal" },
    ],
  });

  console.log("Converting SVG to PNG via sharp...");

  const pngBuffer = await sharp(Buffer.from(svg))
    .png({ quality: 95, compressionLevel: 9 })
    .toBuffer();

  const outPath = path.join(process.cwd(), "public", "og-image.png");
  fs.writeFileSync(outPath, pngBuffer);

  const kb = Math.round(pngBuffer.length / 1024);
  console.log(`OG image generated: ${outPath}`);
  console.log(`Size: ${kb} KB`);

  if (kb > 1500) {
    console.warn("Warning: image >1.5MB, consider reducing quality");
  }
}

generateOGImage().catch((err) => {
  console.error("OG generation error:", err);
  process.exit(1);
});
