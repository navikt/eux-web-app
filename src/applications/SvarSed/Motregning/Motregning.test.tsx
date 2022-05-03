import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Motregning from 'applications/SvarSed/Motregning/Motregning'
import { F002Sed } from 'declarations/sed'
import { render } from '@testing-library/react'
import getReplySed from 'mocks/svarsed/replySed'
import { stageSelector } from 'setupTests'

jest.mock('actions/svarsed', () => ({
  updateReplySed: jest.fn()
}))

jest.mock('actions/validation', () => ({
  resetValidation: jest.fn()
}))

const mockReplySed = getReplySed('F002')

const defaultSelector: MainFormSelector = {
  validation: {}
}

describe('applications/SvarSed/Motregning/Motregning', () => {
  let wrapper: any

  const initialMockProps: MainFormProps = {
    parentNamespace: 'test',
    replySed: mockReplySed,
    updateReplySed: jest.fn(),
    setReplySed: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = render(<Motregning {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Handling: update setSvarType: barna', () => {
    (initialMockProps.updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        barn: (getReplySed('F002') as F002Sed)!.barn
      }
    })
    const mockText = 'mockText'
    const formField = wrapper.find('[data-testid=\'test-motregning-svarType\']').hostNodes()
    formField.simulate('change', { target: { value: mockText } })
    formField.simulate('blur')
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('svarType', mockText)
  })
})
