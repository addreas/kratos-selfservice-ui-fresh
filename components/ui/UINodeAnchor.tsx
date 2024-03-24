import { UiNode, UiNodeAnchorAttributes } from "@ory/client";
import { Messages } from "~/components/Messages.tsx";

export function UINodeAnchor(
  { attributes, messages }: { attributes: UiNodeAnchorAttributes } & UiNode,
) {
  return (
    <div>
      <a href={attributes.href}>
        {attributes.title.text}
      </a>
      <Messages messages={messages} />
    </div>
  );
}
