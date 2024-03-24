import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html class="h-full">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>kratos-selfservice-ui-fresh</title>
      </head>
      <body class="h-full">
        <div class="min-h-full py-16 bg-gradient-to-rt from-[#4158D0] via-[#C850C0] to-[#FFCC70]">
          <Component />
        </div>
      </body>
    </html>
  );
}
