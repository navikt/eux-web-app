import { fireEvent, render, screen } from '@testing-library/react'
import { updateReplySed } from 'actions/svarsed'
import Kontoopplysning from 'applications/SvarSed/Kontoopplysning/Kontoopplysning'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import { F002Sed, UtbetalingTilInstitusjon } from 'declarations/sed'
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

const namespace = 'test-kontoopplysninger'
const swedishInstitution = { institusjonsID: 'SE:1234', navn: 'Swedish institution', landkode: 'SWE', buctype: 'FB_BUC_01' }

const uti: UtbetalingTilInstitusjon = {
  begrunnelse: 'begrunnelse',
  id: '',
  navn: '',
  kontoSepa: { iban: 'SE4550000000058398257466', swift: 'ESSESESS' }
}

const makeProps = (utbetalingTilInstitusjon: UtbetalingTilInstitusjon): MainFormProps => ({
  parentNamespace: 'test',
  replySed: { sedType: 'F002', sak: { sakType: 'FB_BUC_01', cdmVersjon: '4.3' }, utbetalingTilInstitusjon } as unknown as F002Sed,
  updateReplySed,
  setReplySed: jest.fn()
} as MainFormProps)

const countryCodes = {
  'v4.3': { euEftaLand: [{ landkode: 'SWE', euLandkode: 'SE' }] }
}

describe('applications/SvarSed/Kontoopplysning/Kontoopplysning', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    stageSelector({}, {
      validation: {},
      countryCodes,
      institusjonRequests: {
        'FB_BUC_01:SWE': { requestId: 'sweden', loading: false, institusjoner: [swedishInstitution] }
      }
    })
  })

  it('infers the country from a saved institution id', () => {
    render(<Kontoopplysning {...makeProps({ ...uti, id: 'SE:1234', navn: 'Swedish institution' })} />)
    expect(screen.getByTestId(`${namespace}-institusjon-landkode`)).toHaveTextContent('SWE')
    expect(screen.getByTestId(`${namespace}-institusjon-id`)).toHaveValue('SE:1234')
  })

  it('selecting an institution sets id, navn and country but keeps begrunnelse and account details', () => {
    render(<Kontoopplysning {...makeProps({ ...uti, __landkode: 'SWE', id: 'SE:1234', navn: 'Swedish institution' })} />)
    fireEvent.change(screen.getByTestId(`${namespace}-institusjon-id`), { target: { value: '' } })
    expect(updateReplySed).toHaveBeenLastCalledWith('utbetalingTilInstitusjon', { ...uti, id: '', navn: '' })

    fireEvent.change(screen.getByTestId(`${namespace}-institusjon-id`), { target: { value: 'SE:1234' } })
    expect(updateReplySed).toHaveBeenLastCalledWith('utbetalingTilInstitusjon', {
      ...uti,
      __landkode: 'SWE',
      id: 'SE:1234',
      navn: 'Swedish institution'
    })
  })

  it('changing country clears the institution but keeps the other fields', () => {
    render(<Kontoopplysning {...makeProps({ ...uti, __landkode: 'SWE', id: 'SE:1234', navn: 'Swedish institution' })} />)
    fireEvent.click(screen.getByTestId(`${namespace}-institusjon-landkode`))
    expect(updateReplySed).toHaveBeenLastCalledWith('utbetalingTilInstitusjon', { ...uti, id: '', navn: '' })
  })

  it('emptying kontoopplysninger also resets the selected country', () => {
    render(<Kontoopplysning {...makeProps(uti)} />)
    fireEvent.click(screen.getByTestId(`${namespace}-institusjon-landkode`))
    expect(screen.getByTestId(`${namespace}-institusjon-landkode`)).toHaveTextContent('DNK')

    fireEvent.click(screen.getByText('el:button-remove-account-info'))
    expect(screen.getByTestId(`${namespace}-institusjon-landkode`)).toHaveTextContent('no-country')
  })
})
