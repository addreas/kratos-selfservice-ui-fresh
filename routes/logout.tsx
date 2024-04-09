import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    // const { logout_challenge: logoutChallenge } = req.query

    // if (typeof logoutChallenge !== "string") {
    //   logger.debug("Expected a logout challenge to be set but received none.")
    //   res.redirect("login")
    //   return
    // }

    // const { oauth2, shouldSkipLogoutConsent } = createHelpers(req, res)
    // oauth2
    //   .getOAuth2LogoutRequest({ logoutChallenge })
    //   .then(({ data: body }) => {
    //     if (shouldSkipLogoutConsent(body)) {
    //       return oauth2
    //         .acceptOAuth2LogoutRequest({ logoutChallenge })
    //         .then(({ data: body }) => res.redirect(body.redirect_to))
    //     }

    //     // this should never happen
    //     if (!req.csrfToken) {
    //       logger.warn(
    //         "Expected CSRF token middleware to be set but received none.",
    //       )
    //       next(
    //         new Error(
    //           "Expected CSRF token middleware to be set but received none.",
    //         ),
    //       )
    //       return
    //     }

    //     res.render("logout", {
    //       card: UserLogoutCard({
    //         csrfToken: req.csrfToken(true),
    //         challenge: logoutChallenge,
    //         action: "logout",
    //       }),
    //     })
    //   })
    //   .catch(() => res.redirect("login"))

    return Response.json({ status: "ok" });
  },
  POST(_req, _ctx) {
    //  // The challenge is now a hidden input field, so let's take it from
    // // the request body instead.
    // const { challenge: logoutChallenge, submit } = req.body

    // if (submit === "No") {
    //   logger.debug("User rejected to log out.")
    //   // The user rejected to log out, so we'll redirect to /ui/welcome
    //   return oauth2
    //     .rejectOAuth2LogoutRequest({ logoutChallenge })
    //     .then(() => res.redirect("login"))
    //     .catch(() => res.redirect("login"))
    // } else {
    //   logger.debug("User agreed to log out.")
    //   // The user agreed to log out, let's accept the logout request.
    //   return oauth2
    //     .acceptOAuth2LogoutRequest({ logoutChallenge })
    //     .then(({ data: body }) => res.redirect(body.redirect_to))
    //     .catch(() => res.redirect("login"))
    // }

    return Response.json({ status: "ok" });
  },
};
