// should implement csrf
import {
  AcceptOAuth2ConsentRequestSession,
  Identity,
  Session,
} from "@ory/client";
import { jiggleHandler, JiggleProps } from "~/lib/jiggle.ts";
import { getSession } from "~/lib/get-session.ts";
import { redirect } from "~/lib/redirect.ts";
import { hydraOauthApi } from "~/lib/ory.server.ts";
import { UserConsentCard } from "@ory/elements-preact";

async function getRouteData(req: Request) {
  const params = new URL(req.url).searchParams;
  // Parses the URL query
  // The challenge is used to fetch information about the consent request from ORY Hydra.
  const consentChallenge = params.get("consent_challenge");

  if (!consentChallenge) {
    throw new Error(
      "Expected a consent challenge to be set but received none.",
    );
  }

  const { data: body } = await hydraOauthApi.getOAuth2ConsentRequest({
    consentChallenge,
  });

  const context = body.context as Session;

  // If a user has granted this application the requested scope, hydra will tell us to not show the UI.
  if (body.skip || body.client?.skip_consent) {
    const grantScope = body.requested_scope || [];
    const session = extractSession(context.identity, grantScope);

    // Now it's time to grant the consent request. You could also deny the request if something went terribly wrong
    const {
      data: { redirect_to },
    } = await hydraOauthApi
      .acceptOAuth2ConsentRequest({
        consentChallenge,
        acceptOAuth2ConsentRequest: {
          // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
          // are requested accidentally.
          grant_scope: grantScope,

          // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
          grant_access_token_audience: body.requested_access_token_audience,

          // The session allows us to set session data for id and access tokens
          session,
        },
      });
    // All we need to do now is to redirect the user back to hydra!
    throw redirect(redirect_to);
  }

  // If consent can't be skipped we MUST show the consent UI.
  return {
    consent: body,
    client_name: body.client?.client_name ||
      body.client?.client_id ||
      "Unknown Client",
    requested_scope: body.requested_scope || [],
    client: body.client,
    action: "consent",
    csrfToken: "TODO", // TODO: csrf token
  };
}

async function postRouteData(req: Request) {
  const form = await req.formData();
  const consentChallenge = form.get("challenge")?.toString();
  const consentAction = form.get("consent_action")?.toString();
  const remember = form.get("remember");
  const grant_scope = form.getAll("grant_scope").map((s) => s.toString());

  if (!consentChallenge) {
    throw new Error("missing challenge in consent action");
  }

  // extractSession only gets the sesseion data from the request
  // You can extract more data from the Ory Identities admin API
  const session = extractSession((await getSession(req)).identity, grant_scope);

  // Let's fetch the consent request again to be able to set `grantAccessTokenAudience` properly.
  // Let's see if the user decided to accept or reject the consent request..
  if (consentAction === "accept") {
    const { data: { requested_access_token_audience } } = await hydraOauthApi
      .getOAuth2ConsentRequest({
        consentChallenge,
      });

    const { data: { redirect_to } } = await hydraOauthApi
      .acceptOAuth2ConsentRequest({
        consentChallenge,
        acceptOAuth2ConsentRequest: {
          // We can grant all scopes that have been requested - hydra already checked for us that no additional scopes
          // are requested accidentally.
          grant_scope,

          // If the environment variable CONFORMITY_FAKE_CLAIMS is set we are assuming that
          // the app is built for the automated OpenID Connect Conformity Test Suite. You
          // can peak inside the code for some ideas, but be aware that all data is fake
          // and this only exists to fake a login system which works in accordance to OpenID Connect.
          //
          // If that variable is not set, the session will be used as-is.
          session: oidcConformityMaybeFakeSession(grant_scope, session),

          // ORY Hydra checks if requested audiences are allowed by the client, so we can simply echo this.
          grant_access_token_audience: requested_access_token_audience,

          // This tells hydra to remember this consent request and allow the same client to request the same
          // scopes from the same user, without showing the UI, in the future.
          remember: Boolean(remember),

          // When this "remember" sesion expires, in seconds. Set this to 0 so it will never expire.
          remember_for: 0,
        },
      });

    // All we need to do now is to redirect the user back!
    return redirect(redirect_to);
  } else {
    // Looks like the consent request was denied by the user
    const { data: { redirect_to } } = await hydraOauthApi
      .rejectOAuth2ConsentRequest({
        consentChallenge,
        rejectOAuth2Request: {
          error: "access_denied",
          error_description: "The resource owner denied the request",
        },
      });
    // All we need to do now is to redirect the browser back to hydra!
    return redirect(redirect_to);
  }
}

