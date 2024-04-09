import { kratosFrontendApi } from "~/lib/ory.server.ts";

export function getLogoutUrl(req: Request) {
  return kratosFrontendApi
    .createBrowserLogoutFlow({
      cookie: req.headers.get("cookie") ?? undefined,
    })
    .catch(() => ({ data: { logout_url: "" } }))
    .then((r) => r.data.logout_url ?? "");
}
