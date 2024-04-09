import { Handlers } from "$fresh/server.ts";
import { kratosFrontendApi } from "~/lib/ory.server.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    return new Response(
      await kratosFrontendApi.getWebAuthnJavaScript().then(({ data }) => data),
      {
        headers: {
          "Content-Type": "text/javascript",
        },
      },
    );
  },
};
