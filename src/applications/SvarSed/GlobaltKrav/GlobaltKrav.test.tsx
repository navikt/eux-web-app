import { fireEvent, render, screen } from '@testing-library/react'
import { updateReplySed } from 'actions/svarsed'
import GlobaltKrav from 'applications/SvarSed/GlobaltKrav/GlobaltKrav'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import { H021Sed, KreditorInstitusjon } from 'declarations/h021'
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
jest.mock('components/CurrencyDropdown/CurrencyDropdown', () => () => null)
jest.mock('components/CountryDropdown/CountryDropdown', () => (props: any) => (
  <button data-testid={props.id} onClick={() => props.onOptionSelected({ value3: 'DNK' })}>
    {props.values ?? 'no-country'}
  </button>
))

const namespace = 'h021krav-bruker-globaltkrav'
const swedishInstitution = { institusjonsID: 'SE:1234', navn: 'Swedish institution', landkode: 'SWE', buctype: 'H_BUC_04' }

const kreditor: KreditorInstitusjon = {
  globalReferanse: 'ref-kreditor',
  betalingsreferanse: 'betref',
  kravTotalbeloep: { beloep: '100', valuta: 'SEK' }
}

const makeProps = (kreditorinstitusjon: KreditorInstitusjon): MainFormProps => ({
  parentNamespace: 'h021krav',
  personID: 'bruker',
  replySed: {
    sedType: 'H021',
    sak: { sakType: 'H_BUC_04', cdmVersjon: '4.3' },
    refusjonskrav: { kreditorinstitusjon, debitorinstitusjon: { globalReferanse: 'ref-debitor' } }
  } as unknown as H021Sed,
  updateReplySed,
  setReplySed: jest.fn()
} as MainFormProps)

describe('applications/SvarSed/GlobaltKrav/GlobaltKrav', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    stageSelector({}, {
      validation: {},
      countryCodes: { 'v4.3': { euEftaLand: [{ landkode: 'SWE', euLandkode: 'SE' }] } },
      institusjonRequests: {
        'H_BUC_04:SWE': { requestId: 'sweden', loading: false, institusjoner: [swedishInstitution] }
      }
    })
  })

  it('infers the country from a saved kreditor institution id', () => {
    render(<GlobaltKrav {...makeProps({ ...kreditor, id: 'SE:1234', navn: 'Swedish institution' })} />)
    expect(screen.getByTestId(`${namespace}-kreditorinstitusjon-landkode`)).toHaveTextContent('SWE')
    expect(screen.getByTestId(`${namespace}-kreditorinstitusjon-id`)).toHaveValue('SE:1234')
  })

  it('selecting an institution sets id, navn and country and keeps the other kreditor fields', () => {
    render(<GlobaltKrav {...makeProps({ ...kreditor, __landkode: 'SWE', id: 'SE:1234', navn: 'Swedish institution' })} />)
    fireEvent.change(screen.getByTestId(`${namespace}-kreditorinstitusjon-id`), { target: { value: '' } })
    expect(updateReplySed).toHaveBeenLastCalledWith('refusjonskrav.kreditorinstitusjon', { ...kreditor, id: undefined, navn: undefined })

    fireEvent.change(screen.getByTestId(`${namespace}-kreditorinstitusjon-id`), { target: { value: 'SE:1234' } })
    expect(updateReplySed).toHaveBeenLastCalledWith('refusjonskrav.kreditorinstitusjon', {
      ...kreditor,
      __landkode: 'SWE',
      id: 'SE:1234',
      navn: 'Swedish institution'
    })
  })

  it('changing country clears the institution but keeps the other kreditor fields', () => {
    render(<GlobaltKrav {...makeProps({ ...kreditor, __landkode: 'SWE', id: 'SE:1234', navn: 'Swedish institution' })} />)
    fireEvent.click(screen.getByTestId(`${namespace}-kreditorinstitusjon-landkode`))
    expect(updateReplySed).toHaveBeenLastCalledWith('refusjonskrav.kreditorinstitusjon', { ...kreditor, id: undefined, navn: undefined })
  })
})
