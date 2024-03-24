import { ComponentChild } from "preact";
import {
  filterNodesByGroups,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  isUiNodeTextAttributes,
} from "@ory/integrations/ui";
import { UiContainer, UiNode, UiNodeInputAttributes } from "@ory/client";
import { UINodeAnchor } from "../components/ui/UINodeAnchor.tsx";
import { UINodeImage } from "../components/ui/UINodeImage.tsx";
import { UINodeInputButton } from "../components/ui/UINodeInputButton.tsx";
import { UINodeInputCheckbox } from "../components/ui/UINodeInputCheckbox.tsx";
import { UINodeInputDefault } from "../components/ui/UINodeInputDefault.tsx";
import { UINodeInputHidden } from "../components/ui/UINodeInputHidden.tsx";
import { UINodeInputTotp } from "../components/ui/UINodeInputTotp.tsx";
import { UINodeScript } from "../components/ui/UINodeScript.tsx";
import { UINodeText } from "../components/ui/UINodeText.tsx";
import { UINodeInputPassword } from "../components/ui/UINodeInputPassword.tsx";

export function UIForm({
  ui,
  groups,
  showEmpty,
}: {
  ui: UiContainer;
  groups?: string[];
  showEmpty?: boolean;
}) {
  const filteredNodes = filterNodesByGroups({
    nodes: ui.nodes,
    groups,
    withoutDefaultGroup: true,
  });

  const exists = filteredNodes.length > 0;
  if (!exists && !showEmpty) {
    return null;
  }

  const groupedNodes = Object.values(groupBy(filteredNodes, (n) => n.group));

  return (
    <div class="stack gap-3">
      {groupedNodes.map((nodes, i) => (
        <form key={i} action={ui.action} method={ui.method}>
          <div class="stack gap-3">
            {ui.nodes
              .filter((n) =>
                n.group === "default"
              )
              .map((node) => <UINode key={getKey(node)} node={node} />)}
            {nodes.map((node) => <UINode key={getKey(node)} node={node} />)}
          </div>
        </form>
      ))}
    </div>
  );
}

function getKey({ attributes }: UiNode) {
  if (isUiNodeAnchorAttributes(attributes)) {
    return attributes.id;
  } else if (isUiNodeImageAttributes(attributes)) {
    return attributes.id;
  } else if (isUiNodeInputAttributes(attributes)) {
    return attributes.name;
  } else if (isUiNodeScriptAttributes(attributes)) {
    return attributes.id;
  } else if (isUiNodeTextAttributes(attributes)) {
    return attributes.id;
  }
}

function UINode({ node: { attributes, ...rest } }: { node: UiNode }) {
  if (isUiNodeAnchorAttributes(attributes)) {
    return <UINodeAnchor attributes={attributes} {...rest} />;
  } else if (isUiNodeImageAttributes(attributes)) {
    return <UINodeImage attributes={attributes} {...rest} />;
  } else if (isUiNodeInputAttributes(attributes)) {
    return (
      <UINodeInput key={attributes.name} attributes={attributes} {...rest} />
    );
  } else if (isUiNodeScriptAttributes(attributes)) {
    return <UINodeScript attributes={attributes} {...rest} />;
  } else if (isUiNodeTextAttributes(attributes)) {
    return <UINodeText attributes={attributes} {...rest} />;
  }

  return <UINodeInputDefault attributes={attributes} {...rest} />;
}

function UINodeInput(props: { attributes: UiNodeInputAttributes } & UiNode) {
  const key = props.attributes.name;

  if (
    props.attributes.name === "totp_code" &&
    props.attributes.node_type === "input" &&
    props.attributes.type === "text"
  ) {
    return <UINodeInputTotp key={key} {...props} />;
  }

  switch (props.attributes.type) {
    case "hidden":
      return <UINodeInputHidden key={key} {...props} />;
    case "submit":
      return <UINodeInputButton key={key} {...props} />;
    case "button":
      return <UINodeInputButton key={key} {...props} />;
    case "checkbox":
      return <UINodeInputCheckbox key={key} {...props} />;
    case "password":
      return <UINodeInputPassword key={key} {...props} />;
    default: {
      return <UINodeInputDefault key={key} {...props} />;
    }
  }
}

export function groupBy<T, K extends string>(
  array: readonly T[],
  getter: (item: T) => K,
): Record<K, T[]> {
  return (array ?? []).reduce(
    (draftGroups, currentItem) => {
      const key = getter(currentItem);
      draftGroups[key] ??= [];
      draftGroups[key]!.push(currentItem);
      return draftGroups;
    },
    {} as Record<K, T[]>,
  );
}
