import { UiNode, UiNodeInputAttributes } from "@ory/client";

export function UINodeInputHidden(
  { attributes }: { attributes: UiNodeInputAttributes } & UiNode,
) {
  return (
    <input
      name={attributes.name}
      type="hidden"
      value={attributes.value}
      readOnly
    />
  );
}
