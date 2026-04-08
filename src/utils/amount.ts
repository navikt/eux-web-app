/**
 * Sanitizes a user-entered amount string into a RINA-compatible format.
 *
 * Handles Norwegian/European number formats:
 * - Removes all whitespace (e.g. "2 197 548" → "2197548")
 * - Comma as decimal separator (e.g. "1234,50" → "1234.50")
 * - Dot as thousands separator (e.g. "1.968" → "1968")
 * - Mixed European format (e.g. "1.234,56" → "1234.56")
 *
 * Only adds decimal places if the original value contained decimals.
 * Returns the original value (trimmed) if it cannot be parsed as a number.
 */
export const sanitizeAmount = (value: string): string => {
  if (!value || !value.trim()) return value

  let cleaned = value.replace(/\s/g, '')

  const hasComma = cleaned.includes(',')
  const hasDot = cleaned.includes('.')

  let hasDecimals = false

  if (hasComma && hasDot) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.')
    hasDecimals = true
  } else if (hasComma) {
    cleaned = cleaned.replace(',', '.')
    hasDecimals = true
  } else if (hasDot) {
    const lastDotIndex = cleaned.lastIndexOf('.')
    const digitsAfterLastDot = cleaned.length - lastDotIndex - 1
    if (digitsAfterLastDot === 3) {
      cleaned = cleaned.replace(/\./g, '')
    } else {
      hasDecimals = true
    }
  }

  const parsed = parseFloat(cleaned)
  if (isNaN(parsed)) return value.trim()
  return hasDecimals ? parsed.toFixed(2) : parsed.toString()
}
