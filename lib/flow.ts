import { getUrlForFlow, kratosBrowserUrl } from "./ory.server.ts";

// TODO: https://github.com/ory/kratos-selfservice-ui-node/blob/153b6516497456b376ea5c24e6bfe023c965a982/src/pkg/middleware.ts

export async function getFlowOrRedirectToInit<T>(
  request: Request,
  name: string,
  flowGetter: (flow: string, cookie: string) => Promise<{ data: T }>,
  propagate: string[] = ["return_to"],
): Promise<T> {
  const params = new URL(request.url).searchParams;
  const flow = params.get("flow");

  const initFlowUrl = getUrlForFlowPropagated(request, name, propagate);
  const initFlowResponse = Response.redirect(initFlowUrl, 303);

  if (!flow) {
    throw initFlowResponse;
  } else {
    try {
      const { data } = await flowGetter(flow, request.headers.get("Cookie")!);

      return data;
    } catch (e: any) {
      if (
        e.response &&
        (e.response.status === 404 ||
          e.response.status === 410 ||
          e.response.status === 403)
      ) {
        throw initFlowResponse;
      }

      throw e;
    }
  }
}

export function getUrlForFlowPropagated(
  request: Request,
  name: string,
  propagate: string[] = ["return_to"],
  extra?: Record<string, string | undefined>,
) {
  const params = new URL(request.url).searchParams;

  return getUrlForFlow(
    kratosBrowserUrl,
    name,
    new URLSearchParams(
      [
        ...[...params.entries()].filter(([key, _]) => propagate.includes(key)),
        ...Object.entries(extra ?? {}).filter(([_, value]) => !!value) as any,
      ],
    ),
  );
}
