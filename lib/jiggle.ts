import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { KnownMethod } from "$fresh/src/server/router.ts";

export function jiggleWithInit<T>(data: T, init?: ResponseInit) {
  return new JiggleRouteData(data, init);
}

class JiggleRouteData<T> {
  data: T;
  init?: ResponseInit;
  constructor(data: T, init?: ResponseInit) {
    this.data = data;
    this.init = init;
  }
}

export function jiggleHandler<T>(
  things: {
    [K in KnownMethod]?: (
      req: Request,
      ctx: FreshContext,
    ) => Promise<Response | T>;
  },
): Handlers<T> {
  return Object.fromEntries(
    Object.entries(things).map((
      [method, handler],
    ) => [method, async (req, ctx) => {
      try {
        const data = await handler(req, ctx);
        if (data instanceof Response) {
          return data;
        } else if (data instanceof JiggleRouteData) {
          return ctx.render(data.data, data.init);
        } else {
          return ctx.render(data);
        }
      } catch (e) {
        if (e instanceof Response) {
          return e;
        } else {
          throw e;
        }
      }
    }]),
  );
}

export type JiggleProps<T extends (...args: any) => any> = PageProps<
  Awaited<ReturnType<T>>
>;
