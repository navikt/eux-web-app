import { fireEvent, render, screen } from '@testing-library/react'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import YtterligereInfoBruker from 'applications/SvarSed/YtterligereInfoBruker/YtterligereInfoBruker'
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
    ytterligereInfoType: 'melding_om_mer_informasjon',
    ytterligereInfo: 'existing text'
  }
} as unknown as ReplySed

describe('applications/SvarSed/YtterligereInfoBruker/YtterligereInfoBruker', () => {
  const updateReplySed = jest.fn()
  const initialMockProps: MainFormProps = {
    parentNamespace: 'test',
    personID: 'bruker',
    replySed: mockReplySed,
    updateReplySed,
    setReplySed: jest.fn(),
    options: { showYtterligereInfoType: true }
  }

  beforeEach(() => {
    updateReplySed.mockReset()
    stageSelector(defaultSelector, {})
  })

  it('Reads the type and text from bruker', () => {
    render(<YtterligereInfoBruker {...initialMockProps} />)
    expect(screen.getByDisplayValue('existing text')).toBeInTheDocument()
    expect(screen.getByLabelText('el:option-ytterligere-1')).toBeChecked()
    expect(screen.getByLabelText('el:option-ytterligere-2')).not.toBeChecked()
  })

  it('Shows the anmodning choice for the legacy stored value', () => {
    render(<YtterligereInfoBruker {...initialMockProps} replySed={{
      ...mockReplySed,
      bruker: { personInfo: {}, ytterligereInfoType: 'anmodning_om_mer_informasjon' }
    } as unknown as ReplySed} />)
    expect(screen.getByLabelText('el:option-ytterligere-2')).toBeChecked()
  })

  it('Handling: choosing the anmodning option writes the typed value to bruker', () => {
    render(<YtterligereInfoBruker {...initialMockProps} />)
    fireEvent.click(screen.getByLabelText('el:option-ytterligere-2'))
    expect(updateReplySed).toHaveBeenCalledWith('bruker.ytterligereInfoType', 'anmodning_om_tilleggsinformasjon')
  })

  it('Handling: choosing the melding option writes the typed value to bruker', () => {
    render(<YtterligereInfoBruker {...initialMockProps} replySed={{
      ...mockReplySed,
      bruker: { personInfo: {}, ytterligereInfoType: 'anmodning_om_tilleggsinformasjon' }
    } as unknown as ReplySed} />)
    fireEvent.click(screen.getByLabelText('el:option-ytterligere-1'))
    expect(updateReplySed).toHaveBeenCalledWith('bruker.ytterligereInfoType', 'melding_om_mer_informasjon')
  })

  it('Handling: editing the text writes to bruker.ytterligereInfo', () => {
    render(<YtterligereInfoBruker {...initialMockProps} />)
    const textArea = screen.getByDisplayValue('existing text')
    fireEvent.change(textArea, { target: { value: ' new text ' } })
    fireEvent.blur(textArea)
    expect(updateReplySed).toHaveBeenCalledWith('bruker.ytterligereInfo', 'new text')
  })

  it('Without showYtterligereInfoType: shows only the text, without the type choice', () => {
    render(<YtterligereInfoBruker {...initialMockProps} options={{}} replySed={{
      sedType: 'H002',
      sedVersjon: '4.4',
      bruker: { personInfo: {}, ytterligereInfo: 'h002 text' }
    } as unknown as ReplySed} />)
    expect(screen.getByDisplayValue('h002 text')).toBeInTheDocument()
    expect(screen.queryByLabelText('el:option-ytterligere-1')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('el:option-ytterligere-2')).not.toBeInTheDocument()
  })

  it('H002: editing the text writes to bruker.ytterligereInfo', () => {
    render(<YtterligereInfoBruker {...initialMockProps} options={{}} replySed={{
      sedType: 'H002',
      sedVersjon: '4.4',
      bruker: { personInfo: {}, ytterligereInfo: 'h002 text' }
    } as unknown as ReplySed} />)
    const textArea = screen.getByDisplayValue('h002 text')
    fireEvent.change(textArea, { target: { value: 'changed' } })
    fireEvent.blur(textArea)
    expect(updateReplySed).toHaveBeenCalledWith('bruker.ytterligereInfo', 'changed')
  })
})
