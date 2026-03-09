/**
 * SwytchCode CLI integration utilities.
 * Used for communicating with the SwytchCode backend services.
 */

const SWYTCH_API_BASE = process.env.NEXT_PUBLIC_SWYTCH_API_URL || "";

/**
 * Make an authenticated request to the Swytch API.
 */
export async function swytchFetch(
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> {
    const url = `${SWYTCH_API_BASE}${endpoint}`;
    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
}

/**
 * Fetch analytics data via SwytchCode.
 */
export async function fetchSwytchAnalytics(propertyId: string) {
    // TODO: Implement actual API call
    const res = await swytchFetch(`/analytics/${propertyId}`);
    if (!res.ok) throw new Error("Failed to fetch Swytch analytics");
    return res.json();
}
