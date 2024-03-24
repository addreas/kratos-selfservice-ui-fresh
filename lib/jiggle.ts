import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";

export async function jiggle<S, T>(
  req: Request,
  ctx: FreshContext<S, T>,
  getRouteData: (req: Request) => Promise<T>,
) {
  try {
    const data = await getRouteData(req);
    return ctx.render(data);
  } catch (e) {
    if (e instanceof Response) {
      return e;
    } else {
      throw e;
    }
  }
}

export function jiggleHandler<T>(
  getter: (req: Request) => Promise<T>,
): Handlers<T> {
  return {
    GET(req, ctx) {
      return jiggle(req, ctx, getter);
    },
  };
}

export type JiggleProps<T extends (...args: any) => any> = PageProps<
  Awaited<ReturnType<T>>
>;
