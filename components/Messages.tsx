import { UiText, UiTextTypeEnum } from "@ory/client";
import { ComponentProps } from "preact";

function alertColor(status: UiTextTypeEnum) {
  switch (status) {
    case "error":
      return "red";
    case "info":
      return "blue";
    case "success":
      return "green";
  }
}

function alertIcon(status: UiTextTypeEnum) {
  switch (status) {
    case "error":
      return "carbon-warning-filled";
    case "info":
      return "carbon-information-filled";
    case "success":
      return "carbon-checkmark-filled";
  }
}

function Alert({
  children,
  status,
  class: cls,
}: { status: UiTextTypeEnum } & ComponentProps<"div">) {
  const color = alertColor(status);
  const icon = alertIcon(status);
  return (
    <div
      role="alert"
      class={`flex p-3 bg-${color}-100 w-full items-center relative overflow-hidden border-none rounded-md ${cls}`}
    >
      <span class="w-5 h-6 mr-3 ">
        <div
          class={`i-${icon} inline-block w-5 h-5 align-middle bg-${color}-500`}
        />
      </span>
      {children}
    </div>
  );
}

export function Messages({
  messages,
  alertClass,
}: {
  messages?: UiText[];
  alertClass?: string;
}) {
  if (!messages || !messages.length) return null;

  return (
    <div class="stack gap-3">
      {messages.map((m) => (
        <Alert status={m.type} class={alertClass}>
          {m.text}
        </Alert>
      ))}
    </div>
  );
}

/*
{
  "id": 1010004,
  "text": "Please complete the second authentication challenge.",
  "type": "info",
  "context": {}
}

{
  "id": 4000006,
  "text": "The provided credentials are invalid, check for spelling mistakes in your password or username, email address, or phone number.",
  "type": "error",
  "context": {}
}

{
  "id": 1010003,
  "text": "Please confirm this action by verifying that it is you.",
  "type": "info",
  "context": {}
}

{
  "id": 4000005,
  "text": "The password can not be used because the password is too similar to the user identifier.",
  "type": "error",
  "context": {
    "reason": "the password is too similar to the user identifier"
  }
}

{
  "id": 4000005,
  "text": "The password can not be used because password length must be at least 8 characters but only got 4.",
  "type": "error",
  "context": {
    "reason": "password length must be at least 8 characters but only got 4"
  }
}
*/
