import CountryDataImport from '@navikt/land-verktoy'

/**
 * @navikt/land-verktoy is shipped as a CommonJS/UMD bundle whose exports are
 * `module.exports = { __esModule: true, default: CountryData }`.
 *
 * Vite 7 unwrapped `.default` for the default import via its CJS interop. Vite 8
 * (Rolldown) instead assigns the whole namespace object to the default import,
 * so `CountryDataImport` becomes `{ __esModule: true, default: CountryData }` —
 * an object rather than the API object. Calling e.g.
 * `CountryData.getCountryInstance(...)` then throws:
 *   "CountryData.getCountryInstance is not a function".
 *
 * Normalize the import in one place so every consumer gets the real API object.
 * The `?? CountryDataImport` fallback keeps this working if/when the interop is
 * fixed and the default import is the API object directly again.
 */
const CountryData: any = (
  (CountryDataImport as any)?.default ?? CountryDataImport
) as typeof CountryDataImport

export default CountryData
export type { Country, Currency } from '@navikt/land-verktoy'
