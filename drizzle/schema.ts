
import { pgTable, serial, timestamp, integer, real, text } from "drizzle-orm/pg-core";

export const rateLimits = pgTable('rate_limits', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(), // better for ISO strings
  limitName: text('limit_name').notNull(),
  maximum: integer('maximum').notNull(),
  remaining: integer('remaining').notNull(),
  inUse: real('in_use').notNull(),         // float-type number
  inUsePercent: real('in_use_percent').notNull(), // percent as float
});
