import * as types from 'constants/actionTypes'
import * as uiActions from 'actions/ui'
import { ModalContent } from 'eessi-pensjon-ui/dist/declarations/components'
import i18n from 'i18n'
jest.mock('i18n', () => ({
  changeLanguage: jest.fn()
}))

describe('actions/ui', () => {
  it('changeLanguage()', () => {
    const mockLanguage = 'en'
    const generatedResult = uiActions.changeLanguage(mockLanguage)
    expect(i18n.changeLanguage).toBeCalledWith(mockLanguage)
    expect(generatedResult).toMatchObject({
      type: types.UI_LANGUAGE_CHANGED,
      payload: mockLanguage
    })
  })

  it('openModal()', () => {
    const mockModal = {
      modalTitle: 'title'
    } as ModalContent
    const generatedResult = uiActions.openModal(mockModal)
    expect(generatedResult).toMatchObject({
      type: types.UI_MODAL_SET,
      payload: mockModal
    })
  })

  it('closeModal()', () => {
    const generatedResult = uiActions.closeModal()
    expect(generatedResult).toMatchObject({
      type: types.UI_MODAL_SET,
      payload: undefined
    })
  })

  it('toggleFooterOpen()', () => {
    const generatedResult = uiActions.toggleFooterOpen()
    expect(generatedResult).toMatchObject({
      type: types.UI_FOOTER_TOGGLE_OPEN
    })
  })

  it('toggleHighContrast()', () => {
    const generatedResult = uiActions.toggleHighContrast()
    expect(generatedResult).toMatchObject({
      type: types.UI_HIGHCONTRAST_TOGGLE
    })
  })
})
