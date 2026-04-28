/**
 * Midlertidig liste over tillatte valutaer i RINA/neessi.
 *
 * Brukes som `includeList` på CountrySelect type='currency' for å hindre at
 * saksbehandler kan velge en valuta som ikke er tillatt av backend (HTTP 412).
 *
 * TODO: Erstatt med dynamisk liste hentet fra RINA/neessi-backend (se TEN-1662).
 */
export const ALLOWED_CURRENCIES: Array<string> = [
  'BGN', // Bulgarsk lev
  'CHF', // Sveitsiske franc
  'CZK', // Tsjekkisk koruna
  'DKK', // Dansk krone
  'EUR', // Euro
  'GBP', // Britisk pund
  'HRK', // Kroatisk kuna
  'HUF', // Ungarsk forint
  'ISK', // Islandsk krone
  'LTL', // Litauisk litas
  'LVL', // Latvisk lats
  'NOK', // Norsk krone
  'PLN', // Polsk zloty
  'RON', // Rumensk ny leu
  'SEK'  // Svenske kroner
]
