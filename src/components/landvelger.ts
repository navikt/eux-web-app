import CountrySelectImport, { CountrySelectProps } from '@navikt/landvelger'

/**
 * @navikt/landvelger is shipped as a CommonJS/UMD bundle whose exports are
 * `module.exports = { __esModule: true, default: CountrySelect }`.
 *
 * Vite 7 unwrapped `.default` for the default import via its CJS interop. Vite 8
 * (Rolldown) instead assigns the whole namespace object to the default import,
 * so `CountrySelectImport` becomes `{ __esModule: true, default: fn }` — an
 * object rather than a component. Rendering it throws:
 *   "Element type is invalid: expected a string ... but got: object".
 *
 * Normalize the import in one place so every consumer gets the real component.
 * The `?? CountrySelectImport` fallback keeps this working if/when the interop
 * is fixed and the default import is the component directly again.
 */
const CountrySelect:any = (
  (CountrySelectImport as any)?.default ?? CountrySelectImport
) as typeof CountrySelectImport

export default CountrySelect
export type { CountrySelectProps }
