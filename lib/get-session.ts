import { kratosFrontendApi } from "~/lib/ory.server.ts";

export function getSession(req: Request) {
  return kratosFrontendApi
    .toSession({ cookie: req.headers.get("cookie") ?? undefined })
    .then(({ data }) => data);
}
