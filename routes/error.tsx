import { kratosFrontendApi } from "~/lib/ory.server.ts";

import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";
import { redirect } from "~/lib/redirect.ts";
import { UserErrorCard } from "@ory/elements-preact";

async function getRouteData(req: Request) {
  const params = new URL(req.url).searchParams;
  const backUrl = req.headers.get("referer") ?? "/";
  if (params.has("error")) {
    return {
      error: {
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
      },
      backUrl,
    };
  }
  if (params.has("id")) {
    const { data, status } = await kratosFrontendApi.getFlowError({
      id: params.get("id")!,
    });
    if (status == 200) {
      return { error: data, backUrl };
    } else {
      // TOOD: isAxiosError ? error = response.data.error
      return {
        error: {
          id: "Failed to fetch error details",
          error: {
            code: 500,
          },
        },
        backUrl,
      };
    }
  }

  throw redirect("/");
}

export const handler = jiggleHandler({ GET: getRouteData });
export default function Route(
  { data: { error, backUrl } }: JiggleProps<typeof getRouteData>,
) {
  return (
    <UserErrorCard error={error} title="An error occurred" backUrl={backUrl} />
  );
}
