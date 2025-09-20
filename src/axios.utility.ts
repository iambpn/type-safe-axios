export function buildUrl<U extends string>(url: U, params?: Record<string, string | number>): string {
  let out = url as string;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      out = out.replace(`:${k}`, encodeURIComponent(String(v)));
    }
  }
  return out;
}
