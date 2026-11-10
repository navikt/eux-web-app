import { Box, Heading, RadioGroup, Textarea, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import InstitutionSelector from 'components/InstitutionSelector/InstitutionSelector'
import RadioPanel from 'components/RadioPanel/RadioPanel'
import { State } from 'declarations/reducers'
import { CountryCodes, Institusjon as IRInstitusjon } from 'declarations/types'
import { LeggTilInstitusjon as LeggTilInstitusjonType, X005Sed } from 'declarations/x005'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getLandkodeFromInstitusjonsId } from 'utils/institusjon'
import performValidation from 'utils/performValidation'
import { validateLeggTilInstitusjon, ValidationLeggTilInstitusjonProps } from './validation'

interface LeggTilInstitusjonSelector {
  validation: State['validation']['status']
  countryCodes: CountryCodes | null | undefined
  cdmVersjonApp: string | undefined
}

const mapState = (state: State): LeggTilInstitusjonSelector => ({
  validation: state.validation.status,
  countryCodes: state.app.countryCodes,
  cdmVersjonApp: state.app.cdmVersjon
})

const LeggTilInstitusjon: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation, countryCodes, cdmVersjonApp } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-leggtilinstitusjon`
  const sed = replySed as X005Sed
  const bucType = sed.sak?.sakType
  const leggTilInstitusjon: LeggTilInstitusjonType | undefined = sed.leggTilInstitusjon
  const cdmVersjon: string | undefined = sed.sak?.cdmVersjon ?? cdmVersjonApp
  const landkode: string | undefined = leggTilInstitusjon?.__landkode ??
    getLandkodeFromInstitusjonsId(leggTilInstitusjon?.institusjonId, countryCodes, cdmVersjon)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationLeggTilInstitusjonProps>(
      clonedValidation, namespace, validateLeggTilInstitusjon, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  // Only institusjonId, institusjonNavn and __landkode change; grunnType/grunnAnnet are kept
  const updateInstitusjon = (institusjon: IRInstitusjon | undefined, newLandkode: string | undefined) => {
    dispatch(updateReplySed('leggTilInstitusjon', {
      ...leggTilInstitusjon,
      institusjonId: institusjon?.institusjonsID ?? '',
      institusjonNavn: institusjon?.navn ?? '',
      __landkode: newLandkode
    }))
    dispatch(resetValidation(namespace + '-institusjon'))
  }

  const setGrunnType = (grunnType: string) => {
    dispatch(updateReplySed('leggTilInstitusjon.grunnType', grunnType.trim()))
    if (grunnType !== 'annet') {
      dispatch(updateReplySed('leggTilInstitusjon.grunnAnnet', ''))
    }
    if (validation[namespace + '-grunnType']) {
      dispatch(resetValidation(namespace + '-grunnType'))
    }
  }

  const setGrunnAnnet = (grunnAnnet: string) => {
    dispatch(updateReplySed('leggTilInstitusjon.grunnAnnet', grunnAnnet))
    if (validation[namespace + '-grunnAnnet']) {
      dispatch(resetValidation(namespace + '-grunnAnnet'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <InstitutionSelector
          namespace={namespace}
          id='institusjon'
          bucType={bucType}
          landkode={landkode}
          value={leggTilInstitusjon?.institusjonId || undefined}
          valueNavn={leggTilInstitusjon?.institusjonNavn}
          error={validation[namespace + '-institusjon-id']?.feilmelding}
          required
          onLandkodeChanged={(newLandkode: string) => updateInstitusjon(undefined, newLandkode)}
          onInstitutionSelected={(institusjon: IRInstitusjon | undefined) => updateInstitusjon(institusjon, landkode)}
        />

        <RadioGroup
          value={sed.leggTilInstitusjon?.grunnType ?? ''}
          data-testid={namespace + '-grunnType'}
          error={validation[namespace + '-grunnType']?.feilmelding}
          id={namespace + '-grunnType'}
          legend={t('label:leggtilinstitusjon-grunn')}
          onChange={setGrunnType}
        >
          <VStack gap="space-4">
            <RadioPanel value='personen_arbeider_eller_har_arbeidet_i_dette_landet'>{t('el:option-leggtilinstitusjon-grunn-01')}</RadioPanel>
            <RadioPanel value='en_annen_institusjon_er_kompetent_institusjon_i_saken'>{t('el:option-leggtilinstitusjon-grunn-02')}</RadioPanel>
            <RadioPanel value='annet'>{t('el:option-leggtilinstitusjon-grunn-99')}</RadioPanel>
          </VStack>
        </RadioGroup>

        {sed.leggTilInstitusjon?.grunnType === 'annet' && (
          <Textarea
            error={validation[namespace + '-grunnAnnet']?.feilmelding}
            id={namespace + '-grunnAnnet'}
            label={t('label:leggtilinstitusjon-grunn-annet')}
            maxLength={255}
            resize
            value={sed.leggTilInstitusjon?.grunnAnnet ?? ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGrunnAnnet(e.target.value)}
          />
        )}
      </VStack>
    </Box>
  )
}

export default LeggTilInstitusjon
