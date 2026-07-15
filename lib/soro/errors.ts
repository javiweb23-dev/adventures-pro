export function formatStepError(step: string, error: unknown): Error {
  if (error instanceof Error) {
    // Avoid double-prefixing when bubbling already-labeled step errors.
    if (
      error.message.startsWith("translation failed") ||
      error.message.startsWith("translation timeout") ||
      error.message.startsWith("image download failed") ||
      error.message.startsWith("image upload failed") ||
      error.message.startsWith("sanity create failed") ||
      error.message.startsWith("slug resolution failed") ||
      error.message.startsWith("existence check failed")
    ) {
      return error;
    }

    const name = error.name || "";
    const isAbort =
      name === "AbortError" ||
      /aborted|timeout/i.test(error.message) ||
      (typeof error.cause === "object" &&
        error.cause !== null &&
        "name" in error.cause &&
        (error.cause as { name?: string }).name === "AbortError");

    const causeText =
      error.cause !== undefined ? ` | cause=${serializeCause(error.cause)}` : "";

    if (isAbort && step.startsWith("translation")) {
      return new Error(`translation timeout: ${error.message}${causeText}`);
    }

    return new Error(`${step}: ${error.message}${causeText}`);
  }

  return new Error(`${step}: ${String(error)}`);
}

function serializeCause(cause: unknown): string {
  if (cause instanceof Error) {
    return `${cause.name}: ${cause.message}`;
  }
  try {
    return JSON.stringify(cause);
  } catch {
    return String(cause);
  }
}
