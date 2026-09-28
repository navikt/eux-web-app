import aarligKontrollReducer, { initialAarligKontrollState } from './aarligKontroll'
import * as types from 'constants/actionTypes'

describe('reducers/aarligKontroll', () => {
  const f001Saks: any = [{ sakId: '123', fagsak: {}, sedListe: [] }]

  it('AARLIG_KONTROLL_FILTERED_F001_SAK_SUCCESS keeps the fnr the list was fetched for', () => {
    expect(
      aarligKontrollReducer(initialAarligKontrollState, {
        type: types.AARLIG_KONTROLL_FILTERED_F001_SAK_SUCCESS,
        payload: f001Saks,
        context: { fnr: '01010100001' }
      })
    ).toEqual({
      ...initialAarligKontrollState,
      filteredF001Saks: f001Saks,
      filteredF001SaksContext: { fnr: '01010100001' }
    })
  })

  it('AARLIG_KONTROLL_FILTERED_F001_SAK_FAILURE keeps the fnr the failed search was for', () => {
    expect(
      aarligKontrollReducer(initialAarligKontrollState, {
        type: types.AARLIG_KONTROLL_FILTERED_F001_SAK_FAILURE,
        context: { fnr: '01010100001' }
      })
    ).toEqual({
      ...initialAarligKontrollState,
      filteredF001Saks: null,
      filteredF001SaksContext: { fnr: '01010100001' }
    })
  })

  it('AARLIG_KONTROLL_FILTERED_F001_SAK_REQUEST clears both list and context', () => {
    expect(
      aarligKontrollReducer({
        filteredF001Saks: f001Saks,
        filteredF001SaksContext: { fnr: '01010100001' },
        utkastF001: undefined
      }, {
        type: types.AARLIG_KONTROLL_FILTERED_F001_SAK_REQUEST
      })
    ).toEqual(initialAarligKontrollState)
  })
})
