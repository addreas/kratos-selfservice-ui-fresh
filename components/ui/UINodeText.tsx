import { getNodeLabel } from "@ory/integrations/ui";
import { UiNode, UiNodeTextAttributes } from "@ory/client";

export function UINodeText(
  props: { attributes: UiNodeTextAttributes } & UiNode,
) {
  return (
    <div class="stack gap-3">
      <span>{getNodeLabel(props)}</span>
      <Content {...props} />
    </div>
  );
}

// TODO: where are these defined? in the kratos identity.schema.json?
const LOOKUP_SECRET_TEXT_ID = 1050015;
const LOOKUP_SECRET_USED_ID = 1050014;

function Content({
  attributes,
}: { attributes: UiNodeTextAttributes } & UiNode) {
  switch (attributes.text.id) {
    case LOOKUP_SECRET_TEXT_ID:
      return <LookupSecret {...(attributes.text.context as any)} />;
    default:
      return (
        <code class="p-4 border-solid rounded-md">
          {attributes.text.text}
        </code>
      );
  }
}

function LookupSecret({
  secrets,
}: {
  secrets: Array<{ id: number; text: string }>;
}) {
  const extraClasses = (used: boolean) => used ? "line-through" : "";
  return (
    <div class="flex flex-wrap gap-3">
      {secrets.map((secret) => (
        <div
          class={"p-1 bg-gray-200 rounded-md font-mono" +
            extraClasses(secret.id === LOOKUP_SECRET_USED_ID)}
        >
          {secret.text}
        </div>
      ))}
    </div>
  );
}
