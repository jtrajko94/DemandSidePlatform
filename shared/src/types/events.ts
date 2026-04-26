export interface ImpressionEvent {
  type: "impression";
  requestId: string;
  campaignId: string;
  creativeId: string;
  price: number;
  timestamp: string;
  os?: string;
  appBundle?: string;
}

export interface ClickEvent {
  type: "click";
  requestId: string;
  campaignId: string;
  timestamp: string;
}

export type TrackingEvent = ImpressionEvent | ClickEvent;
