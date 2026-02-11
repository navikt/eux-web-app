import { Box, Heading, HGrid, Switch, VStack } from '@navikt/ds-react'
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
  const avsender: Avsender | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-avsender`

  const [allowEdit, setAllowEdit] = useState<boolean>(false)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAvsenderProps>(
      clonedvalidation, namespace, validateAvsender, {
        avsender: avsender,
        keyForCity: 'poststed',
        keyforZipCode: 'postnr'
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
    <Box padding="4" key={namespace + '-div'}>
      <VStack gap="4">
        <Heading size='medium'>
          {t('label:avsender')}
        </Heading>
        <Switch
          checked={allowEdit}
          onChange={() => setAllowEdit(!allowEdit)}
        >
          {t('label:edit')}
        </Switch>
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
        <HGrid columns={2} gap="4" align="start">
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
        </HGrid>
        <HGrid columns={2} gap="4" align="start">
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
        </HGrid>
        <Heading size='small'>{t('label:adresse')}</Heading>
        <AdresseForm
          disabled={!allowEdit}
          type={false}
          options={{ bygning: false, region: false }}
          required={['gate', 'postnummer', 'by', 'land']}
          namespace={namespace + '-adresse'}
          keyForCity='poststed'
          keyforZipCode='postnr'
          validation={validation}
          adresse={avsender?.adresse}
          onAdressChanged={setAdresse}
        />
      </VStack>
    </Box>
  )
}

export default AvsenderFC
