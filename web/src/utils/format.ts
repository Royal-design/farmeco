const currencyFormatterCache = new Map<string, Intl.NumberFormat>()

function getCurrencyFormatter(currency: string, locale = "en-NG") {
  let formatter = currencyFormatterCache.get(`${currency}-${locale}`)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    })
    currencyFormatterCache.set(`${currency}-${locale}`, formatter)
  }
  return formatter
}

export function formatPrice(
  value: number,
  currency = "NGN",
  locale = "en-NG"
) {
  return getCurrencyFormatter(currency, locale).format(value)
}

export function formatCompactNumber(value: number, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatNumber(value: number, locale = "en-US") {
  return new Intl.NumberFormat(locale).format(value)
}

export function formatDate(
  date: string | Date,
  locale = "en-US",
  options?: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(date))
}

export function timeAgo(date: string | Date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  const intervals: Array<[number, string]> = [
    [31536000, "year"],
    [2592000, "month"],
    [604800, "week"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ]
  for (const [secondsPer, label] of intervals) {
    const count = Math.floor(seconds / secondsPer)
    if (count >= 1) {
      return `${count} ${label}${count === 1 ? "" : "s"} ago`
    }
  }
  return "just now"
}
