import { drizzle } from 'drizzle-orm/node-postgres';


export function createDB() {
  try {
    const connectionString = process.env.DATABASE_URL || ''
    const db = drizzle(connectionString);

    console.log("Database and 'rate_limits' table created successfully.");
    return { db };
    // Ensure the rate_limits table exists
  } catch (error) {
    console.error("Error creating database or table:", error);
    throw error; // Re-throw the error for further handling
  }
}