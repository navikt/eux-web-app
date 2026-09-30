import { fireEvent, render, screen } from '@testing-library/react'
import { validateAnmodningOmAdresse } from 'applications/SvarSed/Adresser/validation'
import AnmodningOmAdresse from 'applications/SvarSed/Adresser/AnmodningOmAdresse'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { ReplySed } from 'declarations/sed'
import { stageSelector } from 'setupTests'

jest.mock('actions/validation', () => ({
  resetValidation: jest.fn(),
  setValidation: jest.fn()
}))

const defaultSelector: MainFormSelector = {
  validation: {}
}

const mockReplySed = {
  sedType: 'H001',
  sedVersjon: '4.4',
  bruker: {
    personInfo: {},
    anmodning: {
      adresseTyper: ['bosted'],
      dokumentasjon: { dokument: 'keep me' }
    }
  }
} as unknown as ReplySed

describe('applications/SvarSed/Adresser/AnmodningOmAdresse', () => {
  const updateReplySed = jest.fn()
  const initialMockProps: MainFormProps = {
    parentNamespace: 'test',
    personID: 'bruker',
    replySed: mockReplySed,
    updateReplySed,
    setReplySed: jest.fn()
  }

  beforeEach(() => {
    updateReplySed.mockReset()
    stageSelector(defaultSelector, {})
  })

  it('Reads the checked address types from bruker.anmodning.adresseTyper', () => {
    render(<AnmodningOmAdresse {...initialMockProps} />)
    expect(screen.getByLabelText('el:radio-adresse-anmodning-type-bosted')).toBeChecked()
    expect(screen.getByLabelText('el:radio-adresse-anmodning-type-opphold')).not.toBeChecked()
    expect(screen.getByLabelText('el:radio-adresse-anmodning-type-kontakt')).not.toBeChecked()
  })

  it('Nothing is checked when bruker.anmodning is missing', () => {
    render(<AnmodningOmAdresse {...initialMockProps} replySed={{
      sedType: 'H001', sedVersjon: '4.4', bruker: { personInfo: {} }
    } as unknown as ReplySed} />)
    expect(screen.getByLabelText('el:radio-adresse-anmodning-type-bosted')).not.toBeChecked()
  })

  it('Handling: checking a type only writes bruker.anmodning.adresseTyper', () => {
    render(<AnmodningOmAdresse {...initialMockProps} />)
    fireEvent.click(screen.getByLabelText('el:radio-adresse-anmodning-type-kontakt'))
    expect(updateReplySed).toHaveBeenCalledTimes(1)
    expect(updateReplySed).toHaveBeenCalledWith('bruker.anmodning.adresseTyper', ['bosted', 'kontakt'])
  })

  it('Handling: unchecking a type', () => {
    render(<AnmodningOmAdresse {...initialMockProps} />)
    fireEvent.click(screen.getByLabelText('el:radio-adresse-anmodning-type-bosted'))
    expect(updateReplySed).toHaveBeenCalledWith('bruker.anmodning.adresseTyper', [])
  })

  it('validation: no address type rules, so always valid', () => {
    expect(validateAnmodningOmAdresse({}, 'test-mock', { replySed: mockReplySed })).toBeFalsy()
  })
})
