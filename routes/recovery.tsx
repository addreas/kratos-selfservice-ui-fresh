import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";

import { kratosFrontendApi } from "~/lib/ory.server.ts";
import { getFlowOrRedirectToInit } from "~/lib/flow.ts";

import { BasicUI } from "~/islands/BasicUI.tsx";

function getRouteData(req: Request) {
  return getFlowOrRedirectToInit(
    req,
    "recovery",
    (id, cookie) => kratosFrontendApi.getRecoveryFlow({ id, cookie }),
    // TODO: login url
  );
}

export const handler = jiggleHandler({ GET: getRouteData });
export default function Route({ data }: JiggleProps<typeof getRouteData>) {
  return (
    <BasicUI
      heading="Recovery"
      ui={data.ui}
      footerLinks={[{
        href: "/",
        text: "Home",
      }]}
    />
  );
}
