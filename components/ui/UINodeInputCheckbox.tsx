import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode, UiNodeInputAttributes } from "@ory/client";
import { FormField } from "~/components/FormField.tsx";

export function UINodeInputCheckbox(
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
          type="checkbox"
          name={attributes.name}
          disabled={attributes.disabled}
          value="true"
          defaultChecked
        />
      )}
    </FormField>
  );
}
