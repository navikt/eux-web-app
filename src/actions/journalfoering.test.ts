import * as journalfoeringActions from 'actions/journalfoering'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { H001Sed } from 'declarations/h001'
import { Sak } from 'declarations/types'
import { call as originalCall } from '@navikt/fetch'
// @ts-ignore
import { sprintf } from 'sprintf-js'

jest.mock('@navikt/fetch', () => ({
  call: jest.fn()
}))
const call = originalCall as jest.Mock<typeof originalCall>

const H001 = {
  sedType: 'H001',
  sedVersjon: '4.4',
  bruker: {
    personInfo: { fornavn: 'Ola', etternavn: 'Nordmann', kjoenn: 'M', foedselsdato: '1980-01-01' },
    anmodning: { dokumentasjon: { informasjon: 'please send' } },
    ytterligereInfoType: 'melding_om_mer_informasjon',
    ytterligereInfo: 'extra'
  }
} as unknown as H001Sed

describe('actions/journalfoering', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('createH001() carries the data for the reducer', () => {
    const sak = { sakId: '123' } as unknown as Sak
    expect(journalfoeringActions.createH001(sak, 'info', 'extra')).toEqual({
      type: types.JOURNALFOERING_H001_CREATE,
      payload: { sak, informasjonTekst: 'info', ytterligereInfo: 'extra' }
    })
  })

  it('createH001SedInRina() posts the nested H001 to the typed endpoint', () => {
    journalfoeringActions.createH001SedInRina('123', H001)
    expect(call).toBeCalledWith(expect.objectContaining({
      method: 'POST',
      url: sprintf(urls.API_SED_CREATE_BY_TYPE_URL, { rinaSakId: '123', sedType: 'h001' }),
      body: H001,
      type: {
        request: types.JOURNALFOERING_H001_CREATE_REQUEST,
        success: types.JOURNALFOERING_H001_CREATE_SUCCESS,
        failure: types.JOURNALFOERING_H001_CREATE_FAILURE
      }
    }))
    expect(call.mock.calls[0][0].url).toMatch(/\/v1\/rinasaker\/123\/h001$/)
  })

  it('updateH001SedInRina() puts the nested H001 to the typed endpoint', () => {
    journalfoeringActions.updateH001SedInRina('123', '456', H001)
    expect(call).toBeCalledWith(expect.objectContaining({
      method: 'PUT',
      url: sprintf(urls.API_SED_UPDATE_BY_TYPE_URL, { rinaSakId: '123', sedType: 'h001', sedId: '456' }),
      body: H001,
      type: {
        request: types.JOURNALFOERING_H001_UPDATE_REQUEST,
        success: types.JOURNALFOERING_H001_UPDATE_SUCCESS,
        failure: types.JOURNALFOERING_H001_UPDATE_FAILURE
      }
    }))
    expect(call.mock.calls[0][0].url).toMatch(/\/v1\/rinasaker\/123\/h001\/456$/)
  })

  it('sendH001SedInRina() still uses the common send endpoint', () => {
    journalfoeringActions.sendH001SedInRina('123', '456')
    expect(call).toBeCalledWith(expect.objectContaining({
      method: 'POST',
      url: sprintf(urls.API_SED_SEND_URL, { rinaSakId: '123', sedId: '456' })
    }))
  })
})
