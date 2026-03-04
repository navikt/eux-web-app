# Aksel V7 → V8 Migration Guide

> **Purpose:** This document captures the complete process, pitfalls, and solutions discovered while migrating the `eux-web-app` React/TypeScript project from NAV Aksel Design System V7 (7.40.0) to V8 (8.6.0). Use it as a prompt to perform the same migration on another project.

---

## Table of Contents

1. [Overview](#overview)
2. [Step 1: Install V8 Packages](#step-1-install-v8-packages)
3. [Step 2: Run CSS Token Codemod](#step-2-run-the-css-token-codemod)
4. [Step 3: Update CSS Class Prefixes](#step-3-update-css-class-prefixes)
5. [Step 4: Run React Component Codemods](#step-4-run-react-component-codemods)
6. [Step 5: Fix Spacing Token Props (CRITICAL)](#step-5-fix-spacing-token-props-critical--codemods-dont-handle-this)
7. [Step 6: Fix CSS Overrides for V8 Component Structure Changes](#step-6-fix-css-overrides-for-v8-component-structure-changes)
8. [Step 7: Dark Mode Support](#step-7-dark-mode-support)
9. [Step 8: Third-Party Compatibility (@navikt/landvelger)](#step-8-third-party-compatibility-naviktlandvelger)
10. [Step 9: Self-Audit Checklist](#step-9-self-audit-checklist)
11. [Step 10: Verify](#step-10-verify)
12. [Quick Reference: V8 Token Types](#quick-reference-v8-token-types)
13. [Common Pitfalls](#common-pitfalls)
14. [Full Conversation History](#full-conversation-history)

---

## Overview

Migrate a React + TypeScript project from `@navikt/ds-react@7`, `@navikt/ds-css@7`, and `@navikt/aksel-icons@7` to version 8. The migration involves:

- **Package upgrades** to `@navikt/ds-react@8`, `@navikt/ds-css@8`, `@navikt/aksel-icons@8`
- **CSS token prefix changes**: `--a-*` → `--ax-*`, `--ac-*` → `--axc-*`
- **CSS class prefix changes**: `navds-*` → `aksel-*`
- **React component API changes** (handled by codemods)
- **A critical spacing token mapping** that codemods do NOT handle automatically
- **Dark mode support** (built-in to V8)
- **Third-party library compatibility fixes** for packages still using V7 tokens

---

## Step 1: Install V8 Packages

```bash
npm install @navikt/ds-react@8 @navikt/ds-css@8 @navikt/aksel-icons@8 --save
```

Also install the Aksel CLI as a devDependency if not already present:

```bash
npm install @navikt/aksel@8 --save-dev
```

---

## Step 2: Run the CSS Token Codemod

```bash
npx aksel codemod v8-tokens --force
```

This is an **interactive** tool with arrow-key menu navigation. Select **"Run all token migrations"**.

### What it does
- Renames CSS custom properties: `--a-*` → `--ax-*`
- Migrates ~95% of CSS tokens automatically

### Manual fixes needed after codemod

The codemod will report how many tokens were migrated and how many remain. Common manual fixes:

| V7 Token | V8 Replacement | Notes |
|---|---|---|
| `var(--a-white)` | `white` | Plain CSS keyword |
| `var(--a-surface-transparent)` | `transparent` | Plain CSS keyword |
| `--ac-*` (component tokens) | `--axc-*` | Prefix change for component-level tokens |

### Codemod quirks
- The codemod may report "errors" for `.ts` files containing JSX-like patterns (e.g., generic type syntax `<T>`). These are **babel parser false positives**, not actual issues.
- The codemod creates a `.github/agents/aksel.agent.md` file automatically — you may want to remove this.

---

## Step 3: Update CSS Class Prefixes

Replace all `navds-` class name prefixes with `aksel-`:

```bash
# Find all files referencing navds-
grep -rn 'navds-' src/ --include='*.css' --include='*.tsx' --include='*.ts' --include='*.jsx'

# Replace (macOS sed)
find src -type f \( -name '*.css' -o -name '*.tsx' -o -name '*.ts' \) -exec sed -i '' 's/navds-/aksel-/g' {} +

# Also check global.css or any root CSS files
sed -i '' 's/navds-/aksel-/g' global.css
```

Verify no remaining references:
```bash
grep -rn 'navds-' src/ global.css
```

---

## Step 4: Run React Component Codemods

Run **all 9 codemods** in order:

```bash
npx aksel codemod v8-list
npx aksel codemod v8-prop-deprecate
npx aksel codemod v8-box
npx aksel codemod v8-tag-variant
npx aksel codemod v8-toggle-group-variant
npx aksel codemod v8-accordion-variant
npx aksel codemod v8-chips-variant
npx aksel codemod v8-button-variant
npx aksel codemod v8-link-variant
```

### What they do
- `v8-box`: Migrates Box component props (background, shadow, borderColor, etc.) — typically the largest change
- `v8-tag-variant`, `v8-button-variant`, `v8-chips-variant`: Update variant prop values
- `v8-prop-deprecate`: Removes deprecated props
- `v8-list`: Updates List component API

### After running codemods
Check for any `TODO: Aksel Box migration` comments the v8-box codemod may have left:
```bash
grep -rn 'TODO: Aksel Box migration' src/
```

---

## Step 5: Fix Spacing Token Props (CRITICAL — Codemods Don't Handle This)

> ⚠️ **This is the most important step. Getting this wrong makes everything visually broken (4× too small). TypeScript won't catch the error because the wrong values happen to also be valid V8 tokens.**

### The Problem

V7 spacing props used a **multiplier system** where each unit = 0.25rem (4px):
- `padding="4"` → `--a-spacing-4` = **1rem (16px)**

V8 spacing tokens use **pixel-based naming**:
- `padding="space-16"` → `--ax-space-16` = **1rem (16px)**
- `padding="space-4"` → `--ax-space-4` = **0.25rem (4px)** ← NOT the same as V7's "4"!

### The Correct Mapping: V7 "N" → V8 "space-{N×4}"

| V7 Value | V8 Token | Actual Size |
|---|---|---|
| `"0"` | `"space-0"` | 0 |
| `"05"` | `"space-2"` | 0.125rem (2px) |
| `"1"` | `"space-4"` | 0.25rem (4px) |
| `"2"` | `"space-8"` | 0.5rem (8px) |
| `"3"` | `"space-12"` | 0.75rem (12px) |
| `"4"` | `"space-16"` | 1rem (16px) |
| `"5"` | `"space-20"` | 1.25rem (20px) |
| `"6"` | `"space-24"` | 1.5rem (24px) |
| `"7"` | `"space-28"` | 1.75rem (28px) |
| `"8"` | `"space-32"` | 2rem (32px) |
| `"9"` | `"space-36"` | 2.25rem (36px) |
| `"10"` | `"space-40"` | 2.5rem (40px) |
| `"11"` | `"space-44"` | 2.75rem (44px) |
| `"12"` | `"space-48"` | 3rem (48px) |
| `"14"` | `"space-56"` | 3.5rem (56px) |
| `"16"` | `"space-64"` | 4rem (64px) |
| `"18"` | `"space-72"` | 4.5rem (72px) |
| `"20"` | `"space-80"` | 5rem (80px) |
| `"24"` | `"space-96"` | 6rem (96px) |
| `"32"` | `"space-128"` | 8rem (128px) |

### Valid V8 Space Tokens (AkselSpaceToken)

```
"space-0" | "space-1" | "space-2" | "space-4" | "space-6" | "space-8" |
"space-12" | "space-16" | "space-20" | "space-24" | "space-28" | "space-32" |
"space-36" | "space-40" | "space-44" | "space-48" | "space-56" | "space-64" |
"space-72" | "space-80" | "space-96" | "space-128"
```

Note: `space-3`, `space-5`, `space-7`, `space-9`, `space-10`, `space-11`, `space-14`, `space-15`, `space-18` do **NOT** exist.

### Props that need spacing token migration

These props accept `AkselSpaceToken`:
- `gap`
- `padding`, `paddingInline`, `paddingBlock`
- `margin`, `marginInline`, `marginBlock`
- `inset`, `top`, `right`, `bottom`, `left`

These appear on components: `Box`, `VStack`, `HStack`, `HGrid`, `Page.Block`, `Bleed`, and other layout primitives.

### Automated fix script

Use a Python script to batch-convert all spacing props. The recommended approach is a **two-pass** process:

**Pass 1:** Convert V7 numeric values to V8 `space-N` format (naive mapping):
- `padding="4"` → `padding="space-4"` (this is wrong, but gets the format right)

**Pass 2:** Run this script to apply the ×4 correction:

```python
#!/usr/bin/env python3
"""Fix Aksel V7→V8 spacing token mapping: space-N → space-{N*4}."""

import re, os, glob

V7_TO_V8 = {
    0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28,
    8: 32, 9: 36, 10: 40, 11: 44, 12: 48, 14: 56, 16: 64,
    18: 72, 20: 80, 24: 96, 32: 128,
}

def replace_token(match):
    num = int(match.group(1))
    if num in V7_TO_V8:
        return f"space-{V7_TO_V8[num]}"
    print(f"  WARNING: Unknown V7 spacing value: space-{num}")
    return match.group(0)

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    new_content = re.sub(r'space-(\d+)', replace_token, content)
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        return True
    return False

tsx_files = glob.glob(os.path.join('src', '**', '*.tsx'), recursive=True)
changed = sum(1 for f in sorted(tsx_files) if fix_file(f))
print(f"Total files fixed: {changed}")
```

> **Tip:** If you do this in a single pass instead, build the full V7→V8 mapping directly: `"4"` → `"space-16"`, `"8"` → `"space-32"`, etc.

### Props that do NOT use space tokens

Do **NOT** apply the space-N mapping to these props — they use different token types:

| Prop | Token Type | Valid Values |
|---|---|---|
| `borderRadius` | `AkselBorderRadiusToken` | `"2"`, `"4"`, `"8"`, `"12"`, `"16"`, `"full"` |
| `borderColor` | `AkselColoredBorderToken` | `"danger"`, `"neutral-subtle"`, etc. |
| `borderWidth` | Plain pixel string | `"1"`, `"2"`, etc. |
| `background` | `AkselBackgroundToken` | `"default"`, `"raised"`, etc. |
| `shadow` | `AkselShadowToken` | `"small"`, `"medium"`, etc. |

### borderColor migration

V8 changed border color token names:
- `"border-danger"` → `"danger"`
- `"border-subtle"` → `"neutral-subtle"`
- `"border-strong"` → `"neutral-strong"`

---

## Step 6: Fix CSS Overrides for V8 Component Structure Changes

### Radio component (`.aksel-radio`)

V8 changed the Radio component from `display: flex` to `display: grid`:

**V7:** `.navds-radio` → position: relative, width: fit-content. Label (`.navds-radio__label`) used `display: flex` with a `::before` pseudo-element for the indicator.

**V8:** `.aksel-radio` → `display: grid; grid-template-columns: auto 1fr; padding: var(--ax-space-12) 0; width: fit-content;`. Input and label are separate grid children.

If you have custom "radio panel" styling (full-width radios with background colors), move `width`, `padding`, `border-radius` from the label selector to the root `.aksel-radio` element:

```css
/* V7 (broken in V8) */
.radioPanel {
  :global(.navds-radio__label) {
    width: 100%;
    padding: 0.8rem 0.5rem;
    border-radius: 4px;
  }
}

/* V8 (fixed) */
.radioPanel {
  flex: 1;
  background-color: var(--ax-bg-default);
  width: 100%;
  border-radius: 4px;
  padding: 0.8rem 0.5rem;
  align-items: center;

  /* Fix focus outline to cover entire panel, not just the label */
  &:focus-within::after {
    inset: 0;
    border-radius: 4px;
  }
}

.radioPanel:has(input[type=radio]:checked) {
  background-color: var(--ax-bg-accent-moderate-hover);
  border-radius: 4px;
}

.radioPanel:hover {
  background-color: var(--ax-bg-accent-moderate-hover);
  border-radius: 4px;
}
```

**Key insight:** In V8, the focus ring (`::after`) uses `inset` values that leave a gap around the label. Setting `inset: 0` on `&:focus-within::after` makes the focus outline cover the entire panel.

### RepeatableBox dropdown background bleed-through

When form controls (CountryDropdown, Select, Combobox) are inside colored containers (e.g., `.new` with success background), the control background bleeds through. Fix by setting explicit backgrounds on the container's form controls:

```css
.repeatableBox {
  /* Override dropdown/select backgrounds to prevent color bleed from parent */
  :global(.c-countrySelect__select__control),
  :global(.aksel-select__input),
  :global(.aksel-combobox__wrapper) {
    background-color: var(--ax-bg-default);
  }
}
```

---

## Step 7: Dark Mode Support

Aksel V8 has **built-in dark mode** via the CSS class `.dark`. Adding this class to any ancestor element switches all `--ax-*` CSS custom properties to dark variants automatically. The `color-scheme: dark` property is also set.

### Implementation

Add a toggle button (e.g., in your Header component):

```tsx
import { MoonIcon, SunIcon } from '@navikt/aksel-icons'
import { useState, useEffect, useCallback } from 'react'

const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem('darkMode')
  return saved ? saved === 'true' : document.documentElement.classList.contains('dark')
})

useEffect(() => {
  document.documentElement.classList.toggle('dark', darkMode)
  localStorage.setItem('darkMode', String(darkMode))
}, [darkMode])

const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), [])

// In JSX (inside InternalHeader, next to any existing buttons):
<InternalHeader.Button onClick={toggleDarkMode}>
  {darkMode
    ? <SunIcon style={{fontSize: "1.5rem"}} title="Bytt til lyst tema" />
    : <MoonIcon style={{fontSize: "1.5rem"}} title="Bytt til mørkt tema" />
  }
</InternalHeader.Button>
```

### Replace hardcoded colors for dark mode compatibility

Search for hardcoded hex/rgba colors in all CSS files and replace with Aksel CSS variables:

```bash
grep -rn 'background-color: #\|background: #\|color: #\|background-color: rgba' src/ --include='*.css'
```

Common replacements:

| Hardcoded Color | Aksel Variable | Purpose |
|---|---|---|
| `#ffffff` / `white` backgrounds | `var(--ax-bg-default)` | Default background |
| `#000000` text | `var(--ax-text-neutral)` | Default text |
| `#3e3832` text | `var(--ax-text-neutral)` | Text color |
| `#0067C5` borders | `var(--ax-border-accent)` | Accent/action borders |
| `rgba(236, 243, 153, 0.5)` (yellow-green) | `var(--ax-bg-success-moderate)` | "New item" highlight |
| `rgba(255, 0, 0, 0.2)` (red) | `var(--ax-bg-danger-moderate)` | Error highlight |
| `#FCE97F` (gold flash) | `var(--ax-bg-warning-moderate)` | Warning/flash animation |

Also fix any component token overrides on `#root`:

```css
/* BAD — won't adapt to dark mode */
#root {
  --axc-button-secondary-bg: white;
}

/* GOOD — uses semantic variable */
#root {
  --axc-button-secondary-bg: var(--ax-bg-default);
}
```

### Dark mode fixes for third-party components

If you use `@navikt/landvelger` (CountryDropdown) with `react-select`, its dropdown menu portals to `document.body` and needs global dark mode styles:

```css
/* CountryDropdown dark mode overrides */
.dark .c-countrySelect__select__control {
  background-color: var(--ax-bg-default);
  border-color: var(--ax-border-neutral);
}

.dark .c-countrySelect__select__menu {
  background-color: var(--ax-bg-default);
  color: var(--ax-text-neutral);
}

.dark .c-countrySelect__select__option {
  background-color: var(--ax-bg-default);
  color: var(--ax-text-neutral);
}

.dark .c-countrySelect__select__option:hover,
.dark .c-countrySelect__select__option--is-focused {
  background-color: var(--ax-bg-neutral-moderate-hover);
  color: var(--ax-text-neutral);
}

.dark .c-countrySelect__select__option--is-selected {
  background-color: var(--ax-bg-accent-moderate);
  color: var(--ax-text-neutral);
}

.dark .c-countrySelect__select__single-value,
.dark .c-countrySelect__select__input-container,
.dark .c-countrySelect__select__placeholder {
  color: var(--ax-text-neutral);
}
```

Place these in your root `global.css` since react-select menus portal to `document.body`.

---

## Step 8: Third-Party Compatibility (@navikt/landvelger)

The `@navikt/landvelger` package (CountryDropdown) has two compatibility issues:

### Issue 1: Old CSS class names

It still uses V7 CSS class names (`navds-label`, `navds-error-message`, `navds-error-message--medium`), but V8 only defines `aksel-*` classes. Add compatibility rules in `global.css`:

```css
/* @navikt/landvelger still uses old navds- class names internally */
.navds-label {
  font-size: var(--ax-font-size-large);
  font-weight: var(--ax-font-weight-bold);
  line-height: var(--ax-font-line-height-large);
}

.navds-error-message,
.navds-error-message--medium {
  color: var(--ax-text-danger);
  font-size: var(--ax-font-size-medium);
}
```

### Issue 2: V7 CSS variables in inline styles

The landvelger package uses V7 CSS variables (`--a-border-default`, `--a-surface-default`, etc.) directly in inline `styles` objects within its JavaScript. These V7 variables no longer exist in V8's CSS, so they resolve to nothing. Create aliases:

```css
/* @navikt/landvelger uses V7 CSS variables in inline styles — alias them to V8 equivalents */
:root {
  --a-border-default: var(--ax-border-neutral);
  --a-surface-default: var(--ax-bg-default);
  --a-surface-subtle: var(--ax-bg-neutral-soft);
  --a-surface-danger: var(--ax-border-danger);
  --a-surface-action-hover: var(--ax-bg-accent-strong-hover);
  --a-text-default: var(--ax-text-neutral);
}
```

> **Note:** Check your specific version of `@navikt/landvelger` for the exact V7 tokens it uses. You can inspect the source with:
> ```bash
> grep -o 'var(--a-[a-z-]*)'  node_modules/@navikt/landvelger/lib/index.cjs | sort -u
> ```

---

## Step 9: Self-Audit Checklist

After completing all migration steps, audit the codebase for these common issues:

### Colors & Dark Mode
- [ ] No remaining hardcoded hex colors (`#ffffff`, `#000000`, `#3e3832`, etc.) in CSS
- [ ] No remaining hardcoded `rgba()` colors in CSS
- [ ] No hardcoded `white` or `black` in component token overrides (use `var(--ax-bg-default)`)
- [ ] All `--axc-*` overrides use semantic variables, not hardcoded colors
- [ ] Dark mode toggle works and persists via localStorage

### CSS Tokens & Classes
- [ ] No remaining `--a-*` tokens (should all be `--ax-*`)
- [ ] No remaining `--ac-*` tokens (should all be `--axc-*`)
- [ ] No remaining `navds-*` class references in project CSS/TSX (except in compat rules)
- [ ] Third-party packages with V7 tokens have aliases in `:root`

### Spacing
- [ ] All spacing props use `"space-{N×4}"` format (not naive `"space-N"`)
- [ ] `borderRadius` uses plain numbers (`"2"`, `"4"`, `"8"`, etc.), NOT space tokens
- [ ] `borderWidth` uses plain pixel strings, NOT space tokens
- [ ] No redundant ternaries like `{cond ? "space-16" : "space-16"}`
- [ ] Composite values properly converted: `paddingInline="4 0"` → `"space-16 space-0"`

### Component Structure
- [ ] Custom radio panel styling targets root `.aksel-radio`, not `.aksel-radio__label`
- [ ] `border-color` CSS rules have a corresponding `border` property defined
- [ ] Focus outlines on custom panels use `inset: 0` to cover the whole panel

---

## Step 10: Verify

```bash
npm run typecheck   # Must pass with 0 errors
npm run build       # Must build successfully
```

If TypeScript reports `TS2769: No overload matches this call` errors, they are almost always spacing token type mismatches. Check:
1. Is the spacing value a valid `AkselSpaceToken`?
2. Is the N×4 mapping applied correctly?
3. Is `borderRadius` accidentally using `"space-N"` format? (It should use plain `"N"`)
4. Is `borderColor` using the old `"border-*"` format? (Should be just the color role)

---

## Quick Reference: V8 Token Types

```typescript
// Space tokens (for gap, padding, margin, inset, etc.)
type AkselSpaceToken = "space-0" | "space-1" | "space-2" | "space-4" | "space-6" |
  "space-8" | "space-12" | "space-16" | "space-20" | "space-24" | "space-28" |
  "space-32" | "space-36" | "space-40" | "space-44" | "space-48" | "space-56" |
  "space-64" | "space-72" | "space-80" | "space-96" | "space-128"

// Border radius tokens
type AkselBorderRadiusToken = "2" | "4" | "8" | "12" | "16" | "full"

// Color roles (for borderColor, etc.)
type AkselMainColorRole = "neutral" | "accent"
type AkselStatusColorRole = "info" | "success" | "warning" | "danger"

// CSS variable prefixes
// V7: --a-*   → V8: --ax-*    (design tokens)
// V7: --ac-*  → V8: --axc-*   (component tokens)
// V7: navds-* → V8: aksel-*   (CSS class names)
```

---

## Common Pitfalls

1. **DO NOT map V7 `"N"` → V8 `"space-N"`**. The correct mapping is `"space-{N×4}"`. Getting this wrong makes all spacing 4× too small. TypeScript will NOT catch this because the wrong values are still valid tokens.

2. **`borderRadius` does NOT use space tokens.** It uses plain numbers: `"2"`, `"4"`, `"8"`, `"12"`, `"16"`, `"full"`. If you accidentally convert these, TypeScript will complain.

3. **Some V7 spacing values don't have direct V8 equivalents.** V7 `"3"`, `"5"`, `"7"`, `"9"`, `"10"`, `"11"`, `"14"`, `"18"` map to V8 `"space-12"`, `"space-20"`, `"space-28"`, `"space-36"`, `"space-40"`, `"space-44"`, `"space-56"`, `"space-72"` respectively (all valid V8 tokens via the N×4 formula).

4. **Composite spacing values** like `paddingInline="4 8"` need both values converted: `paddingInline="space-16 space-32"`.

5. **Dynamic/conditional spacing** in JSX needs manual attention:
   ```tsx
   // V7
   paddingBlock={inEditMode ? "4" : "2"}
   // V8
   paddingBlock={inEditMode ? "space-16" : "space-8"}
   ```

6. **Responsive spacing objects** need all values converted:
   ```tsx
   // V7
   padding={{xs: "4", md: "8"}}
   // V8
   padding={{xs: "space-16", md: "space-32"}}
   ```

7. **The v8-tokens codemod only handles CSS files**, not JSX/TSX spacing props. The React component codemods handle component API changes but NOT the spacing value format change.

8. **V8 Radio uses `display: grid`** instead of flex. Custom radio panel styling that targets `.aksel-radio__label` may need to be moved to the root `.aksel-radio` element.

9. **Setting `border-color` without `border` defined is a no-op.** If V7 defined border via a class you're overriding, make sure V8's structure still provides the base `border` property.

10. **Third-party @navikt packages may still use V7 tokens.** The `@navikt/landvelger` package uses V7 CSS variables in inline JavaScript styles and old `navds-*` class names. You must provide backward-compatible aliases.

11. **Don't forget component token overrides.** If you have `--axc-button-secondary-bg: white` (or similar), replace `white` with `var(--ax-bg-default)` for dark mode.

12. **`var(--ax-bg-warning-moderate)` vs `var(--ax-bg-success-moderate)`.** For "new item" highlights in repeatable rows, `--ax-bg-success-moderate` (green-tinted) looks better than `--ax-bg-warning-moderate` (yellow). This is a design choice.

---

## Full Conversation History

This section documents the complete sequence of changes made during the eux-web-app migration, organized chronologically. Use this to understand the order of operations and the iterative nature of the fixes.

### 1. Initial Migration (Steps 1–4)

**Request:** Implement GitHub issue #369 — migrate from Aksel V7 to V8.

**Actions taken:**
- Installed `@navikt/ds-react@8.6.0`, `@navikt/ds-css@8.6.0`, `@navikt/aksel-icons@8.6.0`
- Ran `npx aksel codemod v8-tokens --force` — migrated 101/106 CSS tokens across 16 files
- Manually fixed 5 remaining tokens: `--a-white` → `white`, `--ac-button-secondary-bg` → `--axc-button-secondary-bg`, `--a-surface-transparent` → `transparent`
- Replaced `navds-` → `aksel-` CSS class prefix across 18 files
- Ran all 9 React codemods (v8-list, v8-prop-deprecate, v8-box, v8-tag-variant, v8-toggle-group-variant, v8-accordion-variant, v8-chips-variant, v8-button-variant, v8-link-variant)
- Initial spacing conversion (WRONG — did naive `"N"` → `"space-N"`)
- Fixed borderRadius props (reverted 14 files — borderRadius uses plain numbers, not space tokens)
- Fixed borderColor props (`"border-danger"` → `"danger"`, `"border-subtle"` → `"neutral-subtle"`)
- Typecheck and build passed (but spacing was visually wrong)

### 2. Spacing Fix (Step 5)

**Problem reported:** All gaps, paddings, and margins were too small compared to V7. User theorized the mapping was incorrect.

**Root cause confirmed:** V7 `padding="4"` = 1rem (16px), but V8 `padding="space-4"` = 0.25rem (4px). The naive mapping made everything 4× too small.

**Fix:** Wrote Python script to correct all `space-N` → `space-{N×4}` across 149 TSX files. Also fixed composite values like `paddingInline="space-12 space-12"` → `"space-40 space-40"` (was V7 `"10"`).

### 3. Radio Panel Styling (Step 6)

**Problem reported:** Radio panels had incorrect height, alignment, and the focus border only surrounded the label text instead of the whole panel.

**Root cause:** V8 changed Radio from `display: flex` to `display: grid`. Custom panel styles targeting `:global(.aksel-radio__label)` no longer worked correctly.

**Fix (two iterations):**
1. Moved `width`, `padding`, `border-radius` from nested label selector to `.radioPanel` root. Added `align-items: center`.
2. Added `&:focus-within::after { inset: 0; border-radius: 4px; }` to make focus outline cover the entire panel.

### 4. Dark Mode Toggle (Step 7)

**Request:** Add a dark/light mode toggle button next to the star icon in the header.

**Implementation:**
- Added `MoonIcon`/`SunIcon` toggle in `Header.tsx` using `InternalHeader.Button`
- State persisted to `localStorage`
- Toggles `document.documentElement.classList.toggle('dark')` which activates Aksel V8's built-in dark mode

### 5. Dark Mode Color Fixes

**Problems reported (iterative):**

1. **White background on frontpage:** Hardcoded `#ffffff`, `#000000`, `#0067C5` in `Forside.module.css` didn't adapt to dark mode.
   - **Fix:** Replaced with `var(--ax-bg-default)`, `var(--ax-text-neutral)`, `var(--ax-border-accent)`

2. **RepeatableBox `.new` and `.error` colors:** Used hardcoded `rgba()` values.
   - **Fix:** `rgba(236, 243, 153, 0.5)` → `var(--ax-bg-success-moderate)`, `rgba(255, 0, 0, 0.2)` → `var(--ax-bg-danger-moderate)`
   - Applied same fix in 6 other CSS files (PDU1.module.css, Refusjon.module.css, Motregninger.module.css, DekkedePerioder.module.css, RettTilYtelserFSED.module.css, VedtakForF003.module.css)
   - User manually changed `--ax-bg-warning-moderate` to `--ax-bg-success-moderate` for the "new" state, preferring the green tint

### 6. CountryDropdown Fixes

**Problems reported (iterative):**

1. **Background bleed:** CountryDropdown inside `.new`/`.error` repeatableBox inherited the green/red background.
   - **Fix:** Added `:global(.c-countrySelect__select__control)` with `background-color: var(--ax-bg-default)` — initially scoped to `&.new, &.error`, then moved to root `.repeatableBox` level per user request.

2. **Dark mode appearance:** Dropdown menu had unreadable text on wrong background.
   - **Fix:** Added global dark mode overrides for all react-select sub-elements in `global.css`

3. **Label not bold:** `@navikt/landvelger` uses `navds-label` class which V8 doesn't define.
   - **Fix:** Added `.navds-label` and `.navds-error-message` compat rules in `global.css`

### 7. Self-Audit

**Final review pass found and fixed:**

1. **Redundant ternary:** `paddingInline={inEditMode ? "space-16" : "space-16"}` → `paddingInline="space-16"` in `Perioder.tsx`
2. **Hardcoded `white`:** `--axc-button-secondary-bg: white` → `var(--ax-bg-default)` in `global.css`
3. **Missing compat class:** Added `.navds-error-message--medium` to compat rules
4. **V7 token aliases:** Added `:root` aliases for V7 CSS variables used in landvelger's inline styles (`--a-border-default`, `--a-surface-default`, `--a-surface-subtle`, `--a-surface-danger`, `--a-surface-action-hover`, `--a-text-default`)
5. **Ineffective CSS:** Removed `border-color` rules on `.radioPanel:checked/:hover` that had no effect (no `border` property defined)
6. **Hardcoded hex colors:** `#3e3832` → `var(--ax-text-neutral)` in `TopContainer.module.css`, `#ffffff`/`#FCE97F` → CSS variables in `RelasjonUtland.module.css`

### Files Modified Summary

| Category | Files | Description |
|---|---|---|
| Package updates | `package.json`, `package-lock.json` | V7 → V8 (8.6.0) |
| CSS token codemod | ~16 CSS files | `--a-*` → `--ax-*` |
| Class prefix | ~18 files | `navds-*` → `aksel-*` |
| React codemods | ~60 TSX files | Component API changes |
| Spacing fix | ~149 TSX files | V7 "N" → V8 "space-{N×4}" |
| Dark mode colors | 8 CSS files | Hardcoded colors → CSS variables |
| Radio panel | `common.module.css` | Grid layout restructure |
| Dark mode toggle | `Header.tsx` | MoonIcon/SunIcon toggle |
| Frontpage colors | `Forside.module.css` | Hex → CSS variables |
| CountryDropdown | `global.css`, `common.module.css` | Dark mode, background fix, compat |
| Third-party compat | `global.css` | navds-label, V7 token aliases |
| Root styles | `global.css` | body, #root, component tokens |
| Debug container | `TopContainer.module.css` | `#3e3832` → variable |
| Flash animation | `RelasjonUtland.module.css` | `#ffffff`/`#FCE97F` → variables |

### Final State

- `npm run typecheck` passes with 0 errors
- `npm run build` passes successfully
- No remaining hardcoded hex/rgba colors in CSS
- No remaining V7 tokens (`--a-*`) or class prefixes (`navds-*`) in project source
- V7 token aliases provided for `@navikt/landvelger` compatibility
- Dark mode fully functional with localStorage persistence
