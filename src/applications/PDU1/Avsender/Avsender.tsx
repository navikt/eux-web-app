import { Heading, Switch } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import AdresseForm from 'applications/SvarSed/MainForm/Adresser/AdresseForm'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import classNames from 'classnames'
import Input from 'components/Forms/Input'
import { NavInfo } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { Adresse } from 'declarations/sed'
import _ from 'lodash'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const Avsender: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}:TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useSelector<State, TwoLevelFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'nav'
  const nav: NavInfo = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-avsender`

  const [allowEdit, setAllowEdit] = useState<boolean>(false)

  const setEnhetNavn = (enhetNavn: string) => {
    dispatch(updateReplySed(`${target}.enhetNavn`, enhetNavn))
    if (validation[namespace + '-enhetNavn']) {
      dispatch(resetValidation(namespace + '-enhetNavn'))
    }
  }

  const setEnhetId = (enhetId: string) => {
    dispatch(updateReplySed(`${target}.enhetId`, enhetId))
    if (validation[namespace + '-enhetId']) {
      dispatch(resetValidation(namespace + '-enhetId'))
    }
  }

  const setAdresse = (adresse: Adresse, type: string | undefined) => {
    dispatch(updateReplySed(`${target}.adresse`, adresse))
    if (type && validation[namespace + '-' + type]) {
      dispatch(resetValidation(namespace + '-' + type))
    }
  }

  const setTlf = (tlf: string) => {
    dispatch(updateReplySed(`${target}.tlf`, tlf))
    if (validation[namespace + '-tlf']) {
      dispatch(resetValidation(namespace + '-tlf'))
    }
  }

  const setSaksbehandlerNavn = (navn: string) => {
    dispatch(updateReplySed(`${target}.saksbehandler.navn`, navn))
    if (validation[namespace + '-saksbehandler-navn']) {
      dispatch(resetValidation(namespace + '-saksbehandler-navn'))
    }
  }

  const setSaksbehandlerEnhet = (enhet: string) => {
    dispatch(updateReplySed(`${target}.saksbehandler.enhet`, enhet))
    if (validation[namespace + '-saksbehandler-enhet']) {
      dispatch(resetValidation(namespace + '-saksbehandler-enhet'))
    }
  }

  return (
    <PaddedDiv key={namespace + '-div'}>
      <Heading size='medium'>
        {t('label:avsender')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <Switch
        checked={allowEdit}
        onChange={() => setAllowEdit(!allowEdit)}
      >
        {t('label:edit')}
      </Switch>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <Input
            disabled={!allowEdit}
            error={validation[namespace + '-enhetNavn']?.feilmelding}
            namespace={namespace}
            id='enhetNavn'
            label={t('label:enhet-navn') + ' *'}
            onChanged={setEnhetNavn}
            value={nav?.enhetNavn}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <Input
            disabled={!allowEdit}
            error={validation[namespace + '-enhetId']?.feilmelding}
            namespace={namespace}
            id='enhetId'
            label={t('label:enhet-id') + ' *'}
            onChanged={setEnhetId}
            value={nav?.enhetId}
          />
        </Column>
        <Column>
          <Input
            disabled={!allowEdit}
            error={validation[namespace + '-tlf']?.feilmelding}
            namespace={namespace}
            id='tlf'
            label={t('label:telefonnummer') + ' *'}
            onChanged={setTlf}
            value={nav?.tlf}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <Input
            disabled={!allowEdit}
            error={validation[namespace + '-saksbehandler-navn']?.feilmelding}
            namespace={namespace}
            id='saksbehandler-navn'
            label={t('label:saksbehandlers-navn') + ' *'}
            onChanged={setSaksbehandlerNavn}
            value={nav?.saksbehandler?.navn}
          />
        </Column>
        <Column>
          <Input
            disabled={!allowEdit}
            error={validation[namespace + '-saksbehandler-enhet']?.feilmelding}
            namespace={namespace}
            id='saksbehandler-enhet'
            label={t('label:saksbehandlers-enhet') + ' *'}
            onChanged={setSaksbehandlerEnhet}
            value={nav?.saksbehandler?.enhet}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <Heading size='small'>{t('label:adresse')}</Heading>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <AdresseForm
            disabled={!allowEdit}
            type={false}
            options={{ bygning: false, region: false }}
            required={['gate', 'postnummer', 'by', 'land']}
            useUK
            namespace={namespace + '-adresse'}
            keyForCity='poststed'
            keyforZipCode='postnr'
            validation={validation}
            adresse={nav?.adresse}
            onAdressChanged={setAdresse}
          />
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default Avsender
