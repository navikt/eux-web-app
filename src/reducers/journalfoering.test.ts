import * as types from 'constants/actionTypes'
import { Sak } from 'declarations/types'
import journalfoeringReducer, { initialJournalfoeringState } from './journalfoering'

const sak = {
  sakId: '123',
  fornavn: 'Ola',
  etternavn: 'Nordmann',
  kjoenn: 'M',
  foedselsdato: '1980-01-01'
} as Sak

describe('reducers/journalfoering', () => {
  it('JOURNALFOERING_H001_CREATE builds a nested typed H001 with the anmodning on bruker', () => {
    const state = journalfoeringReducer(initialJournalfoeringState, {
      type: types.JOURNALFOERING_H001_CREATE,
      payload: { sak, informasjonTekst: 'please send' }
    })
    expect(state.H001).toEqual({
      sedType: 'H001',
      bruker: {
        personInfo: { fornavn: 'Ola', etternavn: 'Nordmann', kjoenn: 'M', foedselsdato: '1980-01-01' },
        anmodning: { dokumentasjon: { informasjon: 'please send' } }
      }
    })
    expect(state.H001).not.toHaveProperty('anmodning')
    expect(state.H001).not.toHaveProperty('ytterligereInfo')
    expect(state.H001?.bruker).not.toHaveProperty('ytterligereInfo')
    expect(state.H001?.bruker).not.toHaveProperty('ytterligereInfoType')
  })

  it('JOURNALFOERING_H001_CREATE with additional info puts type and text on bruker', () => {
    const state = journalfoeringReducer(initialJournalfoeringState, {
      type: types.JOURNALFOERING_H001_CREATE,
      payload: { sak, informasjonTekst: 'please send', ytterligereInfo: 'International id: 1' }
    })
    expect(state.H001).toEqual({
      sedType: 'H001',
      bruker: {
        personInfo: { fornavn: 'Ola', etternavn: 'Nordmann', kjoenn: 'M', foedselsdato: '1980-01-01' },
        anmodning: { dokumentasjon: { informasjon: 'please send' } },
        ytterligereInfoType: 'melding_om_mer_informasjon',
        ytterligereInfo: 'International id: 1'
      }
    })
    expect(state.H001).not.toHaveProperty('ytterligereInfo')
    expect(state.H001).not.toHaveProperty('ytterligereInfoType')
  })

  it('JOURNALFOERING_H001_CREATE falls back to defaults for missing person data', () => {
    const state = journalfoeringReducer(initialJournalfoeringState, {
      type: types.JOURNALFOERING_H001_CREATE,
      payload: { sak: { sakId: '123' }, informasjonTekst: 'text' }
    })
    expect(state.H001?.bruker.personInfo).toEqual({
      fornavn: 'XX', etternavn: 'XX', kjoenn: 'U', foedselsdato: '1900-01-01'
    })
  })
})