export const handler = jiggleHandler({
  GET: getRouteData,
  POST: postRouteData,
});
export default function Route({ data }: JiggleProps<typeof getRouteData>) {
  return (
    <UserConsentCard
      consent={data.consent}
      csrfToken={data.csrfToken}
      // cardImage={data.client?.logo_uri || logoUrl}
      client_name={data.client?.client_name || data.client?.client_id ||
        "Unknown Client"}
      requested_scope={data.requested_scope || []}
      client={data.client}
      action={"consent"}
    />
  );
}

function extractSession(
  identity: Identity | undefined,
  grantScope: string[],
): AcceptOAuth2ConsentRequestSession {
  const session: AcceptOAuth2ConsentRequestSession = {
    access_token: {},
    id_token: {},
  };

  if (!identity) {
    return session;
  }

  if (grantScope.includes("email")) {
    const addresses = identity.verifiable_addresses || [];
    if (addresses.length > 0) {
      const address = addresses[0];
      if (address.via === "email") {
        session.id_token.email = address.value;
        session.id_token.email_verified = address.verified;
      }
    }
  }

  if (grantScope.includes("profile")) {
    if (identity.traits.username) {
      session.id_token.preferred_username = identity.traits.username;
    }

    if (identity.traits.website) {
      session.id_token.website = identity.traits.website;
    }

    if (typeof identity.traits.name === "object") {
      if (identity.traits.name.first) {
        session.id_token.given_name = identity.traits.name.first;
      }
      if (identity.traits.name.last) {
        session.id_token.family_name = identity.traits.name.last;
      }
    } else if (typeof identity.traits.name === "string") {
      session.id_token.name = identity.traits.name;
    }

    if (identity.updated_at) {
      session.id_token.updated_at = Date.parse(identity.updated_at);
    }
  }
  return session;
}

export const oidcConformityMaybeFakeSession = (
  grantScope: string[],
  session: AcceptOAuth2ConsentRequestSession,
): AcceptOAuth2ConsentRequestSession => {
  const idToken: { [key: string]: any } = {};

  // If the email scope was granted, fake the email claims.
  if (grantScope.indexOf("email") > -1) {
    // But only do so if the email was requested!
    idToken.email = "foo@bar.com";
    idToken.email_verified = true;
  }

  // If the phone scope was granted, fake the phone claims.
  if (grantScope.indexOf("phone") > -1) {
    idToken.phone_number = "1337133713371337";
    idToken.phone_number_verified = true;
  }

  // If the profile scope was granted, fake the profile claims.
  if (grantScope.indexOf("profile") > -1) {
    idToken.name = "Foo Bar";
    idToken.given_name = "Foo";
    idToken.family_name = "Bar";
    idToken.website = "https://www.ory.sh";
    idToken.zoneinfo = "Europe/Belrin";
    idToken.birthdate = "1.1.2014";
    idToken.gender = "robot";
    idToken.profile = "https://www.ory.sh";
    idToken.preferred_username = "robot";
    idToken.middle_name = "Baz";
    idToken.locale = "en-US";
    idToken.picture =
      "https://raw.githubusercontent.com/ory/web/master/static/images/favico.png";
    idToken.updated_at = 1604416603;
    idToken.nickname = "foobot";
  }

  // If the address scope was granted, fake the address claims.
  if (grantScope.indexOf("address") > -1) {
    idToken.address = {
      country: "Localhost",
      region: "Intranet",
      street_address: "Local Street 1337",
    };
  }

  return {
    access_token: session.access_token,
    id_token: {
      ...idToken,
      ...session.id_token,
    },
  };
};
