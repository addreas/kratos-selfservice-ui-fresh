import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode, UiNodeInputAttributes } from "@ory/client";
import { useEffect } from "preact/hooks";
import { Messages } from "~/components/Messages.tsx";
import { Required } from "~/components/Required.tsx";
import { useSignal, useSignalEffect } from "@preact/signals";
// import { PinInput } from "~/components/zag/PinInput.tsx";

export function UINodeInputTotp(
  props: { attributes: UiNodeInputAttributes } & UiNode,
) {
  const { attributes, messages } = props;

  const value = useSignal("");

  const interactiveMode = useSignal(false);

  useSignalEffect(() => {
    interactiveMode.value = true;
  });

  return (
    <div>
      <label>
        {getNodeLabel(props)}
        {interactiveMode.value
          ? (
            <>
              {
                // <PinInput count={6} otp onValueChange={v => value.value = v} />
              }

              <input
                type="hidden"
                name={attributes.name}
                id={attributes.name}
                value={value.value}
                placeholder={getNodeLabel(props)}
              />
            </>
          )
          : (
            <input
              type="number"
              maxLength={6}
              auto-complete="one-time-code"
              name={attributes.name}
              id={attributes.name}
              placeholder={getNodeLabel(props)}
            />
          )}
        <Required required={attributes.required} />
      </label>
      <Messages messages={messages} />
    </div>
  );
}
