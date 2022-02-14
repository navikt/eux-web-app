import { ErrorElement } from 'declarations/app'
import useValidation from 'hooks/useValidation'
const mockSetState: any = jest.fn()

jest.mock('react', () => ({
  useState: (initState: any) => [initState, mockSetState]
}))

interface Item {
  value1: string
  value2: string
}

describe('hooks/useValidation', () => {
  const initialValidation = {
    a: '1',
    b: '2'
  }

  const validationFunc = jest.fn()

  it('useValidation: Initial state set', () => {
    const [validation]  = useValidation<Item>(initialValidation, validationFunc)
    expect(validation).toEqual(initialValidation)
  })

  it('useValidation: reset validation to set empty validation', () => {
    (mockSetState).mockReset()
    const [, resetValidation]  = useValidation<Item>(initialValidation, validationFunc)
    resetValidation()
    expect(mockSetState).toBeCalledWith({})
  })

  it('useValidation: reset validation to set one validation', () => {
    (mockSetState).mockReset()
    const [, resetValidation]  = useValidation<Item>(initialValidation, validationFunc)
    resetValidation('a')
    expect(mockSetState).toBeCalledWith({a: undefined, b: '2'})
  })

  it('useValidation: perform validation', () => {
    const [, ,performValidation]  = useValidation<Item>(initialValidation, validationFunc)
    performValidation({
      value1: 'a',
      value2: 'b'
    })
    expect(validationFunc).toBeCalledWith({}, expect.any(Function), {
      value1: 'a',
      value2: 'b'
    })
  })

  it('useValidation: sert validation', () => {
    const error: ErrorElement = {
      feilmelding: 'feilmelding',
      skjemaelementId: 'skjemaelementId'
    };
    (mockSetState).mockReset()
    const [, , , setValidation]  = useValidation<Item>(initialValidation, validationFunc)
    setValidation({c: error})
    expect(mockSetState).toBeCalledWith({c: error})
  })
})
