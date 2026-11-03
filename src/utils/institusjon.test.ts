import { CountryCodes, SimpleCountry } from 'declarations/types'
import { getLandkodeFromInstitusjonsId } from './institusjon'

const euEftaLand: Array<SimpleCountry> = [
  { landkode: 'NOR', landnavn: 'Norge', euLandkode: 'NO' },
  { landkode: 'SWE', landnavn: 'Sverige', euLandkode: 'SE' },
  { landkode: 'GRC', landnavn: 'Hellas', euLandkode: 'EL' },
  { landkode: 'GBR', landnavn: 'Storbritannia', euLandkode: 'UK' }
]
const countryCodes = { 'v4.4': { euEftaLand } } as unknown as CountryCodes

describe('utils/institusjon', () => {
  it('getLandkodeFromInstitusjonsId returns landkode from euEftaLand for the CDM version matching the RINA prefix', () => {
    expect(getLandkodeFromInstitusjonsId('SE:1234', countryCodes, '4.4')).toEqual('SWE')
    expect(getLandkodeFromInstitusjonsId('NO:NAVAT07', countryCodes, '4.4')).toEqual('NOR')
    expect(getLandkodeFromInstitusjonsId('EL:1234', countryCodes, '4.4')).toEqual('GRC')
    expect(getLandkodeFromInstitusjonsId('UK:1234', countryCodes, '4.4')).toEqual('GBR')
  })

  it('getLandkodeFromInstitusjonsId returns undefined when no valid prefix, country codes or CDM version', () => {
    expect(getLandkodeFromInstitusjonsId(undefined, countryCodes, '4.4')).toBeUndefined()
    expect(getLandkodeFromInstitusjonsId('1234', countryCodes, '4.4')).toBeUndefined()
    expect(getLandkodeFromInstitusjonsId('GR:1234', countryCodes, '4.4')).toBeUndefined()
    expect(getLandkodeFromInstitusjonsId('SE:1234', undefined, '4.4')).toBeUndefined()
    expect(getLandkodeFromInstitusjonsId('SE:1234', countryCodes, undefined)).toBeUndefined()
    expect(getLandkodeFromInstitusjonsId('SE:1234', countryCodes, '4.2')).toBeUndefined()
  })
})
