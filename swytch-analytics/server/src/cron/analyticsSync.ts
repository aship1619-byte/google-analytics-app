import cron from "node-cron";
import { getPool } from "../plugins/mysql";
import swytchExec from "../swytch/client";

// Get a fresh access token using the securely stored refresh token
async function getAccessToken(refreshToken: string): Promise<string | null> {
    try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID || "",
                client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
                refresh_token: refreshToken,
                grant_type: "refresh_token",
            }).toString()
        });

        if (!response.ok) {
            console.error("Failed to refresh token:", await response.text());
            return null;
        }

        const data = await response.json() as any;
        return data.access_token || null;
    } catch (err) {
        console.error("Token refresh error:", err);
        return null;
    }
}

// Fetch a specific metric breakdown via SwytchCode SDK
async function fetchMetric(propertyId: string, accessToken: string, dimensions: string[], metrics: string[]) {
    const cleanId = propertyId.replace("properties/", "");
    const input = {
        property: `properties/${cleanId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
        body: {
            dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
            dimensions: dimensions.map(d => ({ name: d })),
            metrics: metrics.map(m => ({ name: m }))
        }
    };
    
    try {
        const data = await swytchExec("v1beta.{property}:runreport.create", input) as any;
        
        // Parse the SwytchCode response heavily mimicking ga.ts structures
        const rows = data?.rows || [];
        const labels: string[] = [];
        const values: number[] = [];
        
        for (const row of rows) {
            labels.push(row.dimensionValues?.[0]?.value || "Unknown");
            values.push(Number(row.metricValues?.[0]?.value || 0));
        }
        
        if (labels.length === 0) {
            labels.push("No Data");
            values.push(0);
        }
        
        return { labels, values };
    } catch (err) {
        console.error(`Error fetching ${dimensions} for ${cleanId}:`, err);
        return { labels: ["Error"], values: [0] };
    }
}

// Sync analytics for exactly yesterday
export async function syncAnalyticsForYesterday() {
    console.log("[CRON] Starting Google Analytics nightly sync for yesterday.");
    
    // We look at yesterday's date
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - 1);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const targetDate = `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD format for MySQL

    const pool = getPool();
    
    try {
        const [rows] = await pool.execute(`
            SELECT id, google_refresh_token
            FROM users
            WHERE google_refresh_token IS NOT NULL
        `) as any;

        if (!rows.length) {
            console.log("[CRON] No users with refresh tokens found.");
            return;
        }

        console.log(`[CRON] Found ${rows.length} users configured for sync.`);

        for (const row of rows) {
            const refreshToken = row.google_refresh_token;

            const accessToken = await getAccessToken(refreshToken);
            
            if (!accessToken) {
                console.error(`[CRON] Could not generate access token for user ${row.id}. Skipping.`);
                continue;
            }

            // Fetch all GA properties for this user
            const accountRes = await fetch(
                "https://analyticsadmin.googleapis.com/v1beta/accountSummaries",
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            if (!accountRes.ok) {
                console.error(`[CRON] Failed to fetch account summaries for user ${row.id}.`);
                continue;
            }

            const accountData = await accountRes.json() as any;
            const properties = accountData.accountSummaries?.flatMap((account: any) =>
                (account.propertySummaries || []).map((prop: any) => prop.property)
            ) || [];

            console.log(`[CRON] Found ${properties.length} properties for user ${row.id}.`);

            for (const propertyId of properties) {
                console.log(`[CRON] Processing property: ${propertyId}`);
                
                // 1. Core Metrics (users, sessions, page_views, etc.)
                const coreInput = {
                    property: propertyId.startsWith("properties/") ? propertyId : `properties/${propertyId}`,
                    headers: { Authorization: `Bearer ${accessToken}` },
                    body: {
                        dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
                        metrics: [
                            { name: "activeUsers" },
                            { name: "sessions" },
                            { name: "screenPageViews" },
                            { name: "bounceRate" },
                            { name: "averageSessionDuration" },
                            { name: "newUsers" }
                        ]
                    }
                };
                
                let users = 0, sessions = 0, pageViews = 0, bounceRate = 0, avgSessionDuration = 0, newUsers = 0;
                
                try {
                    const coreData = await swytchExec("v1beta.{property}:runreport.create", coreInput) as any;
                    const metrics = coreData.rows?.[0]?.metricValues || [];
                    users = Number(metrics[0]?.value || 0);
                    sessions = Number(metrics[1]?.value || 0);
                    pageViews = Number(metrics[2]?.value || 0);
                    bounceRate = Number(metrics[3]?.value || 0);
                    avgSessionDuration = Number(metrics[4]?.value || 0);
                    newUsers = Number(metrics[5]?.value || 0);
                } catch (e: any) {
                    console.error(`[CRON] Core metrics failed for ${propertyId}:`, e.message);
                }

                // 2. Fetch specific breakdown datasets
                const sources = await fetchMetric(propertyId, accessToken, ["sessionSource"], ["activeUsers"]);
                const devices = await fetchMetric(propertyId, accessToken, ["deviceCategory"], ["activeUsers"]);
                const pages = await fetchMetric(propertyId, accessToken, ["pagePath"], ["screenPageViews"]);
                const events = await fetchMetric(propertyId, accessToken, ["eventName"], ["eventCount"]);
                const locations = await fetchMetric(propertyId, accessToken, ["city"], ["sessions"]);
                const hourly = await fetchMetric(propertyId, accessToken, ["hour"], ["sessions"]);

                // Total custom actions derived from events
                const customerActions = events.values.reduce((a, b) => a + b, 0);

                // 3. Upsert into daily_analytics
                const query = `
                    INSERT INTO daily_analytics (
                        property_id, 
                        record_date, 
                        users, new_users, sessions, page_views, bounce_rate, 
                        avg_session_duration, customer_actions, 
                        device_data, source_data, page_data, event_data, location_data, hourly_data
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        users = VALUES(users),
                        new_users = VALUES(new_users),
                        sessions = VALUES(sessions),
                        page_views = VALUES(page_views),
                        bounce_rate = VALUES(bounce_rate),
                        avg_session_duration = VALUES(avg_session_duration),
                        customer_actions = VALUES(customer_actions),
                        device_data = VALUES(device_data),
                        source_data = VALUES(source_data),
                        page_data = VALUES(page_data),
                        event_data = VALUES(event_data),
                        location_data = VALUES(location_data),
                        hourly_data = VALUES(hourly_data),
                        updated_at = CURRENT_TIMESTAMP
                `;

                await pool.execute(query, [
                    propertyId, targetDate,
                    users, newUsers, sessions, pageViews, bounceRate,
                    avgSessionDuration, customerActions,
                    JSON.stringify(devices), JSON.stringify(sources), JSON.stringify(pages), JSON.stringify(events), JSON.stringify(locations), JSON.stringify(hourly)
                ]);

                console.log(`[CRON] Successfully synced ${propertyId} for ${targetDate}`);
            }
        }

        console.log("[CRON] Completed nightly Google Analytics sync.");
        
    } catch (err) {
        console.error("[CRON] Nightly sync completely failed:", err);
    }
}

// Start the cron job
export function startAnalyticsCron() {
    // Run exactly at 2:00 AM every day
    cron.schedule("0 2 * * *", () => {
        syncAnalyticsForYesterday().catch(console.error);
    });
    console.log("Analytics nightly cron job scheduled for 02:00 AM");
}
