import { Database } from "bun:sqlite";
import { readFileSync } from "fs";

export function createDB() {
  const DB_PATH = Bun.env.DB_FILE_PATH || "./db.sqlite";

  // Read the schema from the SQL file
  const schemaSql = readFileSync("./db/schema.sql", "utf-8");

  // Initialize the database connection globally.
  // This ensures the database is opened once when the app starts.
  let db: Database;

  try {
    db = new Database(DB_PATH);
    console.log(`Database opened successfully at: ${DB_PATH}`);

    // Use the schema from the file
    db.run(schemaSql);
    console.log("Table 'rate_limits' schema ensured.");
    return { db }; // Return the database instance for further use
  } catch (error) {
    console.error("Failed to initialize database:", error);
    // Exit the process if the database cannot be initialized
    process.exit(1);
  }
}
