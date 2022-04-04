import { FormålManagerFormProps, FormålManagerFormSelector } from 'applications/SvarSed/Formaal/FormålManager'
import Kontoopplysning from 'applications/SvarSed/Formaal/Kontoopplysning/Kontoopplysning'
import { KontoOrdinaer, KontoSepa } from 'declarations/sed'
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

const defaultSelector: FormålManagerFormSelector = {
  validation: {}
}

describe('applications/SvarSed/Formaal/Kontoopplysning/Kontoopplysning', () => {
  let wrapper: any

  const initialMockProps: FormålManagerFormProps = {
    parentNamespace: 'test',
    seeKontoopplysninger: jest.fn(),
    replySed: mockReplySed,
    updateReplySed: jest.fn(),
    setReplySed: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = render(<Kontoopplysning {...initialMockProps} />)
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
    (initialMockProps.updateReplySed as jest.Mock).mockReset()
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
    wrapper = render(<Kontoopplysning {...initialMockProps} />)
    const formField = wrapper.find('[data-testid=\'test-kontoopplysninger-kontotype\'] input[type="radio"]').hostNodes()
    formField.first().simulate('change', { target: { value: 'ordinaer' } })
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon', {
      begrunnelse: 'begrunnelse',
      id: 'id',
      navn: 'navn',
      kontoOrdinaer: mockKontoOrdinaer
    });

    (initialMockProps.updateReplySed as jest.Mock).mockReset()
    formField.last().simulate('change', { target: { value: 'sepa' } })
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon', {
      begrunnelse: 'begrunnelse',
      id: 'id',
      navn: 'navn',
      kontoSepa: mockKontoSepa
    });

    (initialMockProps.updateReplySed as jest.Mock).mockReset()
    formField.first().simulate('change', { target: { value: 'ordinaer' } })
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon', {
      begrunnelse: 'begrunnelse',
      id: 'id',
      navn: 'navn',
      kontoOrdinaer: mockKontoOrdinaer
    })
  })

  it('Handling: update begrunnelse', () => {
    (initialMockProps.updateReplySed as jest.Mock).mockReset()
    const mockText = 'mockText'
    const formField = wrapper.find('[data-testid=\'test-kontoopplysninger-begrunnelse\']').hostNodes()
    formField.simulate('change', { target: { value: mockText } })
    formField.simulate('blur')
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.begrunnelse', mockText)
  })

  it('Handling: update id', () => {
    (initialMockProps.updateReplySed as jest.Mock).mockReset()
    const mockId = 'mockId'
    const formField = wrapper.find('[data-testid=\'test-kontoopplysninger-id\']').hostNodes()
    formField.simulate('change', { target: { value: mockId } })
    formField.simulate('blur')
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.id', mockId)
  })

  it('Handling: update navn', () => {
    (initialMockProps.updateReplySed as jest.Mock).mockReset()
    const mockNavn = 'mockNavn'
    const formField = wrapper.find('[data-testid=\'test-kontoopplysninger-navn\']').hostNodes()
    formField.simulate('change', { target: { value: mockNavn } })
    formField.simulate('blur')
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.navn', mockNavn)
  })

  it('Handling: update kontoOrdinaer adresse', () => {
    (initialMockProps.updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        ...mockReplySed,
        utbetalingTilInstitusjon: {
          kontoOrdinaer: {}
        }
      }
    })
    wrapper = render(<Kontoopplysning {...initialMockProps} />)
    const formField = wrapper.find('[data-testid=\'test-kontoopplysninger-kontoOrdinaer-gate\']').hostNodes()
    formField.simulate('change', { target: { value: '123' } })
    formField.simulate('blur')
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoOrdinaer.adresse', { gate: '123' })
  })

  it('Handling: update kontoOrdinaer bankens navn', () => {
    (initialMockProps.updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        ...mockReplySed,
        utbetalingTilInstitusjon: {
          kontoOrdinaer: {}
        }
      }
    })
    wrapper = render(<Kontoopplysning {...initialMockProps} />)
    const formField = wrapper.find('[data-testid=\'test-kontoopplysninger-kontoOrdinaer-bankensNavn\']').hostNodes()
    formField.simulate('change', { target: { value: 'bankensNavn' } })
    formField.simulate('blur')
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoOrdinaer.bankensNavn', 'bankensNavn')
  })

  it('Handling: update kontoOrdinaer bankens kontonummer', () => {
    (initialMockProps.updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        ...mockReplySed,
        utbetalingTilInstitusjon: {
          kontoOrdinaer: {}
        }
      }
    })
    wrapper = render(<Kontoopplysning {...initialMockProps} />)
    const mockKontonummer = 'mockKontonummer'
    const formField = wrapper.find('[data-testid=\'test-kontoopplysninger-kontoOrdinaer-kontonummer\']').hostNodes()
    formField.simulate('change', { target: { value: mockKontonummer } })
    formField.simulate('blur')
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoOrdinaer.kontonummer', mockKontonummer)
  })

  it('Handling: update kontoOrdinaer swift', () => {
    (initialMockProps.updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        ...mockReplySed,
        utbetalingTilInstitusjon: {
          kontoOrdinaer: {}
        }
      }
    })
    wrapper = render(<Kontoopplysning {...initialMockProps} />)
    const mockSwift = 'mockSwift'
    const formField = wrapper.find('[data-testid=\'test-kontoopplysninger-kontoOrdinaer-swift\']').hostNodes()
    formField.simulate('change', { target: { value: mockSwift } })
    formField.simulate('blur')
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoOrdinaer.swift', mockSwift)
  })

  it('Handling: update kontoSepa iban', () => {
    (initialMockProps.updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        ...mockReplySed,
        utbetalingTilInstitusjon: {
          kontoSepa: {}
        }
      }
    })
    wrapper = render(<Kontoopplysning {...initialMockProps} />)
    const mockIban = 'mockIban'
    const formField = wrapper.find('[data-testid=\'test-kontoopplysninger-kontoSepa-iban\']').hostNodes()
    formField.simulate('change', { target: { value: mockIban } })
    formField.simulate('blur')
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoSepa.iban', mockIban)
  })

  it('Handling: update kontoSepa swift', () => {
    (initialMockProps.updateReplySed as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      replySed: {
        ...mockReplySed,
        utbetalingTilInstitusjon: {
          kontoSepa: {}
        }
      }
    })
    wrapper = render(<Kontoopplysning {...initialMockProps} />)
    const mockSwift = 'mockSwift'
    const formField = wrapper.find('[data-testid=\'test-kontoopplysninger-kontoSepa-swift\']').hostNodes()
    formField.simulate('change', { target: { value: mockSwift } })
    formField.simulate('blur')
    expect(initialMockProps.updateReplySed).toHaveBeenCalledWith('utbetalingTilInstitusjon.kontoSepa.swift', mockSwift)
  })
})
