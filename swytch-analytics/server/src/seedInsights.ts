import "dotenv/config";
import { getPool } from "./plugins/mysql";

async function run() {
    const pool = getPool();
    const insightsJson = JSON.stringify([
        "Traffic is stabilizing perfectly after the weekend.", 
        "Direct visitors increased by 14% compared to the trailing 7-day average.", 
        "Desktop engagement duration is extremely healthy."
    ]);
    const alertsJson = JSON.stringify([
        "Resource Anomalies Detected: Mobile bounce rate spiked above 60% yesterday.", 
        "Warning: A sharp 12% decline in Active Users observed in the last 24 hours."
    ]);
    
    // Inject it for ALL actively linked properties so the UI fully surfaces the components
    const [rows]: any = await pool.execute(`SELECT DISTINCT property_id FROM daily_analytics`);
    
    for (const row of rows) {
        const cleanId = row.property_id.replace("properties/", "");
        await pool.execute(
            `INSERT INTO insights_alerts (property_id, record_date, insights_json, alerts_json) 
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE insights_json=VALUES(insights_json), alerts_json=VALUES(alerts_json)`,
            [cleanId, new Date().toISOString().split('T')[0], insightsJson, alertsJson]
        );
    }
    console.log("Mock testing matrix injected perfectly.");
    process.exit(0);
}

run();
