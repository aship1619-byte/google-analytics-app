import "dotenv/config";
import { syncAnalyticsForYesterday } from "./cron/analyticsSync";
import { syncInsightsForYesterday } from "./cron/insightsSync";

async function run() {
    console.log("=== STEP 1: Fetching Raw GA Data ===");
    await syncAnalyticsForYesterday();
    
    console.log("=== STEP 2: Running AI Intelligence ===");
    await syncInsightsForYesterday();
    
    process.exit(0);
}

run();
