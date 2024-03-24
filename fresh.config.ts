import { defineConfig } from "$fresh/server.ts";
import unocssPlugin from "$fresh/plugins/unocss.ts";
import presetUno from "@unocss/preset-uno";
import presetIcons from "@unocss/preset-icons";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import presetAttributify from "https://esm.sh/v135/@unocss/preset-attributify@0.58.5/denonext/preset-attributify.mjs";
import presetTypography from "https://esm.sh/v135/@unocss/preset-typography@0.58.5/denonext/preset-typography.mjs";
import presetWebFonts from "https://esm.sh/v135/@unocss/preset-web-fonts@0.58.5/denonext/preset-web-fonts.mjs";
// import transformerDirectives from "https://esm.sh/v135/@unocss/transformer-directives@0.58.5/denonext/transformer-directives.mjs";

export default defineConfig({
  plugins: [
    unocssPlugin({
      aot: true,
      ssr: true,
      csr: false,
      config: {
        shortcuts: [
          {
            stack: "flex flex-col",
            vstack: "flex flex-col",
            hstack: "flex flex-row",
          },
        ],
        theme: {
          colors: {
            blue: {
              50: "#ebf8ff",
              100: "#bee3f8",
              200: "#90cdf4",
              300: "#63b3ed",
              400: "#4299e1",
              500: "#3182ce",
              600: "#2b6cb0",
              700: "#2c5282",
              800: "#2a4365",
              900: "#1A365D",
            },
            green: {
              50: "#F0FFF4",
              100: "#C6F6D5",
              200: "#9AE6B4",
              300: "#68D391",
              400: "#48BB78",
              500: "#38A169",
              600: "#2F855A",
              700: "#276749",
              800: "#22543D",
              900: "#1C4532",
            },
            red: {
              50: "#FFF5F5",
              100: "#FED7D7",
              200: "#FEB2B2",
              300: "#FC8181",
              400: "#F56565",
              500: "#E53E3E",
              600: "#C53030",
              700: "#9B2C2C",
              800: "#822727",
              900: "#63171B",
            },
          },
          container: {
            center: true,
            padding: "1rem",
          },
        },
        presets: [
          presetUno(),
          presetAttributify(),
          presetIcons({
            warn: true,
            collections: {
              carbon: () =>
                import(
                  "https://esm.sh/@iconify-json/carbon@1.1.30/icons.json",
                  { with: { type: "json" } }
                ).then((i) => i.default),
              mdi: () =>
                import("https://esm.sh/@iconify-json/mdi@1.1.64/icons.json", {
                  with: { type: "json" },
                }).then((i) => i.default),
              fa: () =>
                import("https://esm.sh/@iconify-json/fa@1.1.8/icons.json", {
                  with: { type: "json" },
                }).then((i) => i.default),
              logos: () =>
                import("https://esm.sh/@iconify-json/logos@1.1.42/icons.json", {
                  with: { type: "json" },
                }).then((i) => i.default),
            },
          }),
          presetTypography(),
          presetWebFonts({
            fonts: {
              // ...
            },
          }),
        ],
        transformers: [
          // transformerDirectives(),
          transformerVariantGroup(),
        ],
      },
    }),
  ],
});
