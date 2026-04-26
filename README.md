# Mini DSP Platform

A simplified real-time ad platform built for learning distributed systems and frontend performance concepts.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (running)
- Node.js 20+
- npm 10+

## Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|---|---|
| `DB_HOST` | Supabase host e.g. `db.xxx.supabase.co` |
| `DB_PORT` | Postgres port (default: `5432`) |
| `DB_NAME` | Database name (default: `postgres`) |
| `DB_USER` | Database user (default: `postgres`) |
| `DB_PASSWORD` | Database password |
| `REDIS_URL` | Redis connection (default: `redis://localhost:6379`) |
| `KAFKA_BROKER` | Kafka/Redpanda broker (default: `localhost:9092`) |

## Running Locally

### 1. Start infrastructure (Redis + Redpanda)

```bash
cd infra && docker compose up -d
```

### 2. Start the backend

```bash
cd backend && npm run dev
```

Server runs on `http://localhost:3001`.

### 3. Run the Mock SSP (optional)

Simulates an SSP sending OpenRTB bid requests every 2 seconds. Requires the backend to be running.

```bash
cd backend && npm run mock-ssp
```

#### Test the endpoints

```bash
# Health check
curl http://localhost:3001/health

# Send a mock bid request
curl -X POST http://localhost:3001/bid \
  -H "Content-Type: application/json" \
  -d '{
    "id": "req-123",
    "imp": [{ "id": "1", "banner": { "w": 320, "h": 50 } }],
    "device": { "ip": "1.1.1.1", "os": "iOS" },
    "user": { "id": "user-abc" },
    "tmax": 100,
    "at": 1
  }'
```

### 3. Start the frontend

```bash
cd frontend && npm run dev
```

## Architecture

### Hot Path (<100ms)
```
Mock SSP → OpenRTB Bid Request → Bidder API → Redis → Targeting → Scoring → Bid Response
```

### Async Path
```
Impression / Click / Conversion events → Redpanda → Consumers → ClickHouse → Dashboard
```

## Services

| Service | Port | Purpose |
|---|---|---|
| Backend | 3001 | Bidder API, tracking endpoints |
| Frontend | 3000 | Real-time dashboard |
| Redis | 6379 | Hot-path campaign cache |
| Redpanda | 9092 | Event streaming |
| Postgres | Supabase | Campaign data, source of truth |
