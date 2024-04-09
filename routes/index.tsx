import md5 from "https://esm.sh/md5@2.3.0";

import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";

import { getUserFullName } from "~/lib/user.server.ts";
import { redirect } from "~/lib/redirect.ts";
import { getSession } from "~/lib/get-session.ts";
import { getLogoutUrl } from "~/lib/logout-url.ts";

async function getIndexData(req: Request) {
  const logoutUrl = await getLogoutUrl(req).catch((e) => {
    console.error("kratos error, redirecting to login");
    throw redirect("/login");
  });

  const userInfo = await getSession(req).catch((e) => {
    console.error("session error, redirecting to login");
    throw redirect("/login");
  });

  const userId = userInfo.identity?.verifiable_addresses?.[0]?.value ?? null;
  const gravatarHash = userId ? md5(userId.toLowerCase()) : null;

  return {
    logoutUrl,
    userInfo,
    gravatarHash,
    userId,
    userFullName: await getUserFullName(userInfo),
  };
}

export const handler = jiggleHandler({ GET: getIndexData });
export default function Index({ data }: JiggleProps<typeof getIndexData>) {
  const { logoutUrl, userInfo, gravatarHash, userFullName } = data;
  return (
    <div class="container max-w-screen-xl">
      <div class="vstack gap-5">
        <img
          src={gravatarHash
            ? `https://www.gravatar.com/avatar/${gravatarHash}.jpg`
            : ""}
          alt={userFullName ?? ""}
          title="Change your avatar on gravatar.com"
          class="w-10 h-10 mx-auto rounded-full"
        />

        <h1 class="color-white text-center text-xl">Welcome, {userFullName}</h1>

        <div class="container p-6 max-w-screen-xl bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
          <div class="stack gap-5">
            <h2 class="text-xl font-thin">Account settings</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              <MenuItem
                icon="fa-user"
                // href="/settings/profile"
                href="/settings/#profile"
                label="User profile"
              />
              <MenuItem
                icon="fa-rotate-right"
                // href="/settings/password"
                href="/settings/#password"
                label="Change password"
              />
              <MenuItem
                icon="fa-qrcode"
                // href="/settings/2fa"
                href="/settings/#2fa"
                label="Manage 2FA"
              />
              <MenuItem
                icon="fa-ellipsis-h"
                // href="/settings/other"
                href="/settings/#other"
                label="Other settings"
              />
            </div>
          </div>
        </div>

        <div class="container p-6 max-w-screen-xl bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
          <div class="stack gap-5">
            <a role="button" href="/flow-examples">
              Flow examples
            </a>
            <a role="button" href="/settings/verification">
              Verify account
            </a>
            <a role="button" href={logoutUrl}>
              Logout
            </a>
          </div>

          <h2>Session information</h2>
          <div class="p-4 bg-gray-50 overflow-auto max-w-full">
            <code class=" whitespace-pre">
              {JSON.stringify(userInfo, null, 2)}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  href,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <div class="py-3 rounded-md hover:bg-gray-400/10 relative">
      <div class="vstack gap-3 text-center">
        <div class={`i-${icon} h-10 w-10 inline-block align-middle mx-auto`}>
        </div>
        <div>
          <a href={href}>
            <span class="absolute inset-0"></span>
            {label}
          </a>
        </div>
      </div>
    </div>
  );
}
