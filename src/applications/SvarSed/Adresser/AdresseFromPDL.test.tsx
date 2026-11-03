import { render, screen } from '@testing-library/react'
import { stageSelector } from 'setupTests'
import AdresseFromPDL, { AdresseFromPDLProps } from './AdresseFromPDL'

jest.mock('components/AdresseBox/AdresseBox', () => ({ adresse }: any) => <span>{adresse.by}</span>)

const adresser = [
  { type: 'bosted', gate: 'Gate 1', by: 'Oslo', landkode: 'NOR' },
  { type: 'opphold', gate: 'Broadway 1', by: 'New York', landkode: 'USA' }
]
const countryCodes = {
  'v4.3': { euEftaLand: [{ landkode: 'USA', landnavn: 'USA' }] },
  'v4.4': { euEftaLand: [{ landkode: 'NOR', landnavn: 'Norge' }] }
}
const props: AdresseFromPDLProps = {
  fnr: '12345678901',
  selectedAdresser: [],
  onAdresserChanged: jest.fn(),
  singleAdress: true
}

describe('applications/SvarSed/Adresser/AdresseFromPDL', () => {
  beforeEach(() => {
    stageSelector({}, {
      adresser,
      gettingAdresser: false,
      replySed: { sak: { cdmVersjon: '4.4' } },
      countryCodes,
      cdmVersjonApp: '4.3'
    })
  })

  it('shows all PDL addresses without a country list filter', () => {
    render(<AdresseFromPDL {...props} />)
    expect(screen.getByText('Oslo')).toBeInTheDocument()
    expect(screen.getByText('New York')).toBeInTheDocument()
  })

  it('only shows PDL addresses in the country list for the SED CDM version', () => {
    render(<AdresseFromPDL {...props} countryCodeListName='euEftaLand' />)
    expect(screen.getByText('Oslo')).toBeInTheDocument()
    expect(screen.queryByText('New York')).not.toBeInTheDocument()
  })
})
