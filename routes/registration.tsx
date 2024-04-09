import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";

import { kratosFrontendApi } from "~/lib/ory.server.ts";
import {
  getFlowOrRedirectToInit,
  getUrlForFlowPropagated,
} from "~/lib/flow.ts";

import { UserAuthCard } from "@ory/elements-preact";
import { ScriptNodes } from "~/islands/ScriptNodes.tsx";

async function getRouteData(req: Request) {
  const flow = await getFlowOrRedirectToInit(
    req,
    "registration",
    (id, cookie) => kratosFrontendApi.getRegistrationFlow({ id, cookie }),
    [
      "return_to",
      "organization",
      "after_verification_return_to",
      "login_challenge",
    ],
  );

  const loginURL = getUrlForFlowPropagated(req, "login", ["return_to"], {
    login_challenge: flow.oauth2_login_request?.challenge,
  });

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
    <>
      <UserAuthCard
        flow={flow}
        flowType="registration"
        additionalProps={{ loginURL }}
      />
      <ScriptNodes nodes={flow.ui.nodes} />
    </>
  );
}
