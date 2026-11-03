import { CountryCodes } from 'declarations/types'
import { KompetentLand } from 'declarations/u007'
import { getInstitusjonLandkode } from './validation'

const countryCodes = {
  'v4.4': { euEftaLand: [{ landkode: 'SWE', landnavn: 'Sverige', euLandkode: 'SE' }] }
} as unknown as CountryCodes

describe('applications/SvarSed/InstitusjonDagpenger/validation', () => {
  it('getInstitusjonLandkode follows the address country when no institution is selected', () => {
    const kompetentLand: KompetentLand = {
      bruker: { adresse: { landkode: 'DNK' } },
      institusjon: { __landkode: 'FIN' }
    }
    expect(getInstitusjonLandkode(kompetentLand, countryCodes, '4.4')).toEqual('DNK')
  })

  it('getInstitusjonLandkode uses the selected institution country over the address', () => {
    const kompetentLand: KompetentLand = {
      bruker: { adresse: { landkode: 'DNK' } },
      institusjon: { id: 'SE:1234', navn: 'Svensk institusjon' }
    }
    expect(getInstitusjonLandkode(kompetentLand, countryCodes, '4.4')).toEqual('SWE')
  })
})
