import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";

import { kratosFrontendApi } from "~/lib/ory.server.ts";
import { getFlowOrRedirectToInit } from "~/lib/flow.ts";

import { BasicUI } from "~/islands/BasicUI.tsx";

function getRouteData(req: Request) {
  return getFlowOrRedirectToInit(
    req,
    "registration",
    (id, cookie) =>
      kratosFrontendApi.getRegistrationFlow({ id, cookie }).then((flow) => {
        // const initLoginQuery = new URLSearchParams({
        //   return_to:
        //     (return_to && return_to.toString()) || flow.return_to || "",
        // })
        // if (flow.oauth2_login_request?.challenge) {
        //   initLoginQuery.set(
        //     "login_challenge",
        //     flow.oauth2_login_request.challenge,
        //   )
        // }
        // loginURL = getUrlForFlow(
        //   kratosBrowserUrl,
        //   "login",
        //   initLoginQuery,
        // ),

        return flow;
      }),
    [
      "return_to",
      "organization",
      "after_verification_return_to",
      "login_challenge",
    ],
  );
}

export const handler = jiggleHandler({ GET: getRouteData });
export default function Route({ data }: JiggleProps<typeof getRouteData>) {
  return (
    <BasicUI
      heading="Create an account"
      ui={data.ui}
      footerLinks={[{
        href: "/",
        text: "Home",
      }]}
    />
  );
}
