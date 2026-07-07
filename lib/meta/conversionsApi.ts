import {
  META_GRAPH_API_VERSION,
  META_PIXEL_ID,
  type MetaStandardEvent,
} from "@/lib/meta/constants";

export type MetaUserData = {
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
};

export type MetaEventPayload = {
  eventName: MetaStandardEvent;
  eventId: string;
  eventSourceUrl: string;
  customData?: Record<string, unknown>;
  userData?: MetaUserData;
};

type MetaConversionsApiResponse = {
  events_received?: number;
  messages?: string[];
  fbtrace_id?: string;
};

export async function sendMetaConversionEvent(
  payload: MetaEventPayload,
): Promise<MetaConversionsApiResponse> {
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;

  if (!accessToken) {
    throw new Error("META_CONVERSIONS_API_TOKEN is not configured");
  }

  const userData: Record<string, string> = {};

  if (payload.userData?.clientIpAddress) {
    userData.client_ip_address = payload.userData.clientIpAddress;
  }
  if (payload.userData?.clientUserAgent) {
    userData.client_user_agent = payload.userData.clientUserAgent;
  }
  if (payload.userData?.fbp) {
    userData.fbp = payload.userData.fbp;
  }
  if (payload.userData?.fbc) {
    userData.fbc = payload.userData.fbc;
  }

  const body = {
    data: [
      {
        event_name: payload.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: payload.eventId,
        event_source_url: payload.eventSourceUrl,
        action_source: "website",
        ...(Object.keys(userData).length > 0 ? { user_data: userData } : {}),
        ...(payload.customData && Object.keys(payload.customData).length > 0
          ? { custom_data: payload.customData }
          : {}),
      },
    ],
    access_token: accessToken,
  };

  const response = await fetch(
    `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${META_PIXEL_ID}/events`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const result = (await response.json()) as MetaConversionsApiResponse & {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(result.error?.message ?? "Meta Conversions API request failed");
  }

  return result;
}
