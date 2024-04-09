import { UiNode } from "@ory/client";
import { useScriptNodes } from "@ory/elements-preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function ScriptNodes({ nodes }: { nodes: UiNode[] }) {
  if (IS_BROWSER) {
    useScriptNodes({ nodes });
  }
  return null;
}
