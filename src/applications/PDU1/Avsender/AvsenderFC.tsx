import { Heading, Switch } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { validateAvsender, ValidationAvsenderProps } from 'applications/PDU1/Avsender/validation'
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import {Avsender} from 'declarations/pd'
import { State } from 'declarations/reducers'
import { Adresse } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const AvsenderFC: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'avsender'
  const avsender: Avsender = _.get(replySed, target)
  const namespace = `${parentNamespace}-avsender`

  const [allowEdit, setAllowEdit] = useState<boolean>(false)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAvsenderProps>(
      clonedvalidation, namespace, validateAvsender, {
        avsender: avsender,
        keyForCity: 'poststed',
        keyforZipCode: 'postNr'
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setEnhetNavn = (enhetNavn: string) => {
    dispatch(updateReplySed(`${target}.navEnhetNavn`, enhetNavn.trim()))
    if (validation[namespace + '-enhetNavn']) {
      dispatch(resetValidation(namespace + '-enhetNavn'))
    }
  }

  const setOrgNr = (orgNr: string) => {
    dispatch(updateReplySed(`${target}.navOrgNr`, orgNr.trim()))
    if (validation[namespace + '-orgNr']) {
      dispatch(resetValidation(namespace + '-orgNr'))
    }
  }

  const setAdresse = (adresse: Adresse, type: string | undefined) => {
    dispatch(updateReplySed(`${target}.adresse`, adresse))
    if (type && validation[namespace + '-' + type]) {
      dispatch(resetValidation(namespace + '-' + type))
    }
  }

  const setTlf = (tlf: string) => {
    dispatch(updateReplySed(`${target}.navTlf`, tlf.trim()))
    if (validation[namespace + '-tlf']) {
      dispatch(resetValidation(namespace + '-tlf'))
    }
  }

  const setSaksbehandlerNavn = (navn: string) => {
    dispatch(updateReplySed(`${target}.saksbehandler.navn`, navn.trim()))
    if (validation[namespace + '-saksbehandler-navn']) {
      dispatch(resetValidation(namespace + '-saksbehandler-navn'))
    }
  }

  const setSaksbehandlerEnhet = (enhet: string) => {
    dispatch(updateReplySed(`${target}.saksbehandler.enhetNavn`, enhet.trim()))
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
            label={t('label:enhet-navn')}
            onChanged={setEnhetNavn}
            required
            value={avsender?.navEnhetNavn}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <Input
            disabled={!allowEdit}
            error={validation[namespace + '-orgNr']?.feilmelding}
            namespace={namespace}
            id='orgNr'
            label={t('label:enhet-id')}
            onChanged={setOrgNr}
            required
            value={avsender?.navOrgNr}
          />
        </Column>
        <Column>
          <Input
            disabled={!allowEdit}
            error={validation[namespace + '-tlf']?.feilmelding}
            namespace={namespace}
            id='tlf'
            label={t('label:telefonnummer')}
            onChanged={setTlf}
            required
            value={avsender?.navTlf}
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
            label={t('label:saksbehandlers-navn')}
            onChanged={setSaksbehandlerNavn}
            required
            value={avsender?.saksbehandler?.navn}
          />
        </Column>
        <Column>
          <Input
            disabled={!allowEdit}
            error={validation[namespace + '-saksbehandler-enhet']?.feilmelding}
            namespace={namespace}
            id='saksbehandler-enhet'
            label={t('label:saksbehandlers-enhet')}
            onChanged={setSaksbehandlerEnhet}
            required
            value={avsender?.saksbehandler?.enhetNavn}
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
            namespace={namespace + '-adresse'}
            keyForCity='poststed'
            keyforZipCode='postNr'
            validation={validation}
            adresse={avsender?.adresse}
            onAdressChanged={setAdresse}
          />
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default AvsenderFC
