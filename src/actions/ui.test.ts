import * as uiActions from 'actions/ui'
import * as types from 'constants/actionTypes'
import { ModalContent } from 'declarations/components'

describe('actions/ui', () => {
  it('closeModal()', () => {
    const generatedResult = uiActions.closeModal()
    expect(generatedResult).toMatchObject({
      type: types.UI_MODAL_SET,
      payload: undefined
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

  it('toggleHighContrast()', () => {
    const generatedResult = uiActions.toggleHighContrast()
    expect(generatedResult).toMatchObject({
      type: types.UI_HIGHCONTRAST_TOGGLE
    })
  })
})
