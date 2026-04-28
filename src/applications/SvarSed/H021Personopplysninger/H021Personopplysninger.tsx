import { Box, Heading, HGrid, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateH021Personopplysninger, ValidationH021PersonopplysningerProps } from 'applications/SvarSed/H021Personopplysninger/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import DateField from 'components/DateField/DateField'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { H021Sed } from 'declarations/h021'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const H021Personopplysninger: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-h021personopplysninger`
  const sed = replySed as H021Sed

  const kjoennOptions: Options = [
    { label: t('label:mann'), value: 'M' },
    { label: t('label:kvinne'), value: 'K' },
    { label: t('label:ukjent'), value: 'U' }
  ]

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationH021PersonopplysningerProps>(
      clonedvalidation, namespace, validateH021Personopplysninger, {
        replySed: (replySed as H021Sed),
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setPersonProp = (prop: string, value: string | undefined) => {
    dispatch(updateReplySed('bruker.personInfo.' + prop, value))
    if (validation[namespace + '-' + prop]) {
      dispatch(resetValidation(namespace + '-' + prop))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <HGrid columns={2} gap="space-16" align="start">
          <Input
            error={validation[namespace + '-etternavn']?.feilmelding}
            id='etternavn'
            label={t('label:etternavn')}
            namespace={namespace}
            onChanged={(value: string) => setPersonProp('etternavn', value.trim())}
            required
            value={sed.bruker?.personInfo?.etternavn || ''}
          />
          <Input
            error={validation[namespace + '-fornavn']?.feilmelding}
            id='fornavn'
            label={t('label:fornavn')}
            namespace={namespace}
            onChanged={(value: string) => setPersonProp('fornavn', value.trim())}
            required
            value={sed.bruker?.personInfo?.fornavn || ''}
          />
        </HGrid>

        <HGrid columns={2} gap="space-16" align="start">
          <DateField
            error={validation[namespace + '-foedselsdato']?.feilmelding}
            id='foedselsdato'
            namespace={namespace}
            label={t('label:fødselsdato')}
            onChanged={(value: string) => setPersonProp('foedselsdato', value.trim())}
            required
            dateValue={sed.bruker?.personInfo?.foedselsdato}
          />
          <Select
            data-testid={namespace + '-kjoenn'}
            error={validation[namespace + '-kjoenn']?.feilmelding}
            id={namespace + '-kjoenn'}
            label={t('label:kjønn')}
            menuPortalTarget={document.body}
            onChange={(o: unknown) => setPersonProp('kjoenn', (o as Option).value)}
            options={kjoennOptions}
            required
            value={_.find(kjoennOptions, o => o.value === sed.bruker?.personInfo?.kjoenn)}
            defaultValue={_.find(kjoennOptions, o => o.value === sed.bruker?.personInfo?.kjoenn)}
          />
        </HGrid>

        <HGrid columns={2} gap="space-16" align="start">
          <Input
            error={validation[namespace + '-pinKompetentLand']?.feilmelding}
            id='pinKompetentLand'
            label={t('label:pin-kompetent-land')}
            namespace={namespace}
            onChanged={(value: string) => setPersonProp('pinKompetentLand', value.trim())}
            required
            value={sed.bruker?.personInfo?.pinKompetentLand || ''}
          />
          <Input
            error={validation[namespace + '-pinOppholdLand']?.feilmelding}
            id='pinOppholdLand'
            label={t('label:pin-opphold-land')}
            namespace={namespace}
            onChanged={(value: string) => setPersonProp('pinOppholdLand', value.trim())}
            value={sed.bruker?.personInfo?.pinOppholdLand || ''}
          />
        </HGrid>

        <HGrid columns={2} gap="space-16" align="start">
          <Input
            error={validation[namespace + '-etternavnVedFoedsel']?.feilmelding}
            id='etternavnVedFoedsel'
            label={t('label:etternavn-ved-foedsel')}
            namespace={namespace}
            onChanged={(value: string) => setPersonProp('etternavnVedFoedsel', value.trim())}
            value={sed.bruker?.personInfo?.etternavnVedFoedsel || ''}
          />
          <Input
            error={validation[namespace + '-fornavnVedFoedsel']?.feilmelding}
            id='fornavnVedFoedsel'
            label={t('label:fornavn-ved-foedsel')}
            namespace={namespace}
            onChanged={(value: string) => setPersonProp('fornavnVedFoedsel', value.trim())}
            value={sed.bruker?.personInfo?.fornavnVedFoedsel || ''}
          />
        </HGrid>
      </VStack>
    </Box>
  )
}

export default H021Personopplysninger
