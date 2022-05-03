import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import KravOmRefusjon from 'applications/SvarSed/KravOmRefusjon/KravOmRefusjon'
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

describe('applications/SvarSed/KravOmRefusjon/KravOmRefusjon', () => {
  let wrapper: any

  const initialMockProps: MainFormProps = {
    parentNamespace: 'test',
    replySed: mockReplySed,
    updateReplySed: jest.fn(),
    setReplySed: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = render(<KravOmRefusjon {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Handling: update krav', () => {
    (initialMockProps.updateReplySed as jest.Mock).mockReset()
    const mockText = 'mockText'
    const formField = wrapper.find('[data-testid=\'test-refusjonskrav-krav\']').hostNodes()
    formField.simulate('change', { target: { value: mockText } })
    formField.simulate('blur')
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('refusjonskrav', mockText)
  })
})
