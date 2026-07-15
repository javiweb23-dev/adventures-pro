import type { SanityClient } from "next-sanity";

function extensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.split(".").pop()?.toLowerCase();
    if (ext && ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
      return ext === "jpeg" ? "jpg" : ext;
    }
  } catch {
    // ignore
  }
  return "jpg";
}

export async function uploadRemoteImageToSanity(
  client: SanityClient,
  imageUrl: string,
  filenameBase: string,
) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image (${response.status}): ${imageUrl}`);
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = extensionFromUrl(imageUrl);
  const filename = `${filenameBase.slice(0, 60)}.${ext}`;

  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType,
  });

  return {
    _type: "image" as const,
    asset: {
      _type: "reference" as const,
      _ref: asset._id,
    },
  };
}
