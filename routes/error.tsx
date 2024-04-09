import { kratosFrontendApi } from "~/lib/ory.server.ts";

import { jiggleHandler, JiggleProps, jiggleWithInit } from "~/lib/jiggle.ts";
import { redirect } from "~/lib/redirect.ts";

async function getRouteData(req: Request) {
  const params = new URL(req.url).searchParams;
  if (params.has("error")) {
    return {
      id: decodeURIComponent(params.get("error")!),
      error: {
        status: "OAuth2 Error",
        id: decodeURIComponent(params.get("error")!),
        message: decodeURIComponent(
          params.get("error_description") ??
            "No description provided",
        ),
        ...(params.has("error_hint")
          ? { hint: decodeURIComponent(params.get("error_hint")!) }
          : {}),
        code: 599, // Dummy code to trigger the full error screen
      },
    };
  }
  if (params.has("id")) {
    const { data, status, statusText } = await kratosFrontendApi.getFlowError({
      id: params.get("id")!,
    });
    return jiggleWithInit(data, { status, statusText });
  }

  return redirect("/");
}

export const handler = jiggleHandler({ GET: getRouteData });
export default function Route({ data }: JiggleProps<typeof getRouteData>) {
  return <pre>{JSON.stringify(data, null, 4)}</pre>;
}
