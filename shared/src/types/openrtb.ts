// OpenRTB 2.5 core types — only the fields relevant to our DSP

export interface BidRequest {
  id: string;
  imp: Impression[];
  site?: Site;
  app?: App;
  device?: Device;
  user?: User;
  tmax?: number;   // max ms bidder has to respond
  at?: AuctionType;
}

export interface Impression {
  id: string;
  banner?: Banner;
  video?: Video;
  bidfloor?: number;   // minimum acceptable bid (CPM)
  bidfloorcur?: string;
}

export interface Banner {
  w: number;
  h: number;
  pos?: number;  // ad position on screen
}

export interface Video {
  mimes: string[];
  minduration: number;
  maxduration: number;
  w?: number;
  h?: number;
}

export interface Site {
  id?: string;
  domain?: string;
  cat?: string[];   // IAB content categories
  page?: string;
}

export interface App {
  id?: string;
  bundle?: string;  // e.g. "com.example.app"
  cat?: string[];   // IAB content categories
}

export interface Device {
  ip?: string;
  ua?: string;      // user agent
  os?: string;
  make?: string;
  model?: string;
  geo?: Geo;
}

export interface Geo {
  lat?: number;
  lon?: number;
  country?: string;
  region?: string;
  city?: string;
}

export interface User {
  id?: string;
  buyeruid?: string;
  yob?: number;     // year of birth
  gender?: string;
}

export enum AuctionType {
  FirstPrice = 1,
  SecondPrice = 2,
}

// --- Bid Response ---

export interface BidResponse {
  id: string;         // echoes BidRequest.id
  seatbid?: SeatBid[];
  cur?: string;       // currency, e.g. "USD"
  nbr?: NosBidReason; // reason for no bid
}

export interface SeatBid {
  bid: Bid[];
  seat?: string;      // buyer ID
}

export interface Bid {
  id: string;
  impid: string;      // matches Impression.id
  price: number;      // CPM in dollars
  adid?: string;      // ad creative ID
  nurl?: string;      // win notice URL (fired when we win)
  adm?: string;       // ad markup
  crid?: string;      // creative ID
  w?: number;
  h?: number;
}

export enum NosBidReason {
  UnknownError = 0,
  TechnicalError = 1,
  InvalidRequest = 2,
  KnownBot = 3,
  BudgetExhausted = 7,
  NoMatchingCampaign = 9,
}
