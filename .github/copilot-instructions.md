# Copilot Instructions for eux-web-app (NEESSI)

## Build, Test, and Lint

```bash
npm run build          # Full build (patches env, then runs vite build)
npm run typecheck      # TypeScript check (tsc --noEmit)
```

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

### i18n

Norwegian Bokmål (`nb`) only. Multiple namespaces: `app`, `buc`, `el`, `label` (default), `message`, `tema`, `validation`, `sakshandlinger`, `sedhandlinger`, `journalfoering`. Translation files are in `public/locales/nb/`.

### Testing

- Pragmatic approach to testing. Focus on critical logic, not 100% coverage.
- Component tests use `@testing-library/react`

### Path aliases

`src/` is the base URL for imports. Use bare imports like `import X from 'actions/svarsed'` or `import Y from 'components/Forms/Input'`.

### Domain language

The codebase mixes Norwegian and English. Domain terms are in Norwegian.