/**
 * Sanitizes a user-entered amount string into a RINA-compatible decimal format.
 *
 * Handles Norwegian/European number formats:
 * - Removes all whitespace (e.g. "2 197 548" → "2197548")
 * - Comma as decimal separator (e.g. "1234,50" → "1234.50")
 * - Dot as thousands separator (e.g. "1.968" → "1968")
 * - Mixed European format (e.g. "1.234,56" → "1234.56")
 *
 * Returns a string with exactly 2 decimal places, compatible with EESSIAmountType.
 * Returns the original value (trimmed) if it cannot be parsed as a number.
 */
export const sanitizeAmount = (value: string): string => {
  if (!value || !value.trim()) return value

  let cleaned = value.replace(/\s/g, '')

  const hasComma = cleaned.includes(',')
  const hasDot = cleaned.includes('.')

  if (hasComma && hasDot) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.')
  } else if (hasComma) {
    cleaned = cleaned.replace(',', '.')
  } else if (hasDot) {
    const lastDotIndex = cleaned.lastIndexOf('.')
    const digitsAfterLastDot = cleaned.length - lastDotIndex - 1
    if (digitsAfterLastDot === 3) {
      cleaned = cleaned.replace(/\./g, '')
    }
  }

  const parsed = parseFloat(cleaned)
  if (isNaN(parsed)) return value.trim()
  return parsed.toFixed(2)
}
