import FlagImport, { FlagProps } from '@navikt/flagg-ikoner'

/**
 * @navikt/flagg-ikoner is shipped as a CommonJS/UMD bundle whose exports are
 * `module.exports = { __esModule: true, default: Flag }`.
 *
 * Vite 7 unwrapped `.default` for the default import via its CJS interop. Vite 8
 * (Rolldown) instead assigns the whole namespace object to the default import,
 * so `FlagImport` becomes `{ __esModule: true, default: fn }` — an object rather
 * than a component. Rendering it throws:
 *   "Element type is invalid: expected a string ... but got: object".
 *
 * Normalize the import in one place so every consumer gets the real component.
 * The `?? FlagImport` fallback keeps this working if/when the interop is fixed
 * and the default import is the component directly again.
 */
const Flag: any = (
  (FlagImport as any)?.default ?? FlagImport
) as typeof FlagImport

export default Flag
export type { FlagProps }
