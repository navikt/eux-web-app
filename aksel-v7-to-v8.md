# Aksel v7 to v8 Migration Guide

> **Purpose**: This document is an AI-consumable prompt/guide for migrating a React application from `@navikt/ds-react` v7 to v8, including dark mode support. It captures lessons learned, pitfalls, and patterns discovered during a real migration.

## Overview

Aksel v8 introduces:
- **New CSS token naming**: `--a-*` → `--ax-*` (semantic tokens)
- **New CSS class prefix**: `navds-` → `aksel-`
- **New spacing scale**: `spacing-{n}` → `space-{px}` (pixel-based naming)
- **CSS `@layer` usage**: All Aksel CSS is now layered; non-layered app CSS always wins in specificity
- **Dark mode support**: Adding `.dark` class to `<html>` activates dark mode tokens
- **Removed component tokens**: `--ac-*` tokens are gone

## Step 1: Update Packages

```bash
npm install @navikt/ds-react@^8 @navikt/ds-css@^8 @navikt/aksel-icons@^8
```

## Step 2: Run Codemods

Run these codemods **in order**. They only process files inside `src/` — files at the project root (like `global.css`) must be migrated manually.

```bash
npx @navikt/aksel codemod v8-primitive-spacing   # React primitives (padding, gap, etc.)
npx @navikt/aksel codemod v8-box                 # Box background/borderColor prop values
npx @navikt/aksel codemod v8-prop-deprecate       # Remove deprecated props
npx @navikt/aksel codemod v8-tag-variant          # Tag variant name changes
npx @navikt/aksel codemod v8-button-variant       # Button variant name changes
```

> **⚠️ Warning**: The `v8-tokens` codemod (CSS token migration) may hang when run non-interactively. If it does, perform the CSS token migration manually using the mapping tables below.

## Step 3: CSS Token Migration (`--a-*` → `--ax-*`)

### Background/Surface Tokens

| v7 Token | v8 Token |
|----------|----------|
| `--a-bg-default` | `--ax-bg-default` |
| `--a-bg-subtle` | `--ax-bg-neutral-soft` |
| `--a-surface-default` | `--ax-bg-default` |
| `--a-surface-subtle` | `--ax-bg-neutral-soft` |
| `--a-surface-selected` | `--ax-bg-accent-moderate` |
| `--a-surface-action` | `--ax-bg-accent-strong` |
| `--a-surface-action-hover` | `--ax-bg-accent-moderate-hover` |
| `--a-surface-action-selected` | `--ax-bg-accent-strong` |
| `--a-surface-danger` | `--ax-bg-danger-strong` |
| `--a-surface-warning` | `--ax-bg-warning-strong` |
| `--a-surface-success` | `--ax-bg-success-strong` |
| `--a-surface-info` | `--ax-bg-info-strong` |

### Text Tokens

| v7 Token | v8 Token |
|----------|----------|
| `--a-text-default` | `--ax-text-neutral` |
| `--a-text-subtle` | `--ax-text-neutral-subtle` |
| `--a-text-action` | `--ax-text-accent` |
| `--a-text-danger` | `--ax-text-danger` |
| `--a-text-on-action` | `--ax-text-accent-contrast` |
| `--a-text-on-inverted` | `--ax-text-neutral-contrast` |

### Border Tokens

| v7 Token | v8 Token |
|----------|----------|
| `--a-border-default` | `--ax-border-neutral` |
| `--a-border-subtle` | `--ax-border-neutral-subtle` |
| `--a-border-strong` | `--ax-border-neutral-strong` |
| `--a-border-action` | `--ax-border-accent` |
| `--a-border-danger` | `--ax-border-danger` |
| `--a-border-focus` | `--ax-border-focus` |

### Spacing Tokens

