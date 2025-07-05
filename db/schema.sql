-- Schema for storing rate limit data
CREATE TABLE IF NOT EXISTS rate_limits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,          -- Stores the ISO string timestamp (e.g., '2023-10-27T10:00:00.000Z')
    limit_name TEXT NOT NULL,         -- Name of the rate limit (e.g., 'DailyDurableStreamingApiEvents')
    maximum INTEGER NOT NULL,             -- Maximum allowed value for the limit
    remaining INTEGER NOT NULL,       -- Remaining value for the limit
    in_use INTEGER NOT NULL,              -- in_use value as a decimal (e.g., 0.15 for 15%)
    in_use_percent REAL NOT NULL       -- in_use_percent percentage as a decimal (e.g., 0.85 for 85%)
);

-- Optional: Index on timestamp for faster time-based queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_timestamp ON rate_limits (timestamp);

-- Optional: Index on limit_name for faster lookups by limit type
CREATE INDEX IF NOT EXISTS idx_rate_limits_limit_name ON rate_limits (limit_name);
