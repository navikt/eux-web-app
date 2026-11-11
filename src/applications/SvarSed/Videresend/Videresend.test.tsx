import { fireEvent, render, screen } from '@testing-library/react'
import { getInstitusjoner } from 'actions/sak'
import { updateReplySed } from 'actions/svarsed'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import Videresend from 'applications/SvarSed/Videresend/Videresend'
import { Videresend as VideresendType, X007Sed } from 'declarations/x007'
import { stageSelector } from 'setupTests'

jest.mock('actions/svarsed', () => ({
  updateReplySed: jest.fn((needle: string, value: any) => ({ type: 'UPDATE', payload: { needle, value } }))
}))
jest.mock('actions/validation', () => ({
  resetValidation: jest.fn(),
  setValidation: jest.fn()
}))
jest.mock('actions/sak', () => ({
  getInstitusjoner: jest.fn(() => ({ type: 'SAK/INSTITUSJONER/REQUEST' })),
  releaseInstitusjoner: jest.fn(() => ({ type: 'SAK/INSTITUSJONER/RELEASE' }))
}))
jest.mock('hooks/useUnmount', () => jest.fn())
jest.mock('components/CountryDropdown/CountryDropdown', () => (props: any) => <div data-testid={props.id} />)

const namespace = 'x007-bruker-videresend'
const nav = { id: 'NO:NAVAT07', navn: 'NAV ACC 07' }

const makeProps = (videresend: VideresendType): MainFormProps => ({
  parentNamespace: 'x007',
  personID: 'bruker',
  replySed: {
    sedType: 'X007',
    sak: { sakType: 'U_BUC_02', navinstitusjon: nav },
    videresend
  } as unknown as X007Sed,
  updateReplySed,
  setReplySed: jest.fn()
} as MainFormProps)

describe('applications/SvarSed/Videresend/Videresend', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    stageSelector({}, {
      validation: {},
      institusjonRequests: {
        'U_BUC_02:NOR': {
          requestId: 'norway',
          loading: false,
          institusjoner: [{ institusjonsID: 'NO:NAVAT08', navn: 'NAV ACC 08', landkode: 'NOR', buctype: 'U_BUC_02' }]
        }
      }
    })
  })

  it('only offers Norwegian institutions, without a country selector', () => {
    render(<Videresend {...makeProps({ fjernInstitusjonId: nav.id })} />)
    expect(getInstitusjoner).toHaveBeenCalledWith('U_BUC_02', 'NOR', expect.any(String))
    expect(screen.queryByTestId(`${namespace}-leggTilInstitusjon-landkode`)).not.toBeInTheDocument()

    fireEvent.change(screen.getByTestId(`${namespace}-leggTilInstitusjon-id`), { target: { value: 'NO:NAVAT08' } })
    expect(updateReplySed).toHaveBeenCalledWith('videresend.leggTilInstitusjonId', 'NO:NAVAT08')
    expect(updateReplySed).toHaveBeenCalledWith('videresend.leggTilInstitusjonNavn', 'NAV ACC 08')
  })

  it('keeps showing a saved recipient that is not in the registry result', () => {
    render(<Videresend {...makeProps({ fjernInstitusjonId: nav.id, leggTilInstitusjonId: 'NO:OLD', leggTilInstitusjonNavn: 'Old institution' })} />)
    expect(screen.getByTestId(`${namespace}-leggTilInstitusjon-id`)).toHaveValue('NO:OLD')
    expect(screen.getByRole('option', { name: 'Old institution' })).toBeInTheDocument()
  })
})
