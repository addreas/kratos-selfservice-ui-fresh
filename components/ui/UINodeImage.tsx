import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode, UiNodeImageAttributes } from "@ory/client";

export function UINodeImage(
  props: { attributes: UiNodeImageAttributes } & UiNode,
) {
  const { attributes } = props;
  return (
    <div class="flex items-center justify-center">
      <img
        src={attributes.src}
        width={attributes.width}
        height={attributes.height}
        alt={getNodeLabel(props)}
      />
    </div>
  );
}
