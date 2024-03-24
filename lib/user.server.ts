import { Session } from "@ory/client";
import { z } from "https://esm.sh/zod@3.22.4";

const nameType = z.object({ name: z.string() });
const firstLastNameType = z.object({
  name: z.object({ first: z.string(), last: z.string() }),
});

export async function getUserFullName(session: Session) {
  const traits: unknown = session.identity?.traits;

  const parsedName = nameType.safeParse(traits);
  if (parsedName.success) {
    return parsedName.data.name;
  }

  const parsedFirstLastName = firstLastNameType.safeParse(traits);
  if (parsedFirstLastName.success) {
    return [
      parsedFirstLastName.data.name.first,
      parsedFirstLastName.data.name.last,
    ]
      .filter((x) => !!x)
      .join(" ");
  }

  const firstEmail = session.identity?.verifiable_addresses?.[0]?.value;
  if (firstEmail) {
    return firstEmail;
  }

  return session.identity?.id;
}
