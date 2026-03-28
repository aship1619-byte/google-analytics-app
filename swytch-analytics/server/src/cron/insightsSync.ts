import cron from "node-cron";
import { getPool } from "../plugins/mysql";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Generate Insights for a single property
async function generateInsightsForProperty(propertyId: string, analyticsData: any[]) {
    try {
        const prompt = `
You are an expert Google Analytics data scientist.
I am providing you with the daily metrics for the last 8 days for the property ID: ${propertyId}.
Here is the data (ordered newest to oldest):
${JSON.stringify(analyticsData, null, 2)}

Analyze the trend between the most recent day and the previous 7-day trailing average.
Provide exactly TWO arrays of short, punchy sentences:
1. "insights": Up to 3 positive or neutral observations about traffic trends.
2. "alerts": Up to 2 critical warnings (e.g., if activeUsers dropped by > 15%, bounce_rate spiked, etc). If everything is stable, leave "alerts" empty.

You MUST respond strictly with valid JSON exactly matching this format, with no markdown codeblocks:
{
    "insights": ["...", "..."],
    "alerts": ["..."]
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const rawText = response.text;
        if (!rawText) return null;
        
        const parsed = JSON.parse(rawText);
        return {
            insights: Array.isArray(parsed.insights) ? parsed.insights : [],
            alerts: Array.isArray(parsed.alerts) ? parsed.alerts : []
        };
    } catch (err) {
        console.error(`AI Insight Generation Failed for ${propertyId}:`, err);
        return null;
    }
}

export async function syncInsightsForYesterday() {
    console.log("[CRON] Starting Autonomous AI Insights Engine...");
    
    // The target record date is yesterday
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - 1);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const targetDate = `${yyyy}-${mm}-${dd}`;

    const pool = getPool();
    
    try {
        // Find all unique properties that have data from yesterday
        const [targetRows] = await pool.execute(
            `SELECT DISTINCT property_id FROM daily_analytics WHERE record_date = ?`,
            [targetDate]
        ) as any;

        if (!targetRows.length) {
            console.log("[CRON] No properties found with data for yesterday. Skipping insights.");
            return;
        }

        console.log(`[CRON] Generating AI intelligence for ${targetRows.length} properties...`);

        for (const row of targetRows) {
            const propertyId = row.property_id;

            // Fetch the last 8 days of data to give the AI context
            const [historyRows] = await pool.execute(
                `SELECT record_date, users, sessions, bounce_rate, new_users, avg_session_duration 
                 FROM daily_analytics 
                 WHERE property_id = ? AND record_date <= ?
                 ORDER BY record_date DESC 
                 LIMIT 8`,
                [propertyId, targetDate]
            ) as any;

            if (historyRows.length === 0) continue;

            // Generate AI interpretation
            const intelligence = await generateInsightsForProperty(propertyId, historyRows);
            if (!intelligence) continue;

            const insightsJson = JSON.stringify(intelligence.insights);
            const alertsJson = JSON.stringify(intelligence.alerts);

            // Save straight to the insights_alerts engine
            await pool.execute(
                `INSERT INTO insights_alerts 
                 (property_id, record_date, insights_json, alerts_json) 
                 VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE 
                 insights_json = VALUES(insights_json), 
                 alerts_json = VALUES(alerts_json)`,
                [propertyId, targetDate, insightsJson, alertsJson]
            );

            console.log(`[CRON] Saved AI interpretation for ${propertyId}`);
        }

        console.log("[CRON] Autonomous AI Insights Engine completed successfully.");

    } catch (err) {
        console.error("[CRON] Fatal Error in AI Insights Engine:", err);
    }
}

export function startInsightsCron() {
    console.log("Analytics AI Insights Cron scheduled for 03:00 AM");
    
    // Run at 3:00 AM every night
    cron.schedule("0 3 * * *", () => {
        syncInsightsForYesterday();
    });
}
