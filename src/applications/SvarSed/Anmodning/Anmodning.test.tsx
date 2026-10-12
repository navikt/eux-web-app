import { fireEvent, render, screen } from '@testing-library/react'
import Anmodning from 'applications/SvarSed/Anmodning/Anmodning'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { ReplySed } from 'declarations/sed'
import { stageSelector } from 'setupTests'

jest.mock('actions/validation', () => ({
  resetValidation: jest.fn(),
  setValidation: jest.fn()
}))

jest.mock('actions/ui', () => ({
  setTextAreaDirty: jest.fn()
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
      dokumentasjon: { dokument: 'the dokument', informasjon: 'the informasjon', sed: 'the sed' }
    }
  }
} as unknown as ReplySed

describe('applications/SvarSed/Anmodning/Anmodning', () => {
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

  it('Reads the values from bruker.anmodning.dokumentasjon', () => {
    render(<Anmodning {...initialMockProps} />)
    expect(screen.getByDisplayValue('the dokument')).toBeInTheDocument()
    expect(screen.getByDisplayValue('the informasjon')).toBeInTheDocument()
    expect(screen.getByDisplayValue('the sed')).toBeInTheDocument()
  })

  it.each([
    ['the dokument', 'dokument'],
    ['the informasjon', 'informasjon'],
    ['the sed', 'sed']
  ])('Handling: editing %s writes to bruker.anmodning.dokumentasjon.%s', (current: string, field: string) => {
    render(<Anmodning {...initialMockProps} />)
    const textArea = screen.getByDisplayValue(current)
    fireEvent.change(textArea, { target: { value: ' changed ' } })
    fireEvent.blur(textArea)
    expect(updateReplySed).toHaveBeenCalledWith(`bruker.anmodning.dokumentasjon.${field}`, 'changed')
  })
})
