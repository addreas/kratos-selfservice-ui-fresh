import { useId } from "preact/hooks";
import { UiText } from "@ory/client";
import { Messages } from "~/components/Messages.tsx";
import { ComponentProps, VNode } from "preact";

type FormFieldProps = {
  label: string;
  required?: boolean;
  messages?: UiText[];
  children: (props: ComponentProps<"input">) => VNode;
};

export function FormField(
  { label, required, children, messages }: FormFieldProps,
) {
  const id = useId();
  return (
    <div role="group" class="w-full relative">
      <label for={id} id={id + "-label"} class="block font-medium mb-2">
        {label}
        {required && (
          <span
            role="presentation"
            aria-hidden="true"
            class="color-red-500 mx-1"
          >
            *
          </span>
        )}
      </label>
      {children({
        id: id,
        class:
          "relative appearance-none border rounded-md px-4 h-10 w-full bg-inherit outline-none" +
          "focus-visible:shadow-sm focus-visible:shadow-blue focus-visible:border-blue",
        "aria-required": required,
        "aria-describedby": id + "-helptext",
      })}
      <div id={id + "-helptext"} class="mt-2 text-sm text-gray-600">
        <Messages messages={messages} />
      </div>
    </div>
  );
}
