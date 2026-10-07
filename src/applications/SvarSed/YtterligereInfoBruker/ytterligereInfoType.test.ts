import { toYtterligereInfoType } from './ytterligereInfoType'

describe('applications/SvarSed/YtterligereInfoBruker/ytterligereInfoType', () => {
  it('maps the legacy radio value to the typed value', () => {
    expect(toYtterligereInfoType('anmodning_om_mer_informasjon')).toEqual('anmodning_om_tilleggsinformasjon')
  })

  it('keeps typed values as they are', () => {
    expect(toYtterligereInfoType('anmodning_om_tilleggsinformasjon')).toEqual('anmodning_om_tilleggsinformasjon')
    expect(toYtterligereInfoType('melding_om_mer_informasjon')).toEqual('melding_om_mer_informasjon')
  })

  it('keeps undefined as undefined', () => {
    expect(toYtterligereInfoType(undefined)).toBeUndefined()
  })
})
