import { CountryCodes } from 'declarations/types'

// Institution IDs from IR are prefixed with RINA's two-letter country code (euLandkode), e.g. "SE:1234" or "EL:5678"
export const getLandkodeFromInstitusjonsId = (
  institusjonsId: string | undefined,
  countryCodes: CountryCodes | null | undefined,
  cdmVersjon: string | undefined
): string | undefined => {
  if (!institusjonsId || !institusjonsId.includes(':') || !countryCodes || !cdmVersjon) {
    return undefined
  }
  const euLandkode = institusjonsId.split(':')[0]
  const euEftaLand = countryCodes[`v${cdmVersjon}` as keyof CountryCodes]?.euEftaLand
  return euEftaLand?.find(land => land.euLandkode === euLandkode)?.landkode
}
