// should implement csrf
import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";
import { getLogoutUrl } from "~/lib/logout-url.ts";
import { getSession } from "~/lib/get-session.ts";

async function getRouteData(req: Request) {
  // Create a logout URL
  const logoutUrl = await getLogoutUrl(req);
  const session = await getSession(req); // todo: maybeinit2fa?

  const identityCredentialTrait = session?.identity?.traits.email ||
    session?.identity?.traits.username ||
    "";

  const sessionText = identityCredentialTrait !== ""
    ? ` and you are currently logged in as ${identityCredentialTrait} `
    : "";

  const host = req.headers.get(
    "host",
  );
  return {
    sessionInfoText: ({
      children:
        `Your browser holds an active Ory Session for ${host}${sessionText}- changing properties inside Acount Settings will be reflected in the decoded Ory Session.`,
      size: "small",
      color: "foregroundMuted",
    }),
    traits: {
      id: session?.identity?.id,
      // sometimes the identity schema could contain recursive objects
      // for this use case we will just stringify the object instead of recursively flatten the object
      ...Object.entries(session?.identity?.traits).reduce<Record<string, any>>(
        (traits, [key, value]) => {
          traits[key] = typeof value === "object"
            ? JSON.stringify(value)
            : value;
          return traits;
        },
        {},
      ),
      "signup date": session?.identity?.created_at || "",
      "authentication level": session?.authenticator_assurance_level === "aal2"
        ? "two-factor used (aal2)"
        : "single-factor used (aal1)",
      ...(session?.expires_at && {
        "session expires at": new Date(session?.expires_at).toUTCString(),
      }),
      ...(session?.authenticated_at && {
        "session authenticated at": new Date(
          session?.authenticated_at,
        ).toUTCString(),
      }),
    },
    // map the session's authentication level to a human readable string
    // this produces a list of objects
    authMethods: session?.authentication_methods?.reduce<any>(
      (methods, method, i) => {
        methods.push({
          [`authentication method used`]: `${method.method} (${
            method.completed_at && new Date(method.completed_at).toUTCString()
          })`,
        });
        return methods;
      },
      [],
    ),
    sessionCodeBox: ({
      className: "session-code-box",
      children: JSON.stringify(session, null, 2),
    }),
    nav: ({
      session,
      logoutUrl,
      selectedLink: "sessions",
    }),
  };
}

export const handler = jiggleHandler({ GET: getRouteData });
export default function Route({ data }: JiggleProps<typeof getRouteData>) {
  return (
    <div class="spacing-32">
      <div class="spacing-32">
        {
          //typography "Session Information" "headline37" "foregroundDefault"
        }
        {
          //sessionInfoText
        }
      </div>

      <div class="spacing-32-horizontal wrap-content">
        {
          //sessionCodeBox
        }
        <div class="spacing-8 traits-box">
          {
            //#each traits
          }
          <div class="spacing-8">
            {
              //typography @key "monoCaption" "foregroundDefault" "bold"
            }
            {
              //typography this "monoCaption" "foregroundDefault"
            }
            {
              //divider true "traits-box-divider"
            }
          </div>
          {
            ///each
          }
          {
            //#each authMethods
          }
          {
            //#each this
          }
          <div class="spacing-8">
            {
              //typography @key "monoCaption" "foregroundDefault" "bold"
            }
            {
              //typography this "monoCaption" "foregroundDefault"
            }
            {
              //divider true "traits-box-divider"
            }
          </div>
          {
            ///each
          }
          {
            ///each
          }
        </div>
      </div>

      {
        //divider false "divider-left"
      }

      {
        /* <script type="application/javascript">
  // Get the current breakpoint
  const getBreakpoint = function () {
    return window.getComputedStyle(document.body, ':before').content.replace(/\"/g, '');
  };

  const setSessionCodeBoxCollapse = function () {
    const breakpoint = getBreakpoint();
    const codeBoxInput = document.getElementsByClassName("session-code-box")[0].getElementsByTagName("input")[0]
    if (breakpoint === "small") {
      codeBoxInput.checked = true;
    } else {
      codeBoxInput.checked = false;
    }
  }

  window.addEventListener('load', function () {
    setSessionCodeBoxCollapse();
  }, false);

  // Recalculate breakpoint on resize
  window.addEventListener('resize', function () {
    setSessionCodeBoxCollapse();
  }, false);

</script> */
      }
    </div>
  );
}
