import { UiNode, UiNodeScriptAttributes } from "@ory/client";
import { JSX } from "preact/jsx-runtime";

export function UINodeScript({
  attributes,
}: { attributes: UiNodeScriptAttributes } & UiNode) {
  return (
    <script
      src={attributes.src}
      type={attributes.type}
      integrity={attributes.integrity}
      referrerpolicy={attributes.referrerpolicy as any}
      crossOrigin={attributes.crossorigin}
      async={attributes.async}
    />
  );
}
