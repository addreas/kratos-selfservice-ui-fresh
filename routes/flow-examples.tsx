import { UiContainer } from "@ory/client";
import { useSignal } from "@preact/signals";
import { BasicUI } from "~/islands/BasicUI.tsx";

// deno-fmt-ignore
const exampleUis = [
    {"action":"http://localhost:4433/self-service/login?flow=3e885800-8ed5-40eb-a886-0f318b4fdbf5","method":"POST","nodes":[{"type":"input","group":"default","attributes":{"name":"csrf_token","type":"hidden","value":"435Oio6+00n66P1J2HJY/TIYoOY82hC+94O8qRbwmvEAIjmoALID6zsh/Om81IBBHJYcYid7/XXAQkErWZLQIg==","required":true,"disabled":false,"node_type":"input"},"messages":[],"meta":{}},{"type":"input","group":"default","attributes":{"name":"identifier","type":"text","value":"","required":true,"disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"E-Mail","type":"info","context":{"title":"E-Mail"}}}},{"type":"input","group":"password","attributes":{"name":"password","type":"password","required":true,"autocomplete":"current-password","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070001,"text":"Password","type":"info"}}},{"type":"input","group":"password","attributes":{"name":"method","type":"submit","value":"password","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1010001,"text":"Sign in","type":"info"}}}]},
    {"action":"http://localhost:4433/self-service/recovery?flow=d6c5df51-5e60-422f-9dcd-51465ce7403c","method":"POST","nodes":[{"type":"input","group":"default","attributes":{"name":"csrf_token","type":"hidden","value":"mDjETOGmhMHBv/1hyDRaUhetCou11pjbFnRcLrhLZjN7ZLNub6pUYwB2/MGskoLuOSO2D653dRAhtaGs9yks4A==","required":true,"disabled":false,"node_type":"input"},"messages":[],"meta":{}},{"type":"input","group":"code","attributes":{"name":"email","type":"email","required":true,"disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070007,"text":"Email","type":"info"}}},{"type":"input","group":"code","attributes":{"name":"method","type":"submit","value":"code","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070005,"text":"Submit","type":"info"}}}]},
    {"action":"http://localhost:4433/self-service/registration?flow=b2fc7d95-852f-4a9d-9127-975f23054f34","method":"POST","nodes":[{"type":"input","group":"default","attributes":{"name":"csrf_token","type":"hidden","value":"7LH+fxxJlEPCr0MXSUIyV56+K51zb9dkIFfRbtGMXiQP7YldkkVE4QNmQrct5OrrsDCXGWjOOq8Xlizsnu4U9w==","required":true,"disabled":false,"node_type":"input"},"messages":[],"meta":{}},{"type":"input","group":"password","attributes":{"name":"traits.email","type":"email","required":true,"autocomplete":"email","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"E-Mail","type":"info","context":{"title":"E-Mail"}}}},{"type":"input","group":"password","attributes":{"name":"password","type":"password","required":true,"autocomplete":"new-password","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070001,"text":"Password","type":"info"}}},{"type":"input","group":"password","attributes":{"name":"traits.name.first","type":"text","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"First Name","type":"info","context":{"title":"First Name"}}}},{"type":"input","group":"password","attributes":{"name":"traits.name.last","type":"text","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"Last Name","type":"info","context":{"title":"Last Name"}}}},{"type":"input","group":"password","attributes":{"name":"method","type":"submit","value":"password","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1040001,"text":"Sign up","type":"info"}}}]},
    {"action":"http://localhost:4433/self-service/registration?flow=fe012ba7-396d-403c-acca-c391e65d567f","method":"POST","nodes":[{"type":"input","group":"default","attributes":{"name":"csrf_token","type":"hidden","value":"ZxF/uwcTSvbSyMsPExRJPtPYDr8AeAT1NTtS3n/OoPmETQiZiR+aVBMByq93spGC/VayOxvZ6T4C+q9cMKzqKg==","required":true,"disabled":false,"node_type":"input"},"messages":[],"meta":{}},{"type":"input","group":"password","attributes":{"name":"traits.email","type":"email","value":"a@b.se","required":true,"autocomplete":"email","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"E-Mail","type":"info","context":{"title":"E-Mail"}}}},{"type":"input","group":"password","attributes":{"name":"password","type":"password","required":true,"autocomplete":"new-password","disabled":false,"node_type":"input"},"messages":[{"id":4000032,"text":"The password must be at least 8 characters long, but got 4.","type":"error","context":{"actual_length":4,"min_length":8}}],"meta":{"label":{"id":1070001,"text":"Password","type":"info"}}},{"type":"input","group":"password","attributes":{"name":"traits.name.first","type":"text","value":"asdf","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"First Name","type":"info","context":{"title":"First Name"}}}},{"type":"input","group":"password","attributes":{"name":"traits.name.last","type":"text","value":"asdf","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"Last Name","type":"info","context":{"title":"Last Name"}}}},{"type":"input","group":"password","attributes":{"name":"method","type":"submit","value":"password","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1040001,"text":"Sign up","type":"info"}}}]},
    {"action":"http://localhost:4433/self-service/registration?flow=0bf09545-9e58-4545-a23e-0772cc8143ff","method":"POST","nodes":[{"type":"input","group":"default","attributes":{"name":"csrf_token","type":"hidden","value":"eKvd3C/TSpqy5vI4PepYw8Tlndh/etrQS2sYSrFH9iSb96r+od+aOHMv85hZTIB/6mshXGTbNxt8quXI/iW89w==","required":true,"disabled":false,"node_type":"input"},"messages":[],"meta":{}},{"type":"input","group":"password","attributes":{"name":"traits.email","type":"email","value":"a@b.se","required":true,"autocomplete":"email","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"E-Mail","type":"info","context":{"title":"E-Mail"}}}},{"type":"input","group":"password","attributes":{"name":"password","type":"password","required":true,"autocomplete":"new-password","disabled":false,"node_type":"input"},"messages":[{"id":4000034,"text":"The password has been found in data breaches and must no longer be used.","type":"error","context":{"breaches":293142}}],"meta":{"label":{"id":1070001,"text":"Password","type":"info"}}},{"type":"input","group":"password","attributes":{"name":"traits.name.first","type":"text","value":"asdf","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"First Name","type":"info","context":{"title":"First Name"}}}},{"type":"input","group":"password","attributes":{"name":"traits.name.last","type":"text","value":"asdf","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"Last Name","type":"info","context":{"title":"Last Name"}}}},{"type":"input","group":"password","attributes":{"name":"method","type":"submit","value":"password","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1040001,"text":"Sign up","type":"info"}}}]},
    {"action":"http://localhost:4433/self-service/registration?flow=0bf09545-9e58-4545-a23e-0772cc8143ff","method":"POST","nodes":[{"type":"input","group":"default","attributes":{"name":"csrf_token","type":"hidden","value":"eKvd3C/TSpqy5vI4PepYw8Tlndh/etrQS2sYSrFH9iSb96r+od+aOHMv85hZTIB/6mshXGTbNxt8quXI/iW89w==","required":true,"disabled":false,"node_type":"input"},"messages":[],"meta":{}},{"type":"input","group":"password","attributes":{"name":"traits.email","type":"email","value":"a@b.se","required":true,"autocomplete":"email","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"E-Mail","type":"info","context":{"title":"E-Mail"}}}},{"type":"input","group":"password","attributes":{"name":"password","type":"password","required":true,"autocomplete":"new-password","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070001,"text":"Password","type":"info"}}},{"type":"input","group":"password","attributes":{"name":"traits.name.first","type":"text","value":"asdf","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"First Name","type":"info","context":{"title":"First Name"}}}},{"type":"input","group":"password","attributes":{"name":"traits.name.last","type":"text","value":"asdf","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"Last Name","type":"info","context":{"title":"Last Name"}}}},{"type":"input","group":"password","attributes":{"name":"method","type":"submit","value":"password","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1040001,"text":"Sign up","type":"info"}}}],"messages":[{"id":4000007,"text":"An account with the same identifier (email, phone, username, ...) exists already.","type":"error"}]},
    {"action":"http://localhost:4433/self-service/settings?flow=3260a93e-eb58-438c-b6c4-72f41908c747","method":"POST","nodes":[{"type":"input","group":"default","attributes":{"name":"csrf_token","type":"hidden","value":"cCDEDGIv64UTYuimIxf2DegOk8ViZ8JSTvpuvl4uUm1jSJWPfoaF+c+WarKlraKpKH4DBlIq9inOsh4vayF2Kw==","required":true,"disabled":false,"node_type":"input"},"messages":[],"meta":{}},{"type":"input","group":"profile","attributes":{"name":"traits.email","type":"email","value":"ba@b.se","required":true,"autocomplete":"email","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"E-Mail","type":"info","context":{"title":"E-Mail"}}}},{"type":"input","group":"profile","attributes":{"name":"traits.name.first","type":"text","value":"asdf","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"First Name","type":"info","context":{"title":"First Name"}}}},{"type":"input","group":"profile","attributes":{"name":"traits.name.last","type":"text","value":"asdf","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070002,"text":"Last Name","type":"info","context":{"title":"Last Name"}}}},{"type":"input","group":"profile","attributes":{"name":"method","type":"submit","value":"profile","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070003,"text":"Save","type":"info"}}},{"type":"input","group":"password","attributes":{"name":"password","type":"password","required":true,"autocomplete":"new-password","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070001,"text":"Password","type":"info"}}},{"type":"input","group":"password","attributes":{"name":"method","type":"submit","value":"password","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070003,"text":"Save","type":"info"}}},{"type":"input","group":"lookup_secret","attributes":{"name":"lookup_secret_regenerate","type":"submit","value":"true","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1050008,"text":"Generate new backup recovery codes","type":"info"}}},{"type":"img","group":"totp","attributes":{"src":"data:image/png;base64,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","id":"totp_qr","width":256,"height":256,"node_type":"img"},"messages":[],"meta":{"label":{"id":1050005,"text":"Authenticator app QR code","type":"info"}}},{"type":"text","group":"totp","attributes":{"text":{"id":1050006,"text":"UO66NOUFYE5KLHNPFLEPJ42VOECAPFBB","type":"info","context":{"secret":"UO66NOUFYE5KLHNPFLEPJ42VOECAPFBB"}},"id":"totp_secret_key","node_type":"text"},"messages":[],"meta":{"label":{"id":1050017,"text":"This is your authenticator app secret. Use it if you can not scan the QR code.","type":"info"}}},{"type":"input","group":"totp","attributes":{"name":"totp_code","type":"text","required":true,"disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070006,"text":"Verify code","type":"info"}}},{"type":"input","group":"totp","attributes":{"name":"method","type":"submit","value":"totp","disabled":false,"node_type":"input"},"messages":[],"meta":{"label":{"id":1070003,"text":"Save","type":"info"}}}]}
] as UiContainer[]

export default function FlowExamples() {
  return (
    <div class="stack gap-5">
      {exampleUis.map((ui) => (
        <BasicUI
          ui={ui}
          heading="Example"
          footerLinks={[{
            href: "/",
            text: "Home",
          }]}
        />
      ))}
    </div>
  );
}