import { mount, ReactWrapper } from 'enzyme'
import KeyAndYtelseFC, { KeyAndYtelseProps } from './KeyAndYtelse'

describe('applications/SvarSed/Formaal/Motregning/KeyAndYtelse/KeyAndYtelse', () => {
  let wrapper: ReactWrapper

  const initialMockProps: KeyAndYtelseProps = {
    highContrast: false,
    keyAndYtelses: [{ fullKey: 'barn[0]', ytelseNavn: 'ytelseNavn' }],
    onAdded: jest.fn(),
    onRemoved: jest.fn(),
    onYtelseChanged: jest.fn(),
    onKeyChanged: jest.fn(),
    allBarnaNameKeys: { 'barn[0]': 'Bart Simpson', 'barn[1]': 'Lisa Simpson' },
    parentNamespace: 'test',
    validation: {}
  }

  beforeEach(() => {
    wrapper = mount(<KeyAndYtelseFC {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Handling: update key', () => {
    (initialMockProps.onKeyChanged as jest.Mock).mockReset()
    const keySelect = wrapper.find('[id=\'test-keyandytelse[0]-key\'] input').hostNodes()
    keySelect.simulate('keyDown', { key: 'ArrowDown' })
    keySelect.simulate('keyDown', { key: 'ArrowDown' })
    keySelect.simulate('keyDown', { key: 'Enter' }) // changes from barn[0] to barn[1]
    expect(initialMockProps.onKeyChanged).toHaveBeenCalledWith('barn[0]', 'barn[1]')
  })

  it('Handling: update ytelseNavn', () => {
    (initialMockProps.onYtelseChanged as jest.Mock).mockReset()
    const mockYtelseNavn = 'mockYtelseNavn'
    const ytelseNavnInput = wrapper.find('[data-test-id=\'test-keyandytelse[0]-ytelseNavn\']').hostNodes()
    ytelseNavnInput.simulate('change', { target: { value: mockYtelseNavn } })
    ytelseNavnInput.simulate('blur')
    expect(initialMockProps.onYtelseChanged).toHaveBeenCalledWith('barn[0]', mockYtelseNavn)
  })

  it('Handling: adding key/ytelseNavn', () => {
    (initialMockProps.onAdded as jest.Mock).mockReset()
    wrapper.find('[data-test-id=\'test-keyandytelse-new\']').hostNodes().simulate('click')

    const keySelect = wrapper.find('[data-test-id=\'test-keyandytelse-key\'] input').hostNodes()
    keySelect.simulate('keyDown', { key: 'ArrowDown' })
    keySelect.simulate('keyDown', { key: 'ArrowDown' })
    keySelect.simulate('keyDown', { key: 'Enter' }) // changes from barn[0] to barn[1]

    const mockYtelseNavn = 'mockYtelseNavn'
    const ytelseNavnInput = wrapper.find('[data-test-id=\'test-keyandytelse-ytelseNavn\']').hostNodes()
    ytelseNavnInput.simulate('change', { target: { value: mockYtelseNavn } })
    ytelseNavnInput.simulate('blur')

    wrapper.find('[data-test-id=\'test-keyandytelse-addremove-add\']').hostNodes().simulate('click')
    expect(initialMockProps.onAdded).toHaveBeenCalledWith('barn[1]', mockYtelseNavn)
  })

  it('Handling: removing key/ytelseNavn', () => {
    (initialMockProps.onRemoved as jest.Mock).mockReset()
    wrapper.find('[data-test-id=\'test-keyandytelse[0]-addremove-remove\']').hostNodes().simulate('click')
    wrapper.find('[data-test-id=\'test-keyandytelse[0]-addremove-yes\']').hostNodes().simulate('click')
    expect(initialMockProps.onRemoved).toHaveBeenCalledWith('barn[0]')
  })
})
