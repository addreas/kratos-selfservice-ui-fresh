import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  shortcuts: [
    {
      stack: "flex flex-col items-center",
      vstack: "flex flex-col items-center",
      hstack: "flex flex-row items-center",
    },
  ],
  theme: {
    colors: {
      // ...
    },
    container: {
      center: true,
      padding: "1rem",
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
