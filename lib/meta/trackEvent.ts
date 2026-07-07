import { trackGa4CompanionEvent } from "@/lib/analytics/ga4";
import type { MetaStandardEvent } from "@/lib/meta/constants";
import { getCookie } from "@/lib/meta/cookies";
import { createEventId } from "@/lib/meta/eventId";

type TrackMetaEventOptions = {
  eventId?: string;
};

export function trackMetaEvent(
  eventName: MetaStandardEvent,
  customData?: Record<string, unknown>,
  options?: TrackMetaEventOptions,
): string {
  if (typeof window === "undefined") {
    return options?.eventId ?? createEventId();
  }

  const eventId = options?.eventId ?? createEventId();
  const eventSourceUrl = window.location.href;

  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, customData ?? {}, { eventID: eventId });
  }

  trackGa4CompanionEvent(eventName, customData);

  void fetch("/api/meta/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      event_source_url: eventSourceUrl,
      custom_data: customData,
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc"),
    }),
    keepalive: true,
  }).catch((error) => {
    console.error("Failed to send Meta server event:", error);
  });

  return eventId;
}
