import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode, UiNodeInputAttributes } from "@ory/client";
import { Messages } from "../Messages.tsx";
import { Required } from "../Required.tsx";
import { FormField } from "~/components/FormField.tsx";

export function UINodeInputDefault(
  props: { attributes: UiNodeInputAttributes } & UiNode,
) {
  const { attributes, messages } = props;
  return (
    <FormField
      label={getNodeLabel(props)}
      required={attributes.required}
      messages={messages}
    >
      {(inputProps) => (
        <input
          {...inputProps}
          name={attributes.name}
          type={attributes.type}
          disabled={attributes.disabled}
          placeholder={getNodeLabel(props)}
        />
      )}
    </FormField>
  );
}
