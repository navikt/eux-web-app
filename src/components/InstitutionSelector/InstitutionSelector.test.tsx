import { fireEvent, render, screen } from '@testing-library/react'
import { getInstitusjoner, releaseInstitusjoner } from 'actions/sak'
import InstitutionSelector, { InstitutionSelectorProps } from './InstitutionSelector'
import { stageSelector } from 'setupTests'

jest.mock('actions/sak', () => ({
  getInstitusjoner: jest.fn(() => ({ type: 'SAK/INSTITUSJONER/REQUEST' })),
  releaseInstitusjoner: jest.fn(() => ({ type: 'SAK/INSTITUSJONER/RELEASE' }))
}))
// Mimics react-select: an empty `values` keeps the internally selected country
jest.mock('components/CountryDropdown/CountryDropdown', () => {
  const { useState } = jest.requireActual('react')
  return (props: any) => {
    const [internal, setInternal] = useState(undefined)
    return (
      <button data-testid={props.id} onClick={() => { setInternal('DNK'); props.onOptionSelected({ value3: 'DNK' }) }}>
        {props.values ?? internal ?? 'no-country'}
      </button>
    )
  }
})

const swedishInstitution = { institusjonsID: 'SE:1', navn: 'Swedish institution', landkode: 'SWE', buctype: 'UB_BUC_02' }
const danishInstitution = { institusjonsID: 'DK:1', navn: 'Danish institution', landkode: 'DNK', buctype: 'UB_BUC_02' }
const props: InstitutionSelectorProps = {
  namespace: 'test',
  id: 'institusjon',
  bucType: 'UB_BUC_02',
  landkode: 'SWE',
  value: undefined,
  onLandkodeChanged: jest.fn(),
  onInstitutionSelected: jest.fn()
}

describe('components/InstitutionSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('releases the previous country on change and the current country on unmount', () => {
    stageSelector({}, { institusjonRequests: {} })
    const wrapper = render(<InstitutionSelector {...props} />)
    const consumerId = (getInstitusjoner as jest.Mock).mock.calls[0][2]
    expect(getInstitusjoner).toHaveBeenCalledWith('UB_BUC_02', 'SWE', consumerId)
    expect(releaseInstitusjoner).not.toHaveBeenCalled()

    wrapper.rerender(<InstitutionSelector {...props} landkode="DNK" />)
    expect(releaseInstitusjoner).toHaveBeenCalledTimes(1)
    expect(releaseInstitusjoner).toHaveBeenLastCalledWith('UB_BUC_02', 'SWE', consumerId)
    expect(getInstitusjoner).toHaveBeenLastCalledWith('UB_BUC_02', 'DNK', consumerId)

    wrapper.unmount()
    expect(releaseInstitusjoner).toHaveBeenCalledTimes(2)
    expect(releaseInstitusjoner).toHaveBeenLastCalledWith('UB_BUC_02', 'DNK', consumerId)
  })

  it('releases the previous BUC and clears the request when the country is removed', () => {
    stageSelector({}, { institusjonRequests: {} })
    const wrapper = render(<InstitutionSelector {...props} />)
    const consumerId = (getInstitusjoner as jest.Mock).mock.calls[0][2]
    wrapper.rerender(<InstitutionSelector {...props} bucType="UB_BUC_01" />)
    expect(releaseInstitusjoner).toHaveBeenLastCalledWith('UB_BUC_02', 'SWE', consumerId)
    expect(getInstitusjoner).toHaveBeenLastCalledWith('UB_BUC_01', 'SWE', consumerId)

    wrapper.rerender(<InstitutionSelector {...props} bucType="UB_BUC_01" landkode={undefined} />)
    expect(releaseInstitusjoner).toHaveBeenLastCalledWith('UB_BUC_01', 'SWE', consumerId)
    expect(getInstitusjoner).toHaveBeenCalledTimes(2)
  })

  it('never offers another country or BUC result, even if it arrived last', () => {
    stageSelector({}, {
      institusjonList: [swedishInstitution],
      gettingInstitusjoner: false,
      institusjonRequests: {
        'UB_BUC_02:SWE': { requestId: 'sweden', loading: false, institusjoner: [swedishInstitution] },
        'UB_BUC_02:DNK': { requestId: 'denmark', loading: false, institusjoner: [danishInstitution] }
      }
    })
    const wrapper = render(<InstitutionSelector {...props} landkode="DNK" />)
    expect(screen.queryByRole('option', { name: swedishInstitution.navn })).not.toBeInTheDocument()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'DK:1' } })
    expect(props.onInstitutionSelected).toHaveBeenCalledWith(danishInstitution)

    wrapper.rerender(<InstitutionSelector {...props} landkode="DNK" bucType="UB_BUC_01" />)
    expect(screen.getByRole('combobox')).toBeDisabled()
    expect(screen.queryByRole('option', { name: danishInstitution.navn })).not.toBeInTheDocument()
  })

  it.each([true, false])('does not offer stale options while loading=%s or after a failure', loading => {
    stageSelector({}, {
      institusjonList: [swedishInstitution],
      gettingInstitusjoner: false,
      institusjonRequests: {
        'UB_BUC_02:DNK': { requestId: 'denmark', loading, institusjoner: undefined }
      }
    })
    render(<InstitutionSelector {...props} landkode="DNK" />)
    expect(screen.getByRole('combobox')).toBeDisabled()
    expect(screen.queryByRole('option', { name: swedishInstitution.navn })).not.toBeInTheDocument()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } })
    expect(props.onInstitutionSelected).not.toHaveBeenCalled()
  })

  it('resets the country dropdown when the country is cleared', () => {
    stageSelector({}, { institusjonRequests: {} })
    const wrapper = render(<InstitutionSelector {...props} landkode={undefined} />)
    fireEvent.click(screen.getByTestId('test-institusjon-landkode'))
    wrapper.rerender(<InstitutionSelector {...props} landkode="DNK" />)
    expect(screen.getByTestId('test-institusjon-landkode')).toHaveTextContent('DNK')

    wrapper.rerender(<InstitutionSelector {...props} landkode={undefined} />)
    expect(screen.getByTestId('test-institusjon-landkode')).toHaveTextContent('no-country')
  })

  it('displays a saved institution missing from the result without making it selectable', () => {
    stageSelector({}, {
      institusjonRequests: {
        'UB_BUC_02:SWE': { requestId: 'sweden', loading: false, institusjoner: [] }
      }
    })
    render(<InstitutionSelector {...props} value="SE:old" valueNavn="Saved institution" />)
    expect(screen.getByRole('combobox')).toHaveValue('SE:old')
    expect(screen.getByRole('option', { name: 'Saved institution' })).toBeDisabled()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'SE:old' } })
    expect(props.onInstitutionSelected).not.toHaveBeenCalled()
  })
})
