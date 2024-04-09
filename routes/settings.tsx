import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";

import { kratosFrontendApi } from "~/lib/ory.server.ts";
import { getFlowOrRedirectToInit } from "~/lib/flow.ts";

import { BasicUI } from "~/islands/BasicUI.tsx";

function getRouteData(req: Request) {
  return getFlowOrRedirectToInit(
    req,
    "settings",
    (id, cookie) => kratosFrontendApi.getSettingsFlow({ id, cookie }),
    // TODO: logout url
    // TODO: back: flow.return_to || url for login flow
  );
}

export const handler = jiggleHandler({ GET: getRouteData });
export default function Route({ data }: JiggleProps<typeof getRouteData>) {
  return (
    <BasicUI
      heading="Settings"
      ui={data.ui}
      footerLinks={[{
        href: "/",
        text: "Home",
      }]}
    />
  );
}
