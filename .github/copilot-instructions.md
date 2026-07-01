  # Copilot Instructions for eux-web-app (NEESSI)

## NEVER
- Do not commit and push to main/master directly. Always create a feature branch and open a pull request for code review.
- If we are on master/main, always ask before committing and pushing. We want to avoid accidental commits to main.
- Do not commit or push at all unless explicitly asked. Default to leaving changes for the user to QA locally first. Create a feature branch *before* editing when starting implementation work.

## Build, Test, and Lint

```bash
npm run build          # Full build (patches env, then runs vite build)
npm run typecheck      # TypeScript check (tsc --noEmit)
npm test               # Run the Jest test suite
npx jest <pattern>     # Run a single test file / matching tests
```

Linting is run automatically in IntelliJ (ESLint from node_modules); there is no separate lint script.

### Verify before declaring done
Do not report a change as working until you have verified it. After UI/state changes:
- Run `npm run typecheck`.
- Trace the Redux wiring end to end (action type triple → reducer slice → `useAppSelector`/props) so the component actually receives the data.
- Re-check the user-facing flow you touched (e.g. click → radio select → save) so you don't introduce a regression. Several past sessions delivered "fixes" that threw `Cannot read properties of undefined` or broke radio selection because the wiring wasn't traced.

### CI / npm install note
`npm ci` can pass locally but fail in GitHub Actions due to lockfile / optional-dependency mismatches (e.g. rollup optional deps after a React major upgrade). Prefer `npm install --include=optional` over deleting `package-lock.json`.

## Architecture

This is a React 18 frontend for EESSI (Electronic Exchange of Social Security Information) used by NAV caseworkers. It manages SEDs (Structured Electronic Documents) exchanged between EU/EEA social security institutions via RINA.

### Layer structure

- **`src/pages/`** — Route-level components (Forside, SvarSed, PDU1, Journalfoering, Vedlegg, AdminPage)
- **`src/applications/`** — Feature modules with domain logic, each containing form components and validation. The main features are SvarSed (reply SEDs), PDU1, OpprettSak (create case), Journalfoering (journal entry), and Vedlegg (attachments)
- **`src/components/`** — Shared reusable UI components
- **`src/actions/`** — Redux action creators using `@navikt/fetch`'s `call()` for API requests
- **`src/reducers/`** — Redux reducers (one per domain slice), combined in `reducers/index.ts`
- **`src/declarations/`** — TypeScript type declarations (`.d.ts` files) for domain models
- **`src/constants/`** — Action type strings (`actionTypes.ts`), API URL templates (`urls.ts`), environment config
- **`src/mocks/`** — Test and localhost mock data.  Mocks API responses and Redux state for testing and local development

### State management

Redux with `@reduxjs/toolkit`. The store exports typed hooks:

```ts
import { useAppDispatch, useAppSelector } from 'store'
```

The root state type is `State` from `declarations/reducers.d.ts`, composed of ~17 domain slices (app, svarsed, pdu1, validation, alert, etc.).

### API pattern

Actions use `@navikt/fetch`'s `call()` with a request/success/failure action type triple:

```ts
call({
  method: 'POST',
  url: sprintf(urls.API_SED_CREATE_URL, { rinaSakId }),
  type: {
    request: types.SVARSED_SED_CREATE_REQUEST,
    success: types.SVARSED_SED_CREATE_SUCCESS,
    failure: types.SVARSED_SED_CREATE_FAILURE
  }
})
```

URL templates in `constants/urls.ts` use `sprintf-js` with `%(param)s` syntax.

### Server-side

`server.mjs` is an Express server that:
- Handles Azure AD on-behalf-of token exchange for API authentication
- Proxies `/api`, `/v2`–`/v5` requests to the NEESSI backend
- Serves the built static frontend
- Runs on port 8080 in production, deployed via NAIS (Kubernetes) on NAV's platform

### Validation system

Each form section has a colocated `validation.ts` with a validate function. Validation uses namespace-based keys (e.g., `parentNamespace-kontoopplysninger-bankensNavn`) and the `performValidation` helper from `utils/performValidation.ts`. Errors are added via `addError()` from `utils/validation.ts` using i18n keys from the `validation` namespace.

## Key Conventions

### UI components

Uses NAV's Aksel design system (`@navikt/ds-react`, `@navikt/ds-css`, `@navikt/aksel-icons`). Import components from `@navikt/ds-react` and icons from `@navikt/aksel-icons`.

### SvarSed form components

Form sub-components in `applications/SvarSed/` receive `MainFormProps` which includes `replySed`, `updateReplySed`, `parentNamespace`, and `personName`. They read validation state via `useAppSelector(mapState)` from `MainForm.tsx`.

### SED-specific types and components

Do **not** prefix domain types or shared components with the SED code. Use generic names (`Bruker`, not `H021Bruker`; `Adresse`, not `AdresseH120`) — the filename/context already conveys the SED. Extend shared base types for SED-specific fields (e.g. `Bruker extends PersonInfo`) rather than duplicating them, and reuse the standard shared components across SEDs instead of cloning per-SED variants.

Branch SED-specific behavior at runtime with the guards in `utils/sed.ts` (`isHSed`, `isH021Sed`, `isH120Sed`), e.g. wrap a typed-SED-only MainForm in `isH021Sed(replySed)` rather than baking it into the common MainForm.

### CJS/UMD default imports under Vite

Some `@navikt` packages ship as CJS/UMD bundles (e.g. `@navikt/landvelger`, `@navikt/land-verktoy`, `CountryData`). Under Vite/Rolldown the interop default may be wrapped in an object, so the default import must be unwrapped via `.default` (otherwise React throws `Element type is invalid … got: object`, or you get `X.getCountryInstance is not a function`). See `src/components/landvelger.ts` for the pattern.

### i18n

Norwegian Bokmål (`nb`) only. Multiple namespaces: `app`, `buc`, `el`, `label` (default), `message`, `tema`, `validation`, `sakshandlinger`, `sedhandlinger`, `journalfoering`. Translation files are in `public/locales/nb/`.

### Testing

- Pragmatic approach to testing. Focus on critical logic, not 100% coverage.
- Component tests use `@testing-library/react`

### Path aliases

`src/` is the base URL for imports. Use bare imports like `import X from 'actions/svarsed'` or `import Y from 'components/Forms/Input'`.

### Domain language

The codebase mixes Norwegian and English. Domain terms are in Norwegian.
