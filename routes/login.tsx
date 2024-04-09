import { UserAuthCard } from "@ory/elements-preact";
import { LoginFlow } from "@ory/client";

import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";

import {
  getUrlForFlow,
  kratosBrowserUrl,
  kratosFrontendApi,
} from "~/lib/ory.server.ts";
import {
  getFlowOrRedirectToInit,
  getUrlForFlowPropagated,
} from "~/lib/flow.ts";
import { getLogoutUrl } from "~/lib/logout-url.ts";
import { redirect } from "~/lib/redirect.ts";
import { ScriptNodes } from "~/islands/ScriptNodes.tsx";

async function getLogin(req: Request) {
  const flow = await getFlowOrRedirectToInit(
    req,
    "login",
    (id, cookie) => kratosFrontendApi.getLoginFlow({ id, cookie }),
    ["aal", "refresh", "return_to", "organization", "via", "login_challenge"],
  );

  if (flow.ui.messages && flow.ui.messages.length > 0) {
    // the login requires that the user verifies their email address before logging in
    if (flow.ui.messages.some(({ id }) => id === 4000010)) {
      // we will create a new verification flow and redirect the user to the verification page
      throw redirectToVerificationFlow(req, flow);
    }
  }

  return {
    flow,
    signupURL: getUrlForFlowPropagated(req, "registration", [
      "return_to",
    ], {
      login_challenge: flow.oauth2_login_request?.challenge,
    }),
    forgotPasswordURL: !flow.refresh
      ? getUrlForFlowPropagated(req, "recovery")
      : "",
    logoutURL: flow.requested_aal === "aal2" || flow.refresh
      ? await getLogoutUrl(req)
      : "",
  };
}

export const handler = jiggleHandler({ GET: getLogin });
export default function Login(
  { data: { flow, forgotPasswordURL, signupURL, logoutURL } }: JiggleProps<
    typeof getLogin
  >,
) {
  return (
    <>
      <UserAuthCard
        flow={flow}
        flowType="login"
        additionalProps={{
          forgotPasswordURL,
          signupURL,
          logoutURL,
        }}
      />
      <ScriptNodes nodes={flow.ui.nodes} />
    </>
  );
}

async function redirectToVerificationFlow(req: Request, loginFlow: LoginFlow) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const return_to = params.get("return_to") ?? loginFlow.return_to ?? "";
  try {
    // we will create a new verification flow and redirect the user to the verification page
    const { headers, data: verificationFlow } = await kratosFrontendApi
      .createBrowserVerificationFlow({ returnTo: return_to });

    const res = new Response(null, { status: 303 });

    // we need the csrf cookie from the verification flow
    if (headers["set-cookie"]) {
      res.headers.set("set-cookie", headers["set-cookie"][0]);
    }
    // encode the verification flow id in the query parameters
    const verificationParameters = new URLSearchParams({
      flow: verificationFlow.id,
      message: JSON.stringify(loginFlow.ui.messages),
    });

    const baseUrl = url.pathname.split("/");
    // get rid of the last part of the path (e.g. "login")
    baseUrl.pop();

    url.pathname = baseUrl.join("/") + "/verification";
    url.search = verificationParameters.toString();

    res.headers.set("location", url.toString());

    // redirect to the verification page with the custom message
    return res;
  } catch {
    return getUrlForFlow(
      kratosBrowserUrl,
      "verification",
      new URLSearchParams({ return_to }),
    );
  }
}
