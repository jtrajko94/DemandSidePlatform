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
| `DATABASE_URL` | Supabase Postgres connection string |
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
