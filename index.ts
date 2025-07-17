import { Database } from 'bun:sqlite';
import { Elysia, t } from 'elysia';
import { cron, Patterns } from '@elysiajs/cron'
import type { Limit, RateLimit, SalesforceLimits } from './types';
import { createDB } from './drizzle/createDB';
import { rateLimits } from './drizzle/schema'; 
import { desc } from 'drizzle-orm';
// const DB_PATH = Bun.env.DB_FILE_PATH || './db.sqlite';
const SALESFORCE_INSTANCE_URL = Bun.env.SALESFORCE_INSTANCE_URL;
const ACCESS_TOKEN = Bun.env.ACCESS_TOKEN;

if (!SALESFORCE_INSTANCE_URL || !ACCESS_TOKEN) {
    console.error("Please provide SALESFORCE_INSTANCE_URL and ACCESS_TOKEN in your .env file.");
    process.exit(1); 
}

const MAXIMUM_RETRIES = 2; // Maximum number of retries for the cron job
let retry = 0; // Current retry count

function checkRetryLimit() {
    console.log(`Current retry count: ${retry}`);
    if (retry >= MAXIMUM_RETRIES) {
        console.error(`Maximum retry limit reached (${MAXIMUM_RETRIES}). Stopping further attempts.`);
        return true; // Stop further retries
    }
    return false; // Continue retrying
}

const { db } = createDB();

// const insertStmt = db.prepare(`
//     INSERT INTO rate_limits (timestamp, limit_name, maximum, remaining, in_use, in_use_percent)
//     VALUES (?, ?, ?, ?, ?, ?)
// `);

// ฟังก์ชันสำหรับดึงข้อมูล Limits จาก Salesforce
async function fetchSalesforceLimits() {
    try {
        const response = await fetch(`${SALESFORCE_INSTANCE_URL}/services/data/v63.0/limits`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error fetching data: ${response.status} ${response.statusText} - ${errorBody}`);
        }

        const limitsData = await response.json() as SalesforceLimits;
        const dailyDurableStreamingEvents = limitsData.DailyDurableStreamingApiEvents;

        if (!dailyDurableStreamingEvents) {
             throw new Error("'DailyDurableStreamingApiEvents' not found in the API response.");
        }

        const maximum = dailyDurableStreamingEvents.Max
        const remaining = dailyDurableStreamingEvents.Remaining
        const inUse = maximum - remaining
        const inUsePercent = inUse > 0 ? (inUse / maximum) * 100 : (maximum + remaining) / maximum * 100;

        const dataToSave = {
            timestamp: new Date(),
            limitName: 'DailyDurableStreamingApiEvents',
            maximum,
            remaining,
            inUse,
            inUsePercent
        };

        //  const result = insertStmt.run(
        //     dataToSave.timestamp,
        //     dataToSave.limitName,
        //     dataToSave.maximum,
        //     dataToSave.remaining,
        //     dataToSave.inUse,
        //     dataToSave.inUsePercent
        // );

        await db.insert(rateLimits).values({
            timestamp: dataToSave.timestamp,
            limitName: dataToSave.limitName,
            maximum: dataToSave.maximum,
            remaining: dataToSave.remaining,
            inUse: dataToSave.inUse,
            inUsePercent: dataToSave.inUsePercent
        })

        console.log('Successfully fetched and saved Salesforce limits data to DB:', dataToSave);
        return dataToSave;

    } catch (error) {
        console.error('Error in fetchSalesforceLimits:', error);
        return { error: (error as Error).message };
    }
}

const app = new Elysia()
    .use(
        cron({
            name: 'fetch.salesforce.limits',
            pattern: Patterns.EVERY_30_MINUTES,
            async run() {
                console.log('Cron job triggered: Fetching Salesforce limits...');
                if (checkRetryLimit()) {
                    console.error("Stopping further attempts due to retry limit.");
                    return; // Stop further retries
                }
                try {
                    const result = await fetchSalesforceLimits();
                    retry = 0; // Reset retry count on successful fetch
                } catch (error) {
                    console.error('Error during cron job execution:', error);
                    if (retry < MAXIMUM_RETRIES) {
                        retry++;
                        console.log(`Retrying... (${retry}/${MAXIMUM_RETRIES})`);
                    }
                }
            }, // Set to true to pause the cron job
        })
    )
    .get('/data', async ({ set }) => {
        // Endpoint data SQLite
        try {
            // Query the database for the latest entry
            // const latestData = db.query("SELECT * FROM rate_limits ORDER BY timestamp DESC LIMIT 1").get();
            // drizzle query
            const latestData = await db.select().from(rateLimits).orderBy(rateLimits.timestamp).limit(1);

            if (latestData.length > 0) {
                return latestData;
            } else {
                console.log("No data found in DB, fetching initial data...");
                return await fetchSalesforceLimits();
            }
        } catch (error) {
            console.error("Error reading data from DB:", error);
            set.status = 500;
            if (retry < MAXIMUM_RETRIES) {
                retry++;
                console.log(`Retrying... (${retry}/${MAXIMUM_RETRIES})`);
            }
            return { error: (error as Error).message };
        }
    })
    // manual trigger endpoint
    .get('/fetch-now', async ({ set }) => {
        console.log("Manual trigger: Fetching Salesforce limits...");
        const result = await fetchSalesforceLimits();
        if (result && 'error' in result) {
            set.status = 500;``
        }
        return result;
    })

    .get('/health', async () => {
        // const latestData = db.query("SELECT id, timestamp, limit_name FROM rate_limits ORDER BY timestamp DESC LIMIT 1").get(); // Check DB connection
        // drizzle query
        const latestData = await db.select().from(rateLimits).orderBy(rateLimits.timestamp).limit(1);
        console.log("Health check: Database connection is active.");
        return { status: 'ok', timestamp: new Date().toISOString(), latestData };
    })

    .get('/download-csv', async ({ set, status }) => {
        console.log("Download CSV endpoint called");
        // const stmt = db.query("SELECT * FROM rate_limits ORDER BY timestamp DESC");
        // drizzle query
        const data: RateLimit[] = await db.select().from(rateLimits).orderBy(desc(rateLimits.timestamp));
        if (data.length === 0 || data === undefined) {
            set.status = 404;
            return { error: "No data available to download." };
        }
        const dataIndexHeaders = data[0]
        if (!dataIndexHeaders) {
            set.status = 404;
            return { error: "No data available to download." };
        }
        const headers = Object.keys(dataIndexHeaders).join(',');
        const csvContent = [headers, ...data.map(row => Object.values(row).join(','))].join('\n');
        set.headers['Content-Disposition'] = 'attachment; filename="rate_limits.csv"';
        set.headers['Content-Type'] = 'text/csv';
        console.log("CSV download initiated.");

        return csvContent;
    })
    .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);


// Graceful shutdown: Close the database connection when the process exits
process.on('beforeExit', async () => {
    if (db && db.$client) {
        await db.$client.end();
        console.log("Database connection closed gracefully.");
    }
});

process.on('SIGINT', () => {
    console.log("SIGINT received. Closing database and exiting.");
    process.exit(0); // Exit gracefully
});