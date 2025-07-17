CREATE TABLE "rate_limits" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"limit_name" text NOT NULL,
	"maximum" integer NOT NULL,
	"remaining" integer NOT NULL,
	"in_use" real NOT NULL,
	"in_use_percent" real NOT NULL
);
