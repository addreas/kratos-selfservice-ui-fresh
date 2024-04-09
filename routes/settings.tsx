import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";

import { kratosFrontendApi } from "~/lib/ory.server.ts";
import { getLogoutUrl } from "~/lib/logout-url.ts";
import {
  getFlowOrRedirectToInit,
  getUrlForFlowPropagated,
} from "~/lib/flow.ts";

import { UserSettingsScreen } from "@ory/elements-preact";
import { ScriptNodes } from "~/islands/ScriptNodes.tsx";

async function getRouteData(req: Request) {
  const flow = await getFlowOrRedirectToInit(
    req,
    "settings",
    (id, cookie) => kratosFrontendApi.getSettingsFlow({ id, cookie }),
  );
  return {
    flow,
    logoutUrl: await getLogoutUrl(req),
    backUrl: flow.return_to || getUrlForFlowPropagated(req, "login"),
  };
}

export const handler = jiggleHandler({ GET: getRouteData });
export default function Route(
  { data: { flow, logoutUrl, backUrl } }: JiggleProps<typeof getRouteData>,
) {
  return (
    <>
      <UserSettingsScreen.Nav
        flow={flow}
        logoutUrl={logoutUrl}
        backUrl={backUrl}
      />
      <UserSettingsScreen.Body
        flow={flow}
      />
      <ScriptNodes nodes={flow.ui.nodes} />
    </>
  );
}
