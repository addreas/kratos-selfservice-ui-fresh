import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode, UiNodeInputAttributes } from "@ory/client";
import { Messages } from "~/components/Messages.tsx";
import { Required } from "~/components/Required.tsx";
import { useEffect, useRef, useState } from "preact/hooks";
import { FormField } from "~/components/FormField.tsx";

export function UINodeInputPassword(
  props: { attributes: UiNodeInputAttributes } & UiNode,
) {
  const { attributes, messages } = props;
  const [visible, setVisible] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.disabled = false;
    }
  });

  return (
    <FormField
      label={getNodeLabel(props)}
      required={attributes.required}
      messages={messages}
    >
      {(inputProps) => (
        <div class="hstack gap-3">
          <input
            {...inputProps}
            name={attributes.name}
            type={visible ? "text" : "password"}
            disabled={attributes.disabled}
            placeholder={getNodeLabel(props)}
          />
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setVisible(!visible)}
            disabled
            class="bg-transparent "
          >
            <div hidden={visible} class={`p-3 i-carbon-view`} />
            <div hidden={!visible} class={`p-3 i-carbon-view-off`} />
          </button>
        </div>
      )}
    </FormField>
  );
}
