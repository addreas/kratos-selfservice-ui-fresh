import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";

import { getUrlForFlow, kratosFrontendApi } from "~/lib/ory.server.ts";
import { kratosBrowserUrl } from "~/lib/ory.server.ts";
import { getFlowOrRedirectToInit } from "~/lib/flow.ts";

import { UIForm } from "~/islands/UIForm.tsx";
import { Messages } from "~/components/Messages.tsx";
import { getUrlForFlowPropagated } from "~/lib/flow.ts";
import { getLogoutUrl } from "~/lib/logout-url.ts";

async function getLogin(req: Request) {
  const login = await getFlowOrRedirectToInit(
    req,
    "login",
    (id, cookie) => kratosFrontendApi.getLoginFlow({ id, cookie }),
    ["aal", "refresh", "return_to", "organization", "via", "login_challenge"],
  );

  if (login.ui.messages && login.ui.messages.length > 0) {
    // the login requires that the user verifies their email address before logging in
    if (login.ui.messages.some(({ id }) => id === 4000010)) {
      // we will create a new verification flow and redirect the user to the verification page
      // todo:
      // return redirectToVerificationFlow(flow);
    }
  }

  const partialAuth = login.refresh || login.requested_aal === "aal2";

  return {
    ...login,
    partialAuth,
    registerUrl: getUrlForFlowPropagated(req, "registration", ["return_to"], {
      login_challenge: login.oauth2_login_request?.challenge,
    }),
    recoveryUrl: login.refresh ? "" : getUrlForFlowPropagated(req, "recovery"),
    logoutUrl: await getLogoutUrl(req),
  };
}

export const handler = jiggleHandler({ GET: getLogin });
export default function Login({ data }: JiggleProps<typeof getLogin>) {
  return (
    <div class="container">
      <div class="stack gap-5">
        <div class="container py-7 px-6 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
          <div class="stack gap-3">
            <h1>
              {data.refresh
                ? "Confirm Action"
                : data.requested_aal === "aal2"
                ? "Two-Factor Authentication"
                : "Sign In"}
            </h1>

            <Messages
              messages={data.ui.messages!}
              alertClass="font-size-xs"
            />

            <UIForm
              ui={data.ui}
              groups={[
                "password",
                "oidc",
                "code",
                "totp",
                "lookup_secret",
                "webauthn",
              ]}
            />

            <hr />
          </div>
        </div>

        {data.partialAuth
          ? (
            <div class="text-center">
              <a
                class="font-size-sm color-white"
                href={data.logoutUrl ?? ""}
              >
                Log out
              </a>
            </div>
          )
          : (
            <div class="flex w-full justify-between">
              <a
                class="font-size-sm color-white"
                href={data.registerUrl ?? ""}
              >
                Sign up
              </a>
              <a class="font-size-sm color-white" href={data.recoveryUrl ?? ""}>
                Recover lost credentials
              </a>
            </div>
          )}
      </div>
    </div>
  );
}

function redirectToVerificationFlow(loginFlow: LoginFlow) {
  // we will create a new verification flow and redirect the user to the verification page
  kratosFrontendApi
    .createBrowserVerificationFlow({
      returnTo: (return_to && return_to.toString()) || loginFlow.return_to ||
        "",
    })
    .then(({ headers, data: verificationFlow }) => {
      // we need the csrf cookie from the verification flow
      if (headers["set-cookie"]) {
        res.setHeader("set-cookie", headers["set-cookie"]);
      }
      // encode the verification flow id in the query parameters
      const verificationParameters = new URLSearchParams({
        flow: verificationFlow.id,
        message: JSON.stringify(loginFlow.ui.messages),
      });

      const baseUrl = req.path.split("/");
      // get rid of the last part of the path (e.g. "login")
      baseUrl.pop();

      // redirect to the verification page with the custom message
      res.redirect(
        303,
        // join the base url with the verification path
        path.join(
          req.baseUrl,
          "verification?" + verificationParameters.toString(),
        ),
      );
    })
    .catch(
      redirectOnSoftError(
        res,
        next,
        getUrlForFlow(
          kratosBrowserUrl,
          "verification",
          new URLSearchParams({
            return_to: (return_to && return_to.toString()) ||
              loginFlow.return_to ||
              "",
          }),
        ),
      ),
    );
}
