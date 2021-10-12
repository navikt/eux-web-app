import { FormålManagerFormProps, FormålManagerFormSelector } from 'applications/SvarSed/Formaal/FormålManager'
import Kontoopplysning from 'applications/SvarSed/Formaal/Kontoopplysning/Kontoopplysning'
import { mount, ReactWrapper } from 'enzyme'
import getReplySed from 'mocks/replySed'
import { stageSelector } from 'setupTests'
import { updateReplySed } from 'actions/svarpased'

jest.mock('actions/svarpased', () => ({
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

describe('applications/SvarSed/Formaal/Kontoopplysning/Kontoopplysning', () => {
  let wrapper: ReactWrapper

  const initialMockProps: FormålManagerFormProps = {
    parentNamespace: 'test',
    seeKontoopplysninger: () => {}
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<Kontoopplysning {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Handling: update begrunnelse', () => {
    (updateReplySed as jest.Mock).mockReset()
    const mockText = 'mockText'
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-begrunnelse\']').hostNodes()
    formField.simulate('change', {target: {value: mockText}})
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.begrunnelse', mockText)
  })

  it('Handling: update id', () => {
    (updateReplySed as jest.Mock).mockReset()
    const mockId = 'mockId'
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-id\']').hostNodes()
    formField.simulate('change', {target: {value: mockId}})
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.id', mockId)
  })

  it('Handling: update navn', () => {
    (updateReplySed as jest.Mock).mockReset()
    const mockNavn = 'mockNavn'
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-navn\']').hostNodes()
    formField.simulate('change', {target: {value: mockNavn}})
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.navn', mockNavn)
  })

  it('Handling: update sepa konto', () => {
    (updateReplySed as jest.Mock).mockReset()
    const mockJaNei = 'jaNei'
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-kontoOrdinaer-sepaKonto\'] input[type="radio"]').hostNodes()
    formField.first().simulate('change', {target: {value: mockJaNei}})
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoOrdinaer.sepaKonto', mockJaNei)
  })

  it('Handling: update iban', () => {
    (updateReplySed as jest.Mock).mockReset()
    const mockIban = 'mockIban'
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-kontoOrdinaer-iban\']').hostNodes()
    formField.simulate('change', {target: {value: mockIban}})
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoOrdinaer.iban', mockIban)
  })

  it('Handling: update swift', () => {
    (updateReplySed as jest.Mock).mockReset()
    const mockSwift = 'mockSwift'
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-kontoOrdinaer-swift\']').hostNodes()
    formField.simulate('change', {target: {value: mockSwift}})
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoOrdinaer.swift', mockSwift)
  })
})