| v7 Token | v8 Token | Value |
|----------|----------|-------|
| `--a-spacing-1` | `--ax-space-4` | 4px |
| `--a-spacing-2` | `--ax-space-8` | 8px |
| `--a-spacing-3` | `--ax-space-12` | 12px |
| `--a-spacing-4` | `--ax-space-16` | 16px |
| `--a-spacing-5` | `--ax-space-20` | 20px |
| `--a-spacing-6` | `--ax-space-24` | 24px |
| `--a-spacing-8` | `--ax-space-32` | 32px |
| `--a-spacing-12` | `--ax-space-48` | 48px |
| `--a-spacing-16` | `--ax-space-64` | 64px |

### Global Color Tokens (avoid in app CSS)

If you find raw global tokens like `--ax-accent-100`, `--ax-neutral-100`, etc., replace them with semantic equivalents:

| Global Token | Semantic Replacement |
|-------------|---------------------|
| `--ax-accent-100` | `--ax-bg-accent-soft` |
| `--ax-neutral-100` | `--ax-bg-neutral-soft` |
| `--ax-neutral-200` | `--ax-bg-neutral-moderate` |
| `--ax-neutral-300` | `--ax-bg-neutral-moderate-hover` |

## Step 4: CSS Class Prefix Migration

All Aksel-generated CSS classes changed prefix:

```
navds-*  →  aksel-*
```

Search and replace in all files:
```bash
grep -r "navds-" src/ --include="*.tsx" --include="*.ts" --include="*.css" --include="*.module.css" -l
```

Common patterns:
- `navds-button` → `aksel-button`
- `navds-text-field__label` → `aksel-text-field__label`
- `navds-label` → `aksel-label`
- `navds-error-message` → `aksel-error-message`
- `navds-select` → `aksel-select`

> **Note**: Third-party libraries like `@navikt/landvelger` may still reference `navds-` classes internally. These cannot be changed and may need CSS overrides.

## Step 5: Component API Changes

### Radio Component (Major Change)

The Radio component structure changed from `position: absolute` input with `::before` pseudo on label to a `display: grid` layout with a visible input in its own column.

**Impact on custom radio panels**: If you have custom styled radio panels (cards with radio buttons), the focus outline `::after` pseudo-element uses `inset: var(--ax-space-12) 0` by default. Override to `inset: 0` for panel-style radios:

```css
.radioPanel {
  flex: 1;
  background-color: var(--ax-bg-default);
  border: 1px solid var(--ax-border-neutral-subtle);
  border-radius: var(--ax-radius-4);
  padding-inline: var(--ax-space-8);
  align-items: center;

  &:focus-within::after {
    inset: 0;  /* Override default inset to fill the panel */
  }
}

.radioPanel:has(input[type=radio]:checked) {
  background-color: var(--ax-bg-accent-moderate-hover);
  border-color: var(--ax-bg-accent-moderate-hover);
}

.radioPanel:hover {
  background-color: var(--ax-bg-accent-moderate-hover);
  border-color: var(--ax-bg-accent-moderate-hover);
}
```

### Box Component

The `background` and `borderColor` props use new value names. The codemod handles most cases, but verify manually:
- `"surface-default"` → check if still valid
- `borderColor` type may have changed — some string values no longer accepted

### HStack

The `flexShrink` prop was removed from `HStack` in v8.

## Step 6: Hardcoded Colors

**Critical**: Search for all hardcoded color values and replace with semantic tokens. These break dark mode.

```bash
# Find hardcoded hex colors
grep -rn "#[0-9a-fA-F]\{3,8\}" src/ --include="*.css" --include="*.module.css" --include="*.tsx" --include="*.ts"

# Find hardcoded rgba values
grep -rn "rgba\?" src/ --include="*.css" --include="*.module.css"
```

### Common Replacements

| Hardcoded Value | Semantic Token |
|----------------|---------------|
| `#ffffff`, `white` | `var(--ax-bg-default)` |
| `#000000`, `black` | `var(--ax-text-neutral)` |
| `#0067C5` (NAV blue) | `var(--ax-text-accent)` or `var(--ax-bg-accent-strong)` |
| `rgba(236, 243, 153, 0.5)` (yellow highlight) | `var(--ax-bg-success-softA)` |
| `rgba(...)` (error red bg) | `var(--ax-bg-danger-softA)` |

