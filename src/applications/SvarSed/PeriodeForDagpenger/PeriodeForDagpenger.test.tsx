import { fireEvent, render, screen } from '@testing-library/react'
import { updateReplySed } from 'actions/svarsed'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import PeriodeForDagpenger from 'applications/SvarSed/PeriodeForDagpenger/PeriodeForDagpenger'
import { PeriodeDagpenger, ReplySed } from 'declarations/sed'
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
jest.mock('hooks/useLocalValidation', () => () => [{}, jest.fn(), jest.fn(() => true)])
jest.mock('utils/performValidation', () => jest.fn(() => false))
jest.mock('components/Forms/PeriodeInput', () => () => null)
jest.mock('components/Forms/PeriodeText', () => () => null)
jest.mock('components/CountryDropdown/CountryDropdown', () => (props: any) => (
  <button data-testid={props.id} onClick={() => props.onOptionSelected({ value3: 'DNK' })}>
    {props.values ?? 'no-country'}
  </button>
))

const namespace = 'u002-bruker-periodefordagpenger'
const nav = { id: 'NO:NAVAT07', navn: 'NAV ACC 07' }
const periode = { startdato: '2024-01-01', sluttdato: '2024-06-30' }
const saved: PeriodeDagpenger = { periode, institusjon: { id: 'SE:1234', navn: 'Swedish institution' } }

const makeProps = (dagpengeperioder: Array<PeriodeDagpenger>): MainFormProps => ({
  parentNamespace: 'u002',
  personID: 'bruker',
  replySed: {
    sedType: 'U002',
    sak: { sakType: 'U_BUC_02', cdmVersjon: '4.3', navinstitusjon: nav },
    dagpengeperioder
  } as unknown as ReplySed,
  updateReplySed,
  setReplySed: jest.fn()
} as MainFormProps)

describe('applications/SvarSed/PeriodeForDagpenger/PeriodeForDagpenger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    stageSelector({}, {
      validation: {},
      countryCodes: { 'v4.3': { euEftaLand: [{ landkode: 'SWE', euLandkode: 'SE' }, { landkode: 'NOR', euLandkode: 'NO' }] } },
      institusjonRequests: {
        'U_BUC_02:SWE': {
          requestId: 'sweden',
          loading: false,
          institusjoner: [
            { institusjonsID: 'SE:1234', navn: 'Swedish institution', landkode: 'SWE', buctype: 'U_BUC_02' },
            { institusjonsID: 'SE:5678', navn: 'Other Swedish institution', landkode: 'SWE', buctype: 'U_BUC_02' }
          ]
        },
        'U_BUC_02:NOR': {
          requestId: 'norway',
          loading: false,
          institusjoner: [{ institusjonsID: nav.id, navn: nav.navn, landkode: 'NOR', buctype: 'U_BUC_02' }]
        }
      }
    })
  })

  it('a new period defaults to the NAV institution, which can be changed without being reset', () => {
    render(<PeriodeForDagpenger {...makeProps([])} />)
    fireEvent.click(screen.getByText('el:button-add-new-x'))
    expect(screen.getByTestId(`${namespace}-institusjon-landkode`)).toHaveTextContent('NOR')
    expect(screen.getByTestId(`${namespace}-institusjon-id`)).toHaveValue(nav.id)

    fireEvent.click(screen.getByTestId(`${namespace}-institusjon-landkode`))
    expect(screen.getByTestId(`${namespace}-institusjon-landkode`)).toHaveTextContent('DNK')
    expect(screen.getByTestId(`${namespace}-institusjon-id`)).toHaveValue('')
    expect(updateReplySed).not.toHaveBeenCalled()
  })

  it('editing only updates the draft; cancel discards and confirm commits', () => {
    render(<PeriodeForDagpenger {...makeProps([saved])} />)
    const ns = `${namespace}[0]`

    fireEvent.click(screen.getByText('el:button-edit'))
    expect(screen.getByTestId(`${ns}-institusjon-landkode`)).toHaveTextContent('SWE')
    fireEvent.change(screen.getByTestId(`${ns}-institusjon-id`), { target: { value: 'SE:5678' } })
    expect(updateReplySed).not.toHaveBeenCalled()

    fireEvent.click(screen.getByText('el:button-cancel'))
    fireEvent.click(screen.getByText('el:button-edit'))
    expect(screen.getByTestId(`${ns}-institusjon-id`)).toHaveValue('SE:1234')

    fireEvent.change(screen.getByTestId(`${ns}-institusjon-id`), { target: { value: 'SE:5678' } })
    fireEvent.click(screen.getByText('el:button-save'))
    expect(updateReplySed).toHaveBeenLastCalledWith('dagpengeperioder[0]', {
      periode,
      institusjon: { id: 'SE:5678', navn: 'Other Swedish institution', __landkode: 'SWE' }
    })
  })
})
