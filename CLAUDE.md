# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

If you ever start going too fast or skipping explanations, slow down and ask me how deep I want to go.

---

## Project Goal

A **Mini DSP (Demand-Side Platform)** learning project inspired by real-time ad systems like The Trade Desk. The purpose is NOT just to build features — it is to:

- Learn **distributed systems concepts** through implementation
- Learn **frontend performance + architecture** (React)
- Prepare for a **Lead / Sr Staff Frontend interview**

---

## How To Work With Me

This is critical — follow this every step:

1. Explain what we are building
2. Explain why it matters (architecture + real-world context)
3. Generate code
4. Explain key files
5. Provide test instructions
6. Add an **"Interview Talking Point"**
7. **Ask before moving to the next step**

Do NOT generate the full system at once. Work step-by-step. Prioritize understanding over speed.

---

## System Architecture

### Hot Path — Real-Time Bidding (<100ms end-to-end)

```
Traffic Source (Mock SSP)
  → OpenRTB Bid Request (JSON)
  → 2.1 Ingress: API Gateway + Request Validator
  → 2.2 Request Enrichment: IP→Geo, Device, User/Identity, Context
  → 2.3 Candidate Generation: Targeting Engine (Geo, Device, Audience, Dayparting, Brand Safety, Budget/Pacing) → Top-N Campaigns
  → 2.4 Scoring: CTR / CVR / Value / Viewability predictions (Feature Store: Redis)
  → 2.5 Auction Engine: Bid Shading → Floor Price → First-Price Auction → Select Winner
  → 2.6 Ad Response Builder: OpenRTB Bid Response (Ad Creative + Price + Tracking URLs)
  → Output to SSP / Ad Exchange
```

### Async Path — Event & Measurement

```
Impression / Click / Conversion / Viewability events (Beacons / Pixels / SDKs)
  → Kafka / Redpanda (stream ingestion)
  → Real-time Processing (consumers)
  → ClickHouse (analytics) + S3/MinIO (raw data lake)
  → Reporting & Attribution API
  → Frontend Dashboard
```

### Build Phases (follow in order)

| Phase | What |
|---|---|
| 1 | OpenRTB Parser & Mock SSP |
| 2 | Real-time Bidding API (no ML) |
| 3 | Campaign Targeting & Rules Engine |
| 4 | ML Scoring — CTR model with sample data |
| 5 | Event Tracking (Impression / Click) |
| 6 | Attribution & Reporting (Click → Conversion) |
| 7 | UI / Dashboard |

### Planned Repo Structure

```
backend/     — bidder service, tracking endpoints, attribution worker, reporting API
frontend/    — Next.js dashboard (metrics, charts, campaign table)
shared/      — TypeScript types, OpenRTB models
infra/       — docker-compose (Postgres, Redis, Kafka/Redpanda)
```

---

## Tech Stack

**Backend:** Node.js + TypeScript, Express or Fastify, Redis, Kafka/Redpanda, PostgreSQL, ClickHouse

**Frontend:** Next.js, React, TypeScript, React Query, charting library (TBD)

**Infra:** Docker, MinIO (S3-compatible), Redpanda (Kafka-compatible)

---

## Commands

```bash
# Install all workspace dependencies (run from root)
npm install

# Infra — start Redis + Redpanda
cd infra && docker compose up -d

# Backend — dev server on port 3001 (reads ../.env via dotenv_config_path)
cd backend && npm run dev

# Mock SSP — sends OpenRTB bid requests every 2s (backend must be running)
cd backend && npm run mock-ssp

# Frontend — dev server on port 3000 (not built yet)
cd frontend && npm run dev
```

---

## Backend Concepts To Teach As We Build

- Hot path vs async path — why DB calls are avoided in real-time bidding
- Redis caching — cache-aside pattern, TTL
- Kafka — producers, consumers, topics, consumer groups
- Event-driven architecture — idempotency, eventual consistency
- Attribution logic — last-touch vs multi-touch
- Budget counters — atomic Redis INCR for spend tracking
- Observability — structured logging, latency histograms

---

## Frontend Concepts To Teach As We Build (HIGH PRIORITY)

Tie everything to Staff-level thinking:

- Why React components re-render — referential equality, render batching
- State vs server state — React Query as the boundary
- Memoization — useMemo/useCallback tradeoffs (cost of over-memoizing)
- useEffect pitfalls — stale closures, missing deps, cleanup
- Large list performance — virtualization (why rendering 10k rows kills the browser)
- Chart performance — canvas vs SVG tradeoffs
- Polling vs WebSockets — when each is appropriate
- Event loop — why long tasks block the main thread
- Reflow/repaint — layout thrashing and how to avoid it
- Component architecture — co-location, state boundaries, lifting state

---

## Interview Talking Points (Running List)

Add to this as we build:

| Concept | Talking Point |
|---|---|
| Redis | "Keep hot-path data in-memory to meet sub-10ms latency constraints" |
| Kafka | "Decouples ingestion from processing — producers don't wait for consumers" |
| React Query | "Separates server state from UI state; handles caching, deduplication, and background refetching" |
| Virtualization | "Prevents rendering thousands of DOM nodes — only visible rows exist in the DOM" |
| Cache-aside pattern | "Load campaigns from Postgres into Redis at startup, serve from memory during auctions — Postgres is never touched on the hot path" |
| OpenRTB | "Industry-standard protocol between SSPs and DSPs — decouples them behind a contract so either side can swap implementations" |
| Targeting engine | "Pure function — campaign + bid request in, boolean out. No I/O, independently testable, runs millions of times per second" |
| Scoring / pCTR | "Bid price = expected value, not a flat CPM. EV = pCTR × pCVR × advertiser's CPA goal. ML model predicts pCTR from a feature vector" |
| LRU vs TTL eviction | "LRU evicts least recently used — good for access-pattern-based caching. TTL evicts on schedule — better for data that goes stale on time, like campaign config" |
| Redpanda vs Kafka | "Redpanda is Kafka-compatible, no JVM, no Zookeeper — same client API, operationally simpler for dev. Swap broker address in prod, zero code changes" |
