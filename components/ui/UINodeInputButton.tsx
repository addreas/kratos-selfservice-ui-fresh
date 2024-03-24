import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode, UiNodeInputAttributes } from "@ory/client";
import { Messages } from "~/components/Messages.tsx";

export function UINodeInputButton(
  props: { attributes: UiNodeInputAttributes } & UiNode,
) {
  const { attributes, messages } = props;
  return (
    <div class="stack gap-3">
      <div>
        <button
          class="inline-flex relative appearance-none items-center justify-center align-middle whitespace-nowrap select-none outline-none rounded-md font-semibold px-4 bg-green-500 h-10 w-full color-white"
          name={attributes.name}
          type={attributes.type as "button" | "submit" | "reset"}
          value={attributes.value}
          disabled={attributes.disabled}
          onClick={() => attributes.onclick && eval(attributes.onclick)}
        >
          {getNodeLabel(props)}
        </button>
      </div>
      <Messages messages={messages} />
    </div>
  );
}
