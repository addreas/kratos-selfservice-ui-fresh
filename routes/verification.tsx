import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";

import { kratosFrontendApi } from "~/lib/ory.server.ts";
import { getFlowOrRedirectToInit } from "~/lib/flow.ts";

import { BasicUI } from "~/islands/BasicUI.tsx";

function getRouteData(req: Request) {
  return getFlowOrRedirectToInit(
    req,
    "verification",
    (id, cookie) => kratosFrontendApi.getVerificationFlow({ id, cookie }),
    // TODO: req.query.messages
    // TODO: registration link
  );
}

export const handler = jiggleHandler({ GET: getRouteData });
export default function Route({ data }: JiggleProps<typeof getRouteData>) {
  return (
    <BasicUI
      heading="Verification"
      ui={data.ui}
      footerLinks={[{
        href: "/",
        text: "Home",
      }]}
    />
  );
}