### SVG Icons

SVG files with hardcoded `fill` or `stroke` colors should use `currentColor` to inherit from the parent's CSS `color` property:

```xml
<!-- Before -->
<path fill="#0067C5" d="..." />

<!-- After -->
<path fill="currentColor" d="..." />
```

### Inline Styles in Components

Search for inline `style` props with hardcoded colors:
```bash
grep -rn "color:\s*['\"]#" src/ --include="*.tsx"
grep -rn "backgroundColor:\s*['\"]#" src/ --include="*.tsx"
```

Replace with CSS custom properties:
```tsx
// Before
style={{ color: '#0067C5' }}

// After
style={{ color: 'var(--ax-text-accent)' }}
```

## Step 7: Dark Mode Support

### Toggle Implementation

Add a dark mode toggle using Aksel's `MoonIcon`/`SunIcon`:

```tsx
import { MoonIcon, SunIcon } from '@navikt/aksel-icons'
import { InternalHeader } from '@navikt/ds-react'

const [isDarkMode, setIsDarkMode] = useState(() => {
  return localStorage.getItem('theme') === 'dark'
})

const toggleDarkMode = useCallback(() => {
  const next = !isDarkMode
  setIsDarkMode(next)
  document.documentElement.classList.toggle('dark', next)
  document.documentElement.classList.toggle('light', !next)
  localStorage.setItem('theme', next ? 'dark' : 'light')
}, [isDarkMode])

// In JSX (inside InternalHeader):
<InternalHeader.Button onClick={toggleDarkMode} aria-label="Bytt tema">
  {isDarkMode ? <SunIcon title="Bytt til lyst tema" /> : <MoonIcon title="Bytt til mørkt tema" />}
</InternalHeader.Button>
```

### Preventing Flash of Wrong Theme

Add an inline script in `index.html` **before** React loads:

```html
<script>
  (function() {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
  })();
</script>
```

### Dark Mode Token Behavior

- Adding `.dark` to `<html>` activates dark mode values for all `--ax-*` semantic tokens
- `--ax-bg-default` changes from `#fff` (light) to `#0e151f` (dark)
- `--ax-text-neutral` changes from dark text to light text
- **`--ax-text-neutral-contrast`** (i.e., `--ax-neutral-000`) **inverts** — it's white in light mode but dark in dark mode. This is a common pitfall when mapping v7 tokens.

## Step 8: Third-Party Library Compatibility

### `@navikt/landvelger` (Country Picker)

This library wraps `react-select` and uses old v7 CSS tokens (`--a-surface-*`, `--a-text-*`) in both inline styles and styled-components. It cannot be updated without a library release.

#### Solution: Legacy Token Aliases

Add v7 token aliases in your global CSS, **split by theme** for correct dark mode behavior:

```css
/* Light mode aliases */
:root, .light {
  --a-surface-default: var(--ax-bg-default);
  --a-surface-subtle: var(--ax-bg-neutral-soft);
  --a-surface-action-selected: var(--ax-bg-accent-strong);
  --a-surface-action-hover: var(--ax-bg-accent-moderate-hover);
  --a-surface-danger: var(--ax-bg-danger-strong);
  --a-text-default: var(--ax-text-neutral);
  --a-text-on-inverted: var(--ax-text-neutral-contrast);
  --a-border-default: var(--ax-border-neutral);
}

/* Dark mode aliases — note the differences */
.dark {
  --a-surface-default: var(--ax-bg-default);
  --a-surface-subtle: var(--ax-bg-neutral-soft);
  --a-surface-action-selected: var(--ax-bg-accent-strong);
  --a-surface-action-hover: var(--ax-bg-accent-strong-hover);
  --a-surface-danger: var(--ax-bg-danger-strong);
  --a-text-default: var(--ax-text-neutral);
  --a-text-on-inverted: #fff;
  --a-border-default: var(--ax-border-neutral);
}
```

