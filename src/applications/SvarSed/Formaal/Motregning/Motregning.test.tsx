import { FormålManagerFormProps, FormålManagerFormSelector } from 'applications/SvarSed/Formaal/FormålManager'
import Motregning from 'applications/SvarSed/Formaal/Motregning/Motregning'
import { PersonInfo } from 'declarations/sed'
import { mount, ReactWrapper } from 'enzyme'
import getReplySed from 'mocks/svarsed/replySed'
import { stageSelector } from 'setupTests'

jest.mock('actions/svarsed', () => ({
  updateReplySed: jest.fn()
}))

jest.mock('actions/validation', () => ({
  resetValidation: jest.fn()
}))

const mockReplySed = getReplySed('F002')

const defaultSelector: FormålManagerFormSelector = {
  highContrast: false,
  validation: {}
}

describe('applications/SvarSed/Formaal/Motregning/Motregning', () => {
  let wrapper: ReactWrapper

  const initialMockProps: FormålManagerFormProps = {
    parentNamespace: 'test',
    seeKontoopplysninger: jest.fn(),
    replySed: mockReplySed,
    updateReplySed: jest.fn(),
    setReplySed: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<Motregning {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Handling: update setSvarType: barna', () => {
    (initialMockProps.updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        barn: [{
          person
        } as PersonInfo, {

        }]
      }
    })
    const mockText = 'mockText'
    const formField = wrapper.find('[data-test-id=\'test-motregning-svarType\']').hostNodes()
    formField.simulate('change', { target: { value: mockText } })
    formField.simulate('blur')
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('svarType', mockText)
  })

  it('Handling: see kontoopplysning button clicked', () => {
    (initialMockProps.seeKontoopplysninger as jest.Mock).mockReset()
    const formField = wrapper.find('[data-test-id=\'test-refusjonskrav-konto-button\']').hostNodes()
    formField.simulate('click')
    expect(initialMockProps.seeKontoopplysninger).toHaveBeenCalled()
  })
})