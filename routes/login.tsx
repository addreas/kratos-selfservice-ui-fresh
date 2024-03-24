import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";

import { getUrlForFlow, kratosFrontendApi } from "~/lib/ory.server.ts";
import { kratosBrowserUrl } from "~/lib/ory.server.ts";
import { getFlowOrRedirectToInit } from "~/lib/flow.ts";

import { UIForm } from "../islands/UIForm.tsx";
import { Messages } from "~/components/Messages.tsx";

async function getLogin(req: Request) {
  const login = await getFlowOrRedirectToInit(
    req,
    "login",
    (id, cookie) => kratosFrontendApi.getLoginFlow({ id, cookie }),
  );

  const return_to = (
    new URL(req.url).searchParams.get("return_to") ?? ""
  ).toString();

  const registerUrl = getUrlForFlow(
    kratosBrowserUrl,
    "registration",
    new URLSearchParams({ return_to }),
  );

  const partiallyAuthenticated = login.refresh ||
    login.requested_aal === "aal2";

  const logoutUrl = (await kratosFrontendApi
    .createBrowserLogoutFlow({ cookie: req.headers.get("Cookie")! })
    .then((r) => r.data.logout_url)
    .catch(() => "")) ?? "";

  return {
    ...login,
    partiallyAuthenticated,
    registerUrl,
    logoutUrl,
  };
}

export const handler = jiggleHandler(getLogin);
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

        {data.partiallyAuthenticated
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
              <a class="font-size-sm color-white" href="/recovery">
                Recover lost credentials
              </a>
            </div>
          )}
      </div>
    </div>
  );
}
