import { updateReplySed } from 'actions/svarpased'
import { FormålManagerFormProps, FormålManagerFormSelector } from 'applications/SvarSed/Formaal/FormålManager'
import Kontoopplysning from 'applications/SvarSed/Formaal/Kontoopplysning/Kontoopplysning'
import { KontoOrdinaer, KontoSepa } from 'declarations/sed'
import { mount, ReactWrapper } from 'enzyme'
import getReplySed from 'mocks/replySed'
import { stageSelector } from 'setupTests'

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

  const mockKontoOrdinaer: KontoOrdinaer = {
    bankensNavn: 'abc',
    kontonummer: '123',
    adresse: undefined,
    swift: '456'
  }

  const mockKontoSepa: KontoSepa = {
    swift: '123',
    iban: '123'
  }

  it('Handling: update kontotype', () => {
    (updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        ...mockReplySed,
        utbetalingTilInstitusjon: {
          begrunnelse: 'begrunnelse',
          id: 'id',
          navn: 'navn',
          kontoOrdinaer: mockKontoOrdinaer,
          kontoSepa: mockKontoSepa
        }
      }
    })
    wrapper = mount(<Kontoopplysning {...initialMockProps} />)
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-kontotype\'] input[type="radio"]').hostNodes()
    formField.first().simulate('change', { target: { value: 'ordinaer' } })
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon', {
      begrunnelse: 'begrunnelse',
      id: 'id',
      navn: 'navn',
      kontoOrdinaer: mockKontoOrdinaer
    });

    (updateReplySed as jest.Mock).mockReset()
    formField.last().simulate('change', { target: { value: 'sepa' } })
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon', {
      begrunnelse: 'begrunnelse',
      id: 'id',
      navn: 'navn',
      kontoSepa: mockKontoSepa
    });

    (updateReplySed as jest.Mock).mockReset()
    formField.first().simulate('change', { target: { value: 'ordinaer' } })
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon', {
      begrunnelse: 'begrunnelse',
      id: 'id',
      navn: 'navn',
      kontoOrdinaer: mockKontoOrdinaer
    })
  })

  it('Handling: update begrunnelse', () => {
    (updateReplySed as jest.Mock).mockReset()
    const mockText = 'mockText'
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-begrunnelse\']').hostNodes()
    formField.simulate('change', { target: { value: mockText } })
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.begrunnelse', mockText)
  })

  it('Handling: update id', () => {
    (updateReplySed as jest.Mock).mockReset()
    const mockId = 'mockId'
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-id\']').hostNodes()
    formField.simulate('change', { target: { value: mockId } })
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.id', mockId)
  })

  it('Handling: update navn', () => {
    (updateReplySed as jest.Mock).mockReset()
    const mockNavn = 'mockNavn'
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-navn\']').hostNodes()
    formField.simulate('change', { target: { value: mockNavn } })
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.navn', mockNavn)
  })

  it('Handling: update kontoOrdinaer adresse', () => {
    (updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        ...mockReplySed,
        utbetalingTilInstitusjon: {
          kontoOrdinaer: {}
        }
      }
    })
    wrapper = mount(<Kontoopplysning {...initialMockProps} />)
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-kontoOrdinaer-gate\']').hostNodes()
    formField.simulate('change', { target: { value: '123' } })
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoOrdinaer.adresse', { gate: '123' })
  })

  it('Handling: update kontoOrdinaer bankens navn', () => {
    (updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        ...mockReplySed,
        utbetalingTilInstitusjon: {
          kontoOrdinaer: {}
        }
      }
    })
    wrapper = mount(<Kontoopplysning {...initialMockProps} />)
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-kontoOrdinaer-bankensNavn\']').hostNodes()
    formField.simulate('change', { target: { value: 'bankensNavn' } })
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoOrdinaer.bankensNavn', 'bankensNavn')
  })

  it('Handling: update kontoOrdinaer bankens kontonummer', () => {
    (updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        ...mockReplySed,
        utbetalingTilInstitusjon: {
          kontoOrdinaer: {}
        }
      }
    })
    wrapper = mount(<Kontoopplysning {...initialMockProps} />)
    const mockKontonummer = 'mockKontonummer'
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-kontoOrdinaer-kontonummer\']').hostNodes()
    formField.simulate('change', { target: { value: mockKontonummer } })
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoOrdinaer.kontonummer', mockKontonummer)
  })

  it('Handling: update kontoOrdinaer swift', () => {
    (updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        ...mockReplySed,
        utbetalingTilInstitusjon: {
          kontoOrdinaer: {}
        }
      }
    })
    wrapper = mount(<Kontoopplysning {...initialMockProps} />)
    const mockSwift = 'mockSwift'
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-kontoOrdinaer-swift\']').hostNodes()
    formField.simulate('change', { target: { value: mockSwift } })
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoOrdinaer.swift', mockSwift)
  })

  it('Handling: update kontoSepa iban', () => {
    (updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        ...mockReplySed,
        utbetalingTilInstitusjon: {
          kontoSepa: {}
        }
      }
    })
    wrapper = mount(<Kontoopplysning {...initialMockProps} />)
    const mockIban = 'mockIban'
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-kontoSepa-iban\']').hostNodes()
    formField.simulate('change', { target: { value: mockIban } })
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoSepa.iban', mockIban)
  })

  it('Handling: update kontoSepa swift', () => {
    (updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        ...mockReplySed,
        utbetalingTilInstitusjon: {
          kontoSepa: {}
        }
      }
    })
    wrapper = mount(<Kontoopplysning {...initialMockProps} />)
    const mockSwift = 'mockSwift'
    const formField = wrapper.find('[data-test-id=\'test-kontoopplysninger-kontoSepa-swift\']').hostNodes()
    formField.simulate('change', { target: { value: mockSwift } })
    formField.simulate('blur')
    expect(updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoSepa.swift', mockSwift)
  })
})
