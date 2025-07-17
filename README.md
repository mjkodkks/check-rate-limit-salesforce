# check-rate-limit-salesforce

## Prerequisites

- [Bun](https://bun.sh/) v1.2.18+ (for local development)
- [Docker](https://docs.docker.com/get-docker/) (for containerized deployment)
- Raspberry Pi 4 (Bookworm, ARM64) for Docker deployment

## Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd check-rate-limit-salesforce
   ```

2. **Configure environment variables:**
   - Copy `.env` and update values as needed:
     ```
     SALESFORCE_INSTANCE_URL="https://your-instance.salesforce.com"
     ACCESS_TOKEN="your-access-token"
     DB_FILE_PATH="./db.sqlite"
     ```

3. **Install dependencies (for local development):**
   ```bash
   bun install
   ```

## Running Locally

```bash
bun run index.ts
```

## Running with Docker (Raspberry Pi 4, Bookworm)

1. **Build the Docker image:**
   ```bash
   docker build -t check-rate-limit-salesforce .
   ```

2. **Run the container:**
   ```bash
   docker run --env-file .env -p 3000:3000 check-rate-limit-salesforce
   ```

   - To persist the SQLite database, mount a volume:
     ```bash
     docker run --env-file .env -v $(pwd)/db.sqlite:/app/db.sqlite -p 3000:3000 check-rate-limit-salesforce
     ```

## Endpoints

- `GET /data` — Get the latest Salesforce limits data from the database.
- `GET /fetch-now` — Manually trigger a fetch from Salesforce and save to the database.
- `GET /health` — Health check endpoint.
- `GET /download-csv` - Manually Download all of record to .csv file

---

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.