import { YtterligereInfoType } from 'declarations/h001'

// value used by the legacy (pre-typed) H001 radio choice for "anmodning om tilleggsinformasjon"
const LEGACY_ANMODNING_OM_MER_INFORMASJON = 'anmodning_om_mer_informasjon'

export const toYtterligereInfoType = (value: string | undefined): YtterligereInfoType | undefined =>
  value === LEGACY_ANMODNING_OM_MER_INFORMASJON
    ? 'anmodning_om_tilleggsinformasjon'
    : value as YtterligereInfoType | undefined
