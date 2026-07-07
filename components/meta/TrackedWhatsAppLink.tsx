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

export default function TrackedWhatsAppLink({
  source = "whatsapp_button",
  children,
  ...anchorProps
}: TrackedWhatsAppLinkProps) {
  const handleClick = () => {
    trackMetaEvent("Contact", {
      content_name: source,
    });
  };

  return (
    <a onClick={handleClick} {...anchorProps}>
      {children}
    </a>
  );
}
