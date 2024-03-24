import { ComponentChild } from "preact";
import { UiContainer } from "@ory/client";
import { Messages } from "~/components/Messages.tsx";
import { UIForm } from "./UIForm.tsx";

export function BasicUI({
  ui,
  heading,
  footerLinks,
}: {
  ui: UiContainer;
  heading: string;
  footerLinks: { href: string; text: string }[];
}) {
  return (
    <div class="container">
      <div class="stack gap-5">
        <div class="container py-7 rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <div class="stack gap-3">
            <h1 class="text-2xl font-700">
              {heading}
            </h1>
            <Messages messages={ui.messages} />
            <UIForm ui={ui} />
          </div>
        </div>
        <div class="flex w-full justify-between font-size-sm text-white">
          {footerLinks.map(({ href, text }) => <a href={href}>{text}</a>)}
        </div>
      </div>
    </div>
  );
}
