import { FormålManagerFormProps, FormålManagerFormSelector } from 'applications/SvarSed/Formaal/FormålManager'
import KravOmRefusjon from 'applications/SvarSed/Formaal/KravOmRefusjon/KravOmRefusjon'
import { mount, ReactWrapper } from 'enzyme'
import getReplySed from 'mocks/replySed'
import { stageSelector } from 'setupTests'
import { updateReplySed } from 'actions/svarsed'

jest.mock('actions/svarsed', () => ({
  updateReplySed: jest.fn()
}))

jest.mock('actions/validation', () => ({
  resetValidation: jest.fn()
}))

const mockReplySed = getReplySed('F002')

const defaultSelector: FormålManagerFormSelector = {
  highContrast: false,
  replySed: mockReplySed,
  validation: {}
}

describe('applications/SvarSed/Formaal/KravOmRefusjon/KravOmRefusjon', () => {
  let wrapper: ReactWrapper

  const initialMockProps: FormålManagerFormProps = {
    parentNamespace: 'test',
    seeKontoopplysninger: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<KravOmRefusjon {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Handling: update krav', () => {
    (updateReplySed as jest.Mock).mockReset()
    const mockText = 'mockText'
    const formField = wrapper.find('[data-test-id=\'test-refusjonskrav-krav\']').hostNodes()
    formField.simulate('change', { target: { value: mockText } })
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('refusjonskrav', mockText)
  })

  it('Handling: see kontoopplysning button clicked', () => {
    (initialMockProps.seeKontoopplysninger as jest.Mock).mockReset()
    const formField = wrapper.find('[data-test-id=\'test-refusjonskrav-konto-button\']').hostNodes()
    formField.simulate('click')
    expect(initialMockProps.seeKontoopplysninger).toHaveBeenCalled()
  })
})
