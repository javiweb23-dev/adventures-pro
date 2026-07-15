import type { SanityClient } from "next-sanity";
import { formatStepError } from "@/lib/soro/errors";

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

async function downloadRemoteImage(imageUrl: string): Promise<{
  buffer: Buffer;
  contentType: string;
}> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText} for ${imageUrl}`);
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    return {
      buffer: Buffer.from(arrayBuffer),
      contentType,
    };
  } catch (error) {
    throw formatStepError("image download failed", error);
  }
}

export async function uploadRemoteImageToSanity(
  client: SanityClient,
  imageUrl: string,
  filenameBase: string,
) {
  const { buffer, contentType } = await downloadRemoteImage(imageUrl);
  const ext = extensionFromUrl(imageUrl);
  const filename = `${filenameBase.slice(0, 60)}.${ext}`;

  try {
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
  } catch (error) {
    throw formatStepError("image upload failed", error);
  }
}
