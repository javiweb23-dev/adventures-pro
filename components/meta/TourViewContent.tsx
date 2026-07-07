"use client";

import { useEffect } from "react";
import { trackMetaEvent } from "@/lib/meta/trackEvent";

type TourViewContentProps = {
  slug: string;
  title: string;
  value?: number;
  currency?: string;
};

export default function TourViewContent({
  slug,
  title,
  value,
  currency = "USD",
}: TourViewContentProps) {
  useEffect(() => {
    trackMetaEvent("ViewContent", {
      content_ids: [slug],
      content_name: title,
      content_type: "product",
      ...(Number.isFinite(value) ? { value, currency } : {}),
    });
  }, [slug, title, value, currency]);

  return null;
}
