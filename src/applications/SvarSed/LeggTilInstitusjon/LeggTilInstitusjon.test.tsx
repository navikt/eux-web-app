import { fireEvent, render, screen } from '@testing-library/react'
import { updateReplySed } from 'actions/svarsed'
import LeggTilInstitusjon from 'applications/SvarSed/LeggTilInstitusjon/LeggTilInstitusjon'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import { LeggTilInstitusjon as LeggTilInstitusjonType, X005Sed } from 'declarations/x005'
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
jest.mock('components/CountryDropdown/CountryDropdown', () => (props: any) => (
  <button data-testid={props.id} onClick={() => props.onOptionSelected({ value3: 'DNK' })}>
    {props.values ?? 'no-country'}
  </button>
))

const namespace = 'x005-bruker-leggtilinstitusjon'
const grunn = { grunnType: 'annet', grunnAnnet: 'begrunnelse' }

const makeProps = (leggTilInstitusjon: LeggTilInstitusjonType): MainFormProps => ({
  parentNamespace: 'x005',
  personID: 'bruker',
  replySed: {
    sedType: 'X005',
    sak: { sakType: 'U_BUC_02', cdmVersjon: '4.3' },
    leggTilInstitusjon
  } as unknown as X005Sed,
  updateReplySed,
  setReplySed: jest.fn()
} as MainFormProps)

describe('applications/SvarSed/LeggTilInstitusjon/LeggTilInstitusjon', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    stageSelector({}, {
      validation: {},
      countryCodes: { 'v4.3': { euEftaLand: [{ landkode: 'SWE', euLandkode: 'SE' }] } },
      institusjonRequests: {
        'U_BUC_02:SWE': {
          requestId: 'sweden',
          loading: false,
          institusjoner: [{ institusjonsID: 'SE:1234', navn: 'Swedish institution', landkode: 'SWE', buctype: 'U_BUC_02' }]
        }
      }
    })
  })

  it('infers the country from a saved institution id', () => {
    render(<LeggTilInstitusjon {...makeProps({ ...grunn, institusjonId: 'SE:1234', institusjonNavn: 'Swedish institution' })} />)
    expect(screen.getByTestId(`${namespace}-institusjon-landkode`)).toHaveTextContent('SWE')
    expect(screen.getByTestId(`${namespace}-institusjon-id`)).toHaveValue('SE:1234')
  })

  it('selecting an institution maps id/navn and keeps the grunn fields', () => {
    render(<LeggTilInstitusjon {...makeProps({ ...grunn, __landkode: 'SWE' })} />)
    fireEvent.change(screen.getByTestId(`${namespace}-institusjon-id`), { target: { value: 'SE:1234' } })
    expect(updateReplySed).toHaveBeenLastCalledWith('leggTilInstitusjon', {
      ...grunn,
      institusjonId: 'SE:1234',
      institusjonNavn: 'Swedish institution',
      __landkode: 'SWE'
    })
  })

  it('changing country clears the institution and keeps the grunn fields', () => {
    render(<LeggTilInstitusjon {...makeProps({ ...grunn, __landkode: 'SWE', institusjonId: 'SE:1234', institusjonNavn: 'Swedish institution' })} />)
    fireEvent.click(screen.getByTestId(`${namespace}-institusjon-landkode`))
    expect(updateReplySed).toHaveBeenLastCalledWith('leggTilInstitusjon', {
      ...grunn,
      institusjonId: '',
      institusjonNavn: '',
      __landkode: 'DNK'
    })
  })
})
