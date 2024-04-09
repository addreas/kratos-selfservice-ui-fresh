import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";

import { kratosFrontendApi } from "~/lib/ory.server.ts";
import {
  getFlowOrRedirectToInit,
  getUrlForFlowPropagated,
} from "~/lib/flow.ts";

import { UserAuthCard } from "@ory/elements-preact";

async function getRouteData(req: Request) {
  const flow = await getFlowOrRedirectToInit(
    req,
    "recovery",
    (id, cookie) => kratosFrontendApi.getRecoveryFlow({ id, cookie }),
  );

  const loginURL = getUrlForFlowPropagated(req, "login");

  return {
    flow,
    loginURL,
  };
}

export const handler = jiggleHandler({ GET: getRouteData });
export default function Route(
  { data: { flow, loginURL } }: JiggleProps<typeof getRouteData>,
) {
  return (
    <UserAuthCard
      flow={flow}
      flowType="recovery"
      additionalProps={{ loginURL }}
    />
  );
}
