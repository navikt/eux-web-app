import { fireEvent, render, screen } from '@testing-library/react'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import SvarPåForespørsel from 'applications/SvarSed/SvarPåForespørsel/SvarPåForespørsel'
import { H002Sed } from 'declarations/h002'
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

const getReplySed = (bruker: object): ReplySed => ({
  sedType: 'H002',
  sedVersjon: '4.4',
  ytterligereInfo: 'root level, not ours',
  bruker: {
    personInfo: { fornavn: 'Ola' },
    adresser: [{ type: 'bosted', by: 'Oslo' }],
    ...bruker
  }
} as unknown as ReplySed)

const otherNegativtSvar = [
  { informasjon: 'second info', dokument: 'second doc', sed: 'second sed', grunn: 'second grunn' },
  { grunn: 'third grunn' }
]

describe('applications/SvarSed/SvarPåForespørsel/SvarPåForespørsel', () => {
  const updateReplySed = jest.fn()
  const setReplySed = jest.fn()
  const getProps = (replySed: ReplySed): MainFormProps => ({
    parentNamespace: 'test',
    personID: 'bruker',
    replySed,
    updateReplySed,
    setReplySed
  })

  beforeEach(() => {
    updateReplySed.mockReset()
    setReplySed.mockReset()
    stageSelector(defaultSelector, {})
  })

  it('Positive answer is read from bruker.positivtSvar', () => {
    render(<SvarPåForespørsel {...getProps(getReplySed({
      positivtSvar: { informasjon: 'pos info', dokument: 'pos doc', sed: 'pos sed' }
    }))} />)
    expect(screen.getByLabelText('el:option-svar-1')).toBeChecked()
    expect(screen.getByDisplayValue('pos info')).toBeInTheDocument()
    expect(screen.getByDisplayValue('pos doc')).toBeInTheDocument()
    expect(screen.getByDisplayValue('pos sed')).toBeInTheDocument()
    expect(screen.queryByLabelText('label:grunn')).not.toBeInTheDocument()
  })

  it('Negative answer shows the first entry of bruker.negativtSvar', () => {
    render(<SvarPåForespørsel {...getProps(getReplySed({
      negativtSvar: [
        { informasjon: 'neg info', dokument: 'neg doc', sed: 'neg sed', grunn: 'neg grunn' },
        ...otherNegativtSvar
      ]
    }))} />)
    expect(screen.getByLabelText('el:option-svar-2')).toBeChecked()
    expect(screen.getByDisplayValue('neg info')).toBeInTheDocument()
    expect(screen.getByDisplayValue('neg doc')).toBeInTheDocument()
    expect(screen.getByDisplayValue('neg sed')).toBeInTheDocument()
    expect(screen.getByDisplayValue('neg grunn')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('second info')).not.toBeInTheDocument()
  })

  it('Nothing is selected without an answer', () => {
    render(<SvarPåForespørsel {...getProps(getReplySed({}))} />)
    expect(screen.getByLabelText('el:option-svar-1')).not.toBeChecked()
    expect(screen.getByLabelText('el:option-svar-2')).not.toBeChecked()
    expect(screen.queryByLabelText('label:sed')).not.toBeInTheDocument()
  })

  it.each([
    ['pos info', 'informasjon'],
    ['pos doc', 'dokument'],
    ['pos sed', 'sed']
  ])('Handling: editing positive %s writes bruker.positivtSvar.%s', (current: string, field: string) => {
    render(<SvarPåForespørsel {...getProps(getReplySed({
      positivtSvar: { informasjon: 'pos info', dokument: 'pos doc', sed: 'pos sed' }
    }))} />)
    const textArea = screen.getByDisplayValue(current)
    fireEvent.change(textArea, { target: { value: ' changed ' } })
    fireEvent.blur(textArea)
    expect(updateReplySed).toHaveBeenCalledWith(`bruker.positivtSvar.${field}`, 'changed')
  })

  it.each([
    ['neg info', 'informasjon'],
    ['neg doc', 'dokument'],
    ['neg sed', 'sed'],
    ['neg grunn', 'grunn']
  ])('Handling: editing negative %s only writes bruker.negativtSvar[0].%s', (current: string, field: string) => {
    render(<SvarPåForespørsel {...getProps(getReplySed({
      negativtSvar: [
        { informasjon: 'neg info', dokument: 'neg doc', sed: 'neg sed', grunn: 'neg grunn' },
        ...otherNegativtSvar
      ]
    }))} />)
    const textArea = screen.getByDisplayValue(current)
    fireEvent.change(textArea, { target: { value: ' changed ' } })
    fireEvent.blur(textArea)
    expect(updateReplySed).toHaveBeenCalledTimes(1)
    expect(updateReplySed).toHaveBeenCalledWith(`bruker.negativtSvar[0].${field}`, 'changed')
    expect(setReplySed).not.toHaveBeenCalled()
  })

  it('Handling: from positive to negative moves the answer to a new first negative entry and keeps existing ones', () => {
    const replySed = getReplySed({
      positivtSvar: { informasjon: 'pos info', dokument: 'pos doc', sed: 'pos sed' },
      negativtSvar: otherNegativtSvar,
      ytterligereInfo: 'bruker comment',
      vedlegg: { type: ['søknad'], andreDokumenter: ['other'] },
      identifisering: { personInfo: { fornavn: 'Kari' } }
    })
    render(<SvarPåForespørsel {...getProps(replySed)} />)
    fireEvent.click(screen.getByLabelText('el:option-svar-2'))

    expect(setReplySed).toHaveBeenCalledTimes(1)
    const newReplySed = setReplySed.mock.calls[0][0]
    expect(newReplySed.bruker.positivtSvar).toBeUndefined()
    expect(newReplySed.bruker.negativtSvar).toEqual([
      { informasjon: 'pos info', dokument: 'pos doc', sed: 'pos sed' },
      ...otherNegativtSvar
    ])
    // untouched nested data is carried over as is
    expect(newReplySed.bruker.negativtSvar[1]).toBe(otherNegativtSvar[0])
    expect(newReplySed.bruker.negativtSvar[2]).toBe(otherNegativtSvar[1])
    expect(newReplySed.bruker.vedlegg).toBe((replySed as H002Sed).bruker.vedlegg)
    expect(newReplySed.bruker.identifisering).toBe((replySed as H002Sed).bruker.identifisering)
    expect(newReplySed.bruker.ytterligereInfo).toEqual('bruker comment')
    expect(newReplySed.bruker.adresser).toBe((replySed as H002Sed).bruker.adresser)
    expect(newReplySed.ytterligereInfo).toEqual('root level, not ours')
    // the original is not mutated
    expect((replySed as H002Sed).bruker.positivtSvar).toBeDefined()
    expect((replySed as H002Sed).bruker.negativtSvar).toHaveLength(2)
  })

  it('Handling: from positive to negative without existing negative entries', () => {
    render(<SvarPåForespørsel {...getProps(getReplySed({
      positivtSvar: { informasjon: 'pos info' }
    }))} />)
    fireEvent.click(screen.getByLabelText('el:option-svar-2'))
    const newReplySed = setReplySed.mock.calls[0][0]
    expect(newReplySed.bruker.negativtSvar).toEqual([{ informasjon: 'pos info', dokument: '', sed: '' }])
    expect(newReplySed.bruker.positivtSvar).toBeUndefined()
  })

  it('Handling: from negative to positive moves the first entry and keeps the other negative entries', () => {
    const replySed = getReplySed({
      negativtSvar: [
        { informasjon: 'neg info', dokument: 'neg doc', sed: 'neg sed', grunn: 'neg grunn' },
        ...otherNegativtSvar
      ]
    })
    render(<SvarPåForespørsel {...getProps(replySed)} />)
    fireEvent.click(screen.getByLabelText('el:option-svar-1'))

    const newReplySed = setReplySed.mock.calls[0][0]
    expect(newReplySed.bruker.positivtSvar).toEqual({ informasjon: 'neg info', dokument: 'neg doc', sed: 'neg sed' })
    expect(newReplySed.bruker.negativtSvar).toHaveLength(2)
    expect(newReplySed.bruker.negativtSvar[0]).toBe(otherNegativtSvar[0])
    expect(newReplySed.bruker.negativtSvar[1]).toBe(otherNegativtSvar[1])
    expect((replySed as H002Sed).bruker.negativtSvar).toHaveLength(3)
  })

  it('Handling: from negative to positive removes the negative list when it only had the edited entry', () => {
    render(<SvarPåForespørsel {...getProps(getReplySed({
      negativtSvar: [{ informasjon: 'neg info', grunn: 'neg grunn' }]
    }))} />)
    fireEvent.click(screen.getByLabelText('el:option-svar-1'))
    const newReplySed = setReplySed.mock.calls[0][0]
    expect(newReplySed.bruker.positivtSvar).toEqual({ informasjon: 'neg info', dokument: '', sed: '' })
    expect('negativtSvar' in newReplySed.bruker).toBe(false)
  })

  it('Handling: choosing an answer without any existing answer keeps existing empty negative entries', () => {
    const emptyEntries = [{ grunn: '' }]
    render(<SvarPåForespørsel {...getProps(getReplySed({ negativtSvar: emptyEntries }))} />)
    fireEvent.click(screen.getByLabelText('el:option-svar-1'))
    const newReplySed = setReplySed.mock.calls[0][0]
    expect(newReplySed.bruker.positivtSvar).toEqual({ informasjon: '', dokument: '', sed: '' })
    expect(newReplySed.bruker.negativtSvar).toEqual(emptyEntries)
  })
})
