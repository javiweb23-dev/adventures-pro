"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackMetaEvent } from "@/lib/meta/trackEvent";

type TrackedWhatsAppLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "onClick"
> & {
  source?: string;
  children: ReactNode;
};

/**
 * WhatsApp anchor with Meta Contact tracking.
 * Defaults to target=_blank + rel=noopener noreferrer for mobile browser safety.
 */
export default function TrackedWhatsAppLink({
  source = "whatsapp_button",
  children,
  target = "_blank",
  rel = "noopener noreferrer",
  ...anchorProps
}: TrackedWhatsAppLinkProps) {
  const handleClick = () => {
    trackMetaEvent("Contact", {
      content_name: source,
    });
  };

  return (
    <a {...anchorProps} onClick={handleClick} target={target} rel={rel}>
      {children}
    </a>
  );
}
