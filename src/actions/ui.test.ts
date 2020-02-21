import * as types from 'constants/actionTypes'
import * as uiActions from 'actions/ui'
import { ModalContent } from 'eessi-pensjon-ui/dist/declarations/components'

describe('actions/ui', () => {

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

  it('toggleHighContrast()', () => {
    const generatedResult = uiActions.toggleHighContrast()
    expect(generatedResult).toMatchObject({
      type: types.UI_HIGHCONTRAST_TOGGLE
    })
  })
})
