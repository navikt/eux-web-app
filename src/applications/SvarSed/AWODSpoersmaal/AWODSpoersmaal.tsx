import { Box, Heading, HStack, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateAWODSpoersmaal, ValidationAWODSpoersmaalProps } from 'applications/SvarSed/AWODSpoersmaal/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import DateField from 'components/DateField/DateField'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { H120Sed } from 'declarations/h120'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const AWODSpoersmaal: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-awodspoersmaal`
  const sed = replySed as H120Sed

  const awodTypeOptions: Options = [
    { label: t('el:option-h120-awodtype-arbeidsulykke'), value: 'arbeidsulykke' },
    { label: t('el:option-h120-awodtype-yrkessykdom'), value: 'yrkessykdom' }
  ]

  const brukerStatusOptions: Options = [
    { label: t('el:option-h120-brukerstatus-arbeidstaker'), value: 'arbeidstaker' },
    { label: t('el:option-h120-brukerstatus-selvstendig_næringsdrivende'), value: 'selvstendig_næringsdrivende' },
    { label: t('el:option-h120-brukerstatus-offentlig_ansatt'), value: 'offentlig_ansatt' },
    { label: t('el:option-h120-brukerstatus-grensearbeider'), value: 'grensearbeider' },
    { label: t('el:option-h120-brukerstatus-annet'), value: 'annet' }
  ]

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAWODSpoersmaalProps>(
      clonedvalidation, namespace, validateAWODSpoersmaal, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setType = (value: string) => {
    dispatch(updateReplySed('arbeidsulykkeyrkessykdom.type', value.trim()))
    if (validation[namespace + '-type']) {
      dispatch(resetValidation(namespace + '-type'))
    }
  }

  const setDato = (value: string) => {
    dispatch(updateReplySed('arbeidsulykkeyrkessykdom.dato', value.trim()))
  }

  const setBrukerStatus = (value: string) => {
    dispatch(updateReplySed('arbeidsulykkeyrkessykdom.brukerStatus', value.trim()))
    if (value !== 'annet') {
      dispatch(updateReplySed('arbeidsulykkeyrkessykdom.brukerStatusAnnet', undefined))
    }
  }

  const setBrukerStatusAnnet = (value: string) => {
    dispatch(updateReplySed('arbeidsulykkeyrkessykdom.brukerStatusAnnet', value.trim() || undefined))
  }

  const setSykdomKode = (value: string) => {
    dispatch(updateReplySed('arbeidsulykkeyrkessykdom.sykdomKode', value.trim() || undefined))
  }

  const setSykdomKodingssystem = (value: string) => {
    dispatch(updateReplySed('arbeidsulykkeyrkessykdom.sykdomKodingssystem', value.trim() || undefined))
  }

  const setKonsekvensEllerBeskrivelse = (value: string) => {
    dispatch(updateReplySed('arbeidsulykkeyrkessykdom.konsekvensEllerBeskrivelse', value.trim() || undefined))
  }

  const setArbeidsgiverNavn = (value: string) => {
    dispatch(updateReplySed('arbeidsulykkeyrkessykdom.arbeidsgiver.navn', value.trim() || undefined))
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <Select
          data-testid={namespace + '-type'}
          error={validation[namespace + '-type']?.feilmelding}
          id={namespace + '-type'}
          label={t('label:denne-seden-gjelder')}
          menuPortalTarget={document.body}
          onChange={(o: unknown) => setType((o as Option).value)}
          options={awodTypeOptions}
          value={_.find(awodTypeOptions, o => o.value === sed.arbeidsulykkeyrkessykdom?.type)}
          defaultValue={_.find(awodTypeOptions, o => o.value === sed.arbeidsulykkeyrkessykdom?.type)}
        />

        <HStack>
          <DateField
            error={validation[namespace + '-dato']?.feilmelding}
            id='dato'
            namespace={namespace}
            label={t('label:dato-for-ulykken-sykdommen')}
            onChanged={setDato}
            dateValue={sed.arbeidsulykkeyrkessykdom?.dato}
          />
        </HStack>

        <Select
          data-testid={namespace + '-brukerStatus'}
          id={namespace + '-brukerStatus'}
          label={t('label:status-beroert-person')}
          menuPortalTarget={document.body}
          onChange={(o: unknown) => setBrukerStatus((o as Option).value)}
          options={brukerStatusOptions}
          value={_.find(brukerStatusOptions, o => o.value === sed.arbeidsulykkeyrkessykdom?.brukerStatus)}
          defaultValue={_.find(brukerStatusOptions, o => o.value === sed.arbeidsulykkeyrkessykdom?.brukerStatus)}
        />

        {sed.arbeidsulykkeyrkessykdom?.brukerStatus === 'annet' && (
          <TextArea
            error={validation[namespace + '-brukerStatusAnnet']?.feilmelding}
            namespace={namespace}
            id='brukerStatusAnnet'
            label={t('label:angi-status-annet')}
            maxLength={500}
            onChanged={setBrukerStatusAnnet}
            value={sed.arbeidsulykkeyrkessykdom?.brukerStatusAnnet}
          />
        )}

        <HStack gap="space-16">
          <Input
            error={validation[namespace + '-sykdomKode']?.feilmelding}
            namespace={namespace}
            id='sykdomKode'
            label={t('label:kode-arbeidsulykke-yrkessykdom')}
            onChanged={setSykdomKode}
            value={sed.arbeidsulykkeyrkessykdom?.sykdomKode}
          />
          <Input
            error={validation[namespace + '-sykdomKodingssystem']?.feilmelding}
            namespace={namespace}
            id='sykdomKodingssystem'
            label={t('label:kodingssystem')}
            onChanged={setSykdomKodingssystem}
            value={sed.arbeidsulykkeyrkessykdom?.sykdomKodingssystem}
          />
        </HStack>

        <TextArea
          error={validation[namespace + '-konsekvensEllerBeskrivelse']?.feilmelding}
          namespace={namespace}
          id='konsekvensEllerBeskrivelse'
          label={t('label:konsekvenser-eller-beskrivelse')}
          onChanged={setKonsekvensEllerBeskrivelse}
          value={sed.arbeidsulykkeyrkessykdom?.konsekvensEllerBeskrivelse}
        />

        <Input
          error={validation[namespace + '-arbeidsgiverNavn']?.feilmelding}
          namespace={namespace}
          id='arbeidsgiverNavn'
          label={t('label:arbeidsgiver-navn')}
          onChanged={setArbeidsgiverNavn}
          value={sed.arbeidsulykkeyrkessykdom?.arbeidsgiver?.navn}
        />
      </VStack>
    </Box>
  )
}

export default AWODSpoersmaal