> **Key insight**: `--a-text-on-inverted` maps to `--ax-text-neutral-contrast` which resolves to `--ax-neutral-000`. In dark mode, `--ax-neutral-000` is a **dark** color (the scale inverts), making text unreadable on colored backgrounds. Use `#fff` explicitly for dark mode.

> **Key insight**: `--a-surface-action-hover` should use `--ax-bg-accent-strong-hover` in dark mode instead of `--ax-bg-accent-moderate-hover`, because moderate-hover is too subtle in dark mode to provide sufficient contrast with white text.

#### Solution: CSS Overrides for react-select

The landvelger uses `classNamePrefix: "c-countrySelect__select"`, generating classes like `.c-countrySelect__select__menu`, `.c-countrySelect__select__option`, etc. It also uses styled-components internally for option rendering with `!important` styles. Add CSS overrides to style the dropdown:

```css
.c-countrySelect__select__menu {
  background-color: var(--ax-bg-default) !important;
  border: 1px solid var(--ax-border-neutral-subtle);
  border-radius: var(--ax-radius-4);
  box-shadow: var(--ax-shadow-dialog);
}

.c-countrySelect__select__menu-list {
  background-color: var(--ax-bg-default) !important;
  padding: 0 !important;
  border-radius: var(--ax-radius-4);
}

.c-countrySelect__select__option {
  color: var(--ax-text-neutral) !important;
  background-color: var(--ax-bg-default) !important;
}

.c-countrySelect__select__option:hover,
.c-countrySelect__select__option--is-focused {
  background-color: var(--ax-bg-accent-soft) !important;
  color: var(--ax-text-neutral) !important;
}

.c-countrySelect__select__option--is-selected {
  background-color: var(--ax-bg-accent-strong) !important;
  color: var(--ax-text-neutral-contrast) !important;
}

.c-countrySelect__select__single-value {
  color: var(--ax-text-neutral) !important;
}

.c-countrySelect__select__placeholder {
  color: var(--ax-text-neutral-subtle) !important;
}

.c-countrySelect__select__input-container,
.c-countrySelect__select__input {
  color: var(--ax-text-neutral) !important;
}

.c-countrySelect__select__indicator {
  color: var(--ax-text-neutral-decoration) !important;
}

.c-countrySelect__select__indicator:hover {
  color: var(--ax-text-neutral) !important;
}

.c-countrySelect__select__multi-value {
  background-color: var(--ax-bg-neutral-moderate) !important;
  color: var(--ax-text-neutral) !important;
  border-color: var(--ax-border-neutral-subtle) !important;
}

.c-countrySelect__select__multi-value__label {
  color: var(--ax-text-neutral) !important;
}

.c-countrySelect__select__multi-value__remove:hover {
  background-color: var(--ax-bg-danger-moderate) !important;
  color: var(--ax-text-danger) !important;
}
```

### Custom `react-select` Wrappers

If your app has its own react-select wrapper, update the `styles` prop to use v8 tokens:

```tsx
styles={{
  control: (base) => ({
    ...base,
    backgroundColor: 'var(--ax-bg-default)',
    borderColor: 'var(--ax-border-neutral)',
    color: 'var(--ax-text-neutral)',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--ax-text-neutral)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? 'var(--ax-bg-accent-strong)'
      : state.isFocused
        ? 'var(--ax-bg-accent-soft)'
        : 'var(--ax-bg-default)',
    color: state.isSelected
      ? 'var(--ax-text-accent-contrast)'
      : 'var(--ax-text-neutral)',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--ax-bg-default)',
    borderColor: 'var(--ax-border-neutral)',
  }),
  menuList: (base) => ({
    ...base,
    backgroundColor: 'var(--ax-bg-neutral-soft)',
    border: '1px solid var(--ax-border-neutral)',
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--ax-text-neutral-subtle)',
  }),
}}
```

## Step 9: Files Outside `src/`

**The codemods only process `src/`**. Manually migrate:

- `global.css` (project root) — body background, text color, any global tokens
- `index.html` — if referencing any Aksel classes or tokens
- Any config files referencing tokens

Common root-level body styles:

