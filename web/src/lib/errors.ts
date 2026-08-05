export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message)
  }
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}
