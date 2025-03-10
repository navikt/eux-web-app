import React from 'react'
import {resetValidation} from 'actions/validation'
import {MainFormProps, MainFormSelector} from 'applications/SvarSed/MainForm'
import DateField from 'components/DateField/DateField'
import Input from 'components/Forms/Input'

import {State} from 'declarations/reducers'
import {PersonInfo} from 'declarations/sed.d'
import _ from 'lodash'
import {useTranslation} from 'react-i18next'
import {useAppDispatch, useAppSelector} from 'store'
import {TopAlignedGrid} from "../../../components/StyledComponents";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const PersonBasic: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const {t} = useTranslation()
  const {validation} = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target: string = `${personID}.personInfo`
  const person: PersonInfo | undefined = _.get(replySed, target) // undefined for a brief time when switching to 'familie'
  const namespace: string = `${parentNamespace}-${personID}-personbasic`

  const setFornavn = (newFornavn: string) => {
    if(newFornavn === ""){
      dispatch(updateReplySed(`${target}.fornavn`, undefined))
    } else {
      dispatch(updateReplySed(`${target}.fornavn`, newFornavn))
    }
    if (validation[namespace + '-fornavn']) {
      dispatch(resetValidation(namespace + '-fornavn'))
    }
  }

  const setEtternavn = (newEtternavn: string) => {
    if(newEtternavn === ""){
      dispatch(updateReplySed(`${target}.etternavn`, undefined))
    } else {
      dispatch(updateReplySed(`${target}.etternavn`, newEtternavn.trim()))
    }
    if (validation[namespace + '-etternavn']) {
      dispatch(resetValidation(namespace + '-etternavn'))
    }
  }

  const setFodselsdato = (dato: string) => {
    if(dato === ""){
      dispatch(updateReplySed(`${target}.foedselsdato`, undefined))
    } else {
      dispatch(updateReplySed(`${target}.foedselsdato`, dato.trim()))
    }
    if (validation[namespace + '-foedselsdato']) {
      dispatch(resetValidation(namespace + '-foedselsdato'))
    }
  }

  return (
    <>
      <TopAlignedGrid gap="4" columns={3}>
        <Input
          error={validation[namespace + '-fornavn']?.feilmelding}
          id='fornavn'
          label={t('label:fornavn')}
          namespace={namespace}
          onChanged={setFornavn}
          required
          value={person?.fornavn ?? ''}
        />
        <Input
          error={validation[namespace + '-etternavn']?.feilmelding}
          id='etternavn'
          label={t('label:etternavn')}
          namespace={namespace}
          onChanged={setEtternavn}
          required
          value={person?.etternavn ?? ''}
        />
        <DateField
          error={validation[namespace + '-foedselsdato']?.feilmelding}
          id='foedselsdato'
          label={t('label:fødselsdato')}
          namespace={namespace}
          onChanged={setFodselsdato}
          required
          dateValue={person?.foedselsdato ?? ''}
        />
      </TopAlignedGrid>
    </>
  )
}

export default PersonBasic
