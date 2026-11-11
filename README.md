# EUX-WEB-APP
Dette er prosjektet for EUX-WEB-APP, en frontend applikasjon i porteføljen til EUX-koblingskomponenten

TODO Mer beskrivelse.

## Sesongtema på forsiden

Forsiden og toppmenyen (på alle sider) kan få et sesongtema (f.eks. jul) – se `src/components/SeasonalTheme/`.

- **Slå av/på for alle:** sett `SEASONAL_THEME_MODE` i `themes.ts` til `'auto'` (følger kalenderen), `'off'` eller en tema-id (f.eks. `'christmas'`).
- **Forhåndsvisning:** legg til `?sesongtema=christmas` (eller `off`/`auto`) i URL-en. Valget gjelder til siden lastes på nytt uten parameteret.
- **Brukeren** kan skru av/på pynten med knappen på forsiden (lagres i `localStorage`).
- **Nytt tema:** lag en mappe ved siden av `christmas/` med en `SeasonalTheme`-definisjon (periode, CSS-klasse med `--seasonal-*`-variabler og valgfrie dekorasjonskomponenter), og legg den til i `SEASONAL_THEMES`. Bevegelige høytider (påske) kan bruke en funksjon som `season`.
