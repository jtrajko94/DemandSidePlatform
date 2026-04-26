import { BidRequest, BidResponse, AuctionType } from "@dsp/shared";

const BIDDER_URL = "http://localhost:3001/bid";
const INTERVAL_MS = 2000;

const AD_SIZES = [
  { w: 320, h: 50 },   // mobile banner
  { w: 300, h: 250 },  // medium rectangle
  { w: 728, h: 90 },   // leaderboard
];

const APP_BUNDLES = [
  "com.example.newsapp",
  "com.example.gameapp",
  "com.example.weatherapp",
];

const IAB_CATEGORIES = ["IAB1", "IAB7", "IAB9", "IAB17"];

const OS_LIST = ["iOS", "Android"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomUserId(): string {
  return `user-${Math.random().toString(36).slice(2, 10)}`;
}

function randomRequestId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function generateBidRequest(): BidRequest {
  const size = randomItem(AD_SIZES);

  return {
    id: randomRequestId(),
    imp: [
      {
        id: "1",
        banner: { w: size.w, h: size.h },
        bidfloor: 0.5,
        bidfloorcur: "USD",
      },
    ],
    app: {
      bundle: randomItem(APP_BUNDLES),
      cat: [randomItem(IAB_CATEGORIES)],
    },
    device: {
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      os: randomItem(OS_LIST),
      ua: "Mozilla/5.0 (compatible)",
    },
    user: {
      id: randomUserId(),
    },
    tmax: 100,
    at: AuctionType.FirstPrice,
  };
}

async function sendBidRequest(): Promise<void> {
  const bidRequest = generateBidRequest();

  try {
    const res = await fetch(BIDDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bidRequest),
      signal: AbortSignal.timeout(bidRequest.tmax ?? 100),
    });

    if (res.status === 204) {
      console.log(`[${bidRequest.id}] NO BID`);
      return;
    }

    const bidResponse: BidResponse = await res.json();
    const bid = bidResponse.seatbid?.[0]?.bid?.[0];

    console.log(
      `[${bidRequest.id}] BID — $${bid?.price} CPM | ` +
      `${bidRequest.imp[0].banner?.w}x${bidRequest.imp[0].banner?.h} | ` +
      `${bidRequest.device?.os} | ` +
      `app: ${bidRequest.app?.bundle}`
    );
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.error(`[${bidRequest.id}] TIMEOUT — exceeded ${bidRequest.tmax}ms`);
    } else {
      console.error(`[${bidRequest.id}] ERROR —`, err);
    }
  }
}

console.log(`Mock SSP started — sending bid requests every ${INTERVAL_MS}ms\n`);
setInterval(sendBidRequest, INTERVAL_MS);
sendBidRequest(); // fire immediately on start