```css
body {
  color: var(--ax-text-neutral);
  background: var(--ax-bg-neutral-soft);
}
```

## Step 10: Repeatable/Highlight Backgrounds

If your app uses colored backgrounds for state indication (new items, errors, etc.), replace hardcoded rgba with semantic alpha tokens:

```css
.new {
  background-color: var(--ax-bg-success-softA);  /* Subtle green, works in dark mode */
}
.error {
  background-color: var(--ax-bg-danger-softA);   /* Subtle red, works in dark mode */
}
.original {
  background-color: var(--ax-bg-accent-soft);    /* Subtle blue */
}
```

The `*A` (alpha) variants provide semi-transparent backgrounds that layer correctly in both themes.

## Verification Checklist

After migration, verify:

- [ ] `npm run build` passes without errors
- [ ] `npm run typecheck` passes (spacing values, borderColor types may cause TS errors)
- [ ] No remaining `--a-` tokens in app CSS (except legacy aliases for third-party libs)
- [ ] No remaining `navds-` class references in app code (except third-party libs)
- [ ] No hardcoded hex colors (`#fff`, `#000`, `#0067C5`) in CSS or inline styles
- [ ] No hardcoded `rgba()` values in CSS
- [ ] Light mode renders correctly (backgrounds, text, borders)
- [ ] Dark mode renders correctly (if implemented)
- [ ] Radio panels/cards have correct focus outline (`inset: 0`)
- [ ] Country picker (if using `@navikt/landvelger`) is readable in both themes
- [ ] SVG icons use `currentColor` instead of hardcoded fills

## Common Pitfalls

1. **Codemods skip root-level files**: `global.css`, `index.html`, etc. must be migrated manually
2. **`--ax-text-neutral-contrast` inverts in dark mode**: Don't use it for "white text on colored bg" in dark mode — use `#fff` directly
3. **`--ax-bg-accent-moderate-hover` is too subtle in dark mode**: For hover states that need white text, use `--ax-bg-accent-strong-hover` instead
4. **Radio v8 grid layout**: Custom radio panels need `&:focus-within::after { inset: 0; }` to contain the focus ring
5. **Third-party `navds-` classes**: Libraries like `@navikt/landvelger` still use `navds-` internally — these cannot be changed
6. **CSS `@layer` specificity**: Aksel v8 CSS is layered, so your non-layered app CSS automatically wins. This is good — but be aware when debugging specificity issues
7. **Semantic tokens always preferred**: Use `--ax-bg-accent-soft` not `--ax-accent-100`. Semantic tokens are stable across theme changes; global tokens may resolve differently
8. **`ansi-to-html` and similar libs**: If you pass `fg: '#000'` or similar to rendering libraries, remove them and let colors inherit from CSS

## Token Quick Reference

### Backgrounds
- **Default page bg**: `--ax-bg-neutral-soft`
- **Card/section bg**: `--ax-bg-default`
- **Hover bg**: `--ax-bg-accent-moderate-hover` (light) / `--ax-bg-accent-strong-hover` (needs white text)
- **Subtle highlight**: `--ax-bg-accent-soft`
- **New item**: `--ax-bg-success-softA`
- **Error item**: `--ax-bg-danger-softA`

### Text
- **Default text**: `--ax-text-neutral`
- **Subtle/secondary text**: `--ax-text-neutral-subtle`
- **Decorative/muted**: `--ax-text-neutral-decoration`
- **Link/action text**: `--ax-text-accent`
- **Text on strong bg**: `--ax-text-neutral-contrast` (light mode only!) or `#fff` (safe for both)

### Borders
- **Default border**: `--ax-border-neutral`
- **Subtle border**: `--ax-border-neutral-subtle`
- **Strong border**: `--ax-border-neutral-strong`
- **Focus ring**: `--ax-border-focus`

### Shadows
- **Dialog/dropdown shadow**: `--ax-shadow-dialog`

### Radius
- **Small**: `--ax-radius-4`
- **Medium**: `--ax-radius-8`
- **Large**: `--ax-radius-12`
