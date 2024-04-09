import { redirect } from "~/lib/redirect.ts";
import { hydraOauthApi } from "~/lib/ory.server.ts";
import { UserLogoutCard } from "@ory/elements-preact";
import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";

async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  if (!params.has("logout_challenge")) {
    throw redirect("/login");
  }

  const logoutChallenge = params.get("logout_challenge")!;

  const { data: body } = await hydraOauthApi.getOAuth2LogoutRequest({
    logoutChallenge,
  });

  if ((body.client as any).skip_logout_consent) {
    throw hydraOauthApi
      .acceptOAuth2LogoutRequest({ logoutChallenge })
      .then(({ data: body }) => redirect(body.redirect_to));
  }

  return {
    csrfToken: "TODO", // TODO
    challenge: logoutChallenge,
    action: "logout",
  };
}

async function POST(req: Request) {
  const body = await req.formData();
  const logoutChallenge = body.get("challenge") as string;
  const submit = body.get("submit");

  if (submit === "No") {
    return hydraOauthApi
      .rejectOAuth2LogoutRequest({ logoutChallenge })
      .then(() => redirect("/login"))
      .catch(() => redirect("/login"));
  } else {
    return hydraOauthApi
      .acceptOAuth2LogoutRequest({ logoutChallenge })
      .then(({ data: body }) => redirect(body.redirect_to))
      .catch(() => redirect("/login"));
  }
}

export const handler = jiggleHandler({ GET, POST });
export default function Login(
  { data: { csrfToken, challenge, action } }: JiggleProps<
    typeof GET
  >,
) {
  return (
    <UserLogoutCard
      challenge={challenge}
      action={action}
      csrfToken={csrfToken}
    />
  );
}
