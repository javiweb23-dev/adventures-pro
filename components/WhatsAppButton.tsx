"use client";

export default function WhatsAppButton() {
  const phoneNumber = "18294216101";
  const message = "Hello! I'm interested in booking a tour with Adventures Finder.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label="Contact us on WhatsApp"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-8 w-8 fill-current"
      >
        <path d="M19.11 17.39c-.27-.14-1.6-.79-1.85-.88-.25-.09-.44-.14-.63.14-.18.27-.72.88-.88 1.06-.16.18-.32.2-.59.07-.27-.14-1.16-.43-2.2-1.38-.81-.72-1.35-1.61-1.51-1.88-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.63-1.52-.87-2.08-.23-.55-.46-.47-.63-.47h-.54c-.18 0-.48.07-.73.34s-.96.93-.96 2.27.98 2.65 1.11 2.84c.14.18 1.92 2.93 4.66 4.11.65.28 1.16.45 1.56.57.66.21 1.26.18 1.73.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.06-.11-.25-.18-.52-.32Z" />
        <path d="M16 3C8.83 3 3 8.74 3 15.81c0 2.48.72 4.89 2.09 6.96L3 29l6.38-2.02a13.1 13.1 0 0 0 6.62 1.8h.01C23.17 28.78 29 23.04 29 15.97 29 8.9 23.17 3 16 3Zm0 23.56h-.01a10.85 10.85 0 0 1-5.53-1.51l-.4-.24-3.79 1.2 1.24-3.68-.26-.42a10.67 10.67 0 0 1-1.64-5.63C5.61 10.48 10.26 6 16 6c5.74 0 10.39 4.48 10.39 10 0 5.51-4.65 10-10.39 10Z" />
      </svg>
    </a>
  );
}