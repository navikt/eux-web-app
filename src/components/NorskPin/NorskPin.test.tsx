import NorskPin, { NorskPinProps } from 'components/NorskPin/NorskPin'
import { PersonInfoPDL } from 'declarations/types'
import { render } from '@testing-library/react'
import { stageSelector } from 'setupTests'

jest.mock('actions/person', () => ({
  resetPerson: jest.fn(() => ({ type: 'PERSON_SEARCH_RESET' })),
  searchPerson: jest.fn(() => ({ type: 'PERSON_SEARCH_REQUEST' }))
}))

const mockSearchedPerson: PersonInfoPDL = {
  fnr: '02026100715',
  fornavn: 'FORELDER',
  etternavn: 'BLYANT',
  kjoenn: 'KVINNE'
}

const defaultSelector = {
  searchedPerson: undefined,
  personSearchContext: undefined,
  searchingPerson: false,
  alertMessage: undefined,
  alertType: undefined
}

describe('components/NorskPin/NorskPin', () => {
  let wrapper: any

  const initialMockProps: NorskPinProps = {
    norwegianPin: { identifikator: '15121986016', landkode: 'NOR' },
    error: undefined,
    namespace: 'test-barn[0]-personopplysninger',
    onNorwegianPinSave: jest.fn(),
    onFillOutPerson: jest.fn()
  }

  beforeEach(() => {
    (initialMockProps.onFillOutPerson as jest.Mock).mockReset()
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  /**
   * state.person.person is shared with every other person search in the app. A person left there by
   * another page (f.ex. Årlig kontroll) or by another person's tab must never be applied on mount,
   * or the child ends up with the parent's fnr and name.
   */
  it('does not apply a person search result it did not ask for', () => {
    stageSelector(defaultSelector, {
      searchedPerson: mockSearchedPerson,
      personSearchContext: undefined
    })
    wrapper = render(<NorskPin {...initialMockProps} />)
    expect(initialMockProps.onFillOutPerson).not.toHaveBeenCalled()
  })

  it('does not apply a person search result belonging to another component instance', () => {
    stageSelector(defaultSelector, {
      searchedPerson: mockSearchedPerson,
      personSearchContext: { searchId: 'some-other-instance' }
    })
    wrapper = render(<NorskPin {...initialMockProps} />)
    expect(initialMockProps.onFillOutPerson).not.toHaveBeenCalled()
  })
})
