export function redirect(location: string, status = 302) {
  const res = new Response(null, {
    headers: { location },
    status,
  });
  return res;
}
