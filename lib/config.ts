
import { cleanEnv, url, str, host } from "https://deno.land/x/envalid@0.1.2/mod.ts";

export const env = cleanEnv(Deno.env.toObject(), {
  KRATOS_PUBLIC_URL: url({ default: "http://localhost:4433" }),
  KRATOS_BROWSER_URL: url({ default: "http://localhost:4433" }),
  HYDRA_ADMIN_URL: url({ default: "http://localhost:4445" }),
  COOKIE_SECRET: str({ default: "s3cret1" }),
  COOKIE_DOMAIN: host({ default: undefined }),
});
