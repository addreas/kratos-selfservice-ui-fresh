import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";

import { kratosFrontendApi } from "~/lib/ory.server.ts";
import {
  getFlowOrRedirectToInit,
  getUrlForFlowPropagated,
} from "~/lib/flow.ts";

import { UiText } from "@ory/client";
import { UserAuthCard } from "@ory/elements-preact";

async function getRouteData(req: Request) {
  const flow = await getFlowOrRedirectToInit(
    req,
    "verification",
    (id, cookie) => kratosFrontendApi.getVerificationFlow({ id, cookie }),
  );

  // check for custom messages in the query string
  const params = new URL(req.url).searchParams;
  if (params.has("message")) {
    const m: UiText[] = JSON.parse(params.get("message") as string);

    // add them to the flow data so they can be rendered by the UI
    flow.ui.messages = [...(flow.ui.messages || []), ...m];
  }
  const initRegistrationUrl = getUrlForFlowPropagated(req, "registration");

  return {
    flow,
    initRegistrationUrl,
  };
}

export const handler = jiggleHandler({ GET: getRouteData });
export default function Route(
  { data: { flow, initRegistrationUrl } }: JiggleProps<typeof getRouteData>,
) {
  return (
    <UserAuthCard
      flow={flow}
      flowType="verification"
      additionalProps={{ signupURL: initRegistrationUrl }}
    />
  );
}
