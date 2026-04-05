const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
// In .env: NEXT_PUBLIC_API_URL=https://statsy.in/api
// Result: all calls go to https://statsy.in/api/<path>

export async function apiRequest(
    path: string,
    options?: RequestInit
): Promise<Response> {
    if (path.startsWith("/api")) {
        console.warn(`[api.ts] Warning: path "${path}" starts with /api — this will cause a double /api/ URL.`);
    }

    const res = await fetch(`${BASE}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options?.headers ?? {}),
        },
        ...options,
    });
    return res;
}
