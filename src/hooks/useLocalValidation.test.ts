import { ErrorElement } from 'declarations/app'
import useLocalValidation from 'hooks/useLocalValidation'
const mockSetState: any = jest.fn()

jest.mock('react', () => ({
  useState: (initState: any) => [initState, mockSetState]
}))

interface Item {
  value1: string
  value2: string
}

describe('hooks/useLocalValidation', () => {
  const initialValidation = {
    a: '1',
    b: '2'
  }

  const validationFunc = jest.fn()

  it('useLocalValidation: Initial state set', () => {
    const [validation] = useLocalValidation<Item>(validationFunc, 'text-mock', initialValidation)
    expect(validation).toEqual(initialValidation)
  })

  it('useLocalValidation: reset validation to set empty validation', () => {
    (mockSetState).mockReset()
    const [, resetValidation] = useLocalValidation<Item>(validationFunc, 'text-mock', initialValidation)
    resetValidation()
    expect(mockSetState).toBeCalledWith({})
  })

  it('useLocalValidation: reset validation to set one validation', () => {
    (mockSetState).mockReset()
    const [, resetValidation] = useLocalValidation<Item>(validationFunc, 'text-mock', initialValidation)
    resetValidation('a')
    expect(mockSetState).toBeCalledWith({ a: undefined, b: '2' })
  })

  it('useLocalValidation: perform validation', () => {
    const [, , performValidation] = useLocalValidation<Item>(validationFunc, 'text-mock', initialValidation)
    performValidation({
      value1: 'a',
      value2: 'b'
    })
    expect(validationFunc).toBeCalledWith({}, expect.any(Function), {
      value1: 'a',
      value2: 'b'
    })
  })

  it('useLocalValidation: sert validation', () => {
    const error: ErrorElement = {
      feilmelding: 'feilmelding',
      skjemaelementId: 'skjemaelementId'
    };
    (mockSetState).mockReset()
    const [, , , setValidation] = useLocalValidation<Item>(validationFunc, 'text-mock', initialValidation)
    setValidation({ c: error })
    expect(mockSetState).toBeCalledWith({ c: error })
  })
})
