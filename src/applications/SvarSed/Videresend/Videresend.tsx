import { Box, Heading, RadioGroup, Textarea, TextField, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import InstitutionSelector from 'components/InstitutionSelector/InstitutionSelector'
import RadioPanel from 'components/RadioPanel/RadioPanel'
import { State } from 'declarations/reducers'
import { Institusjon, NavInstitusjon } from 'declarations/types'
import { X007Sed } from 'declarations/x007'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useEffect, JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateVideresend, ValidationVideresendProps } from './validation'

const MOTTAKER_LANDKODE = 'NOR'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Videresend: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-videresend`
  const sed = replySed as X007Sed
  const bucType = sed.sak?.sakType
  const navinstitusjon: NavInstitusjon | undefined = sed.sak?.navinstitusjon
  const avsenderNavn = sed.videresend?.fjernInstitusjonNavn ??
    (navinstitusjon ? `${navinstitusjon.id} - ${navinstitusjon.navn}` : '')

  useEffect(() => {
    if (navinstitusjon && _.isEmpty(sed.videresend?.fjernInstitusjonId)) {
      dispatch(updateReplySed('videresend.fjernInstitusjonId', navinstitusjon.id))
      dispatch(updateReplySed('videresend.fjernInstitusjonNavn', `${navinstitusjon.id} - ${navinstitusjon.navn}`))
    }
  }, [])

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationVideresendProps>(
      clonedValidation, namespace, validateVideresend, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const onLeggTilInstitusjonChange = (institusjon: Institusjon | undefined): void => {
    dispatch(updateReplySed('videresend.leggTilInstitusjonId', institusjon?.institusjonsID ?? ''))
    dispatch(updateReplySed('videresend.leggTilInstitusjonNavn', institusjon?.navn ?? ''))
    if (validation[namespace + '-leggTilInstitusjon-id']) {
      dispatch(resetValidation(namespace + '-leggTilInstitusjon'))
    }
  }

  const setGrunnType = (grunnType: string) => {
    dispatch(updateReplySed('videresend.grunnType', grunnType.trim()))
    if (grunnType !== 'annet') {
      dispatch(updateReplySed('videresend.grunnAnnet', ''))
    }
    if (validation[namespace + '-grunnType']) {
      dispatch(resetValidation(namespace + '-grunnType'))
    }
  }

  const setGrunnAnnet = (grunnAnnet: string) => {
    dispatch(updateReplySed('videresend.grunnAnnet', grunnAnnet))
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

        <Heading size='xsmall'>
          {t('label:videresend-leggtilinstitusjon')}
        </Heading>

        {/* Recipient is restricted to Norwegian institutions */}
        <InstitutionSelector
          namespace={namespace}
          id='leggTilInstitusjon'
          bucType={bucType}
          landkode={MOTTAKER_LANDKODE}
          hideCountrySelector
          value={sed.videresend?.leggTilInstitusjonId || undefined}
          valueNavn={sed.videresend?.leggTilInstitusjonNavn}
          error={validation[namespace + '-leggTilInstitusjon-id']?.feilmelding}
          onLandkodeChanged={() => {}}
          onInstitutionSelected={onLeggTilInstitusjonChange}
        />

        <Heading size='xsmall'>
          {t('label:videresend-fjerninstitusjon')}
        </Heading>

        <TextField
          data-testid={namespace + '-fjernInstitusjon'}
          id={namespace + '-fjernInstitusjon'}
          label={t('label:institusjon')}
          readOnly
          value={avsenderNavn}
        />

        <RadioGroup
          value={sed.videresend?.grunnType ?? ''}
          data-testid={namespace + '-grunnType'}
          error={validation[namespace + '-grunnType']?.feilmelding}
          id={namespace + '-grunnType'}
          legend={t('label:videresend-grunn')}
          onChange={setGrunnType}
        >
          <VStack gap="space-4">
            <RadioPanel value='institusjonen_er_ikke_kompetent_institusjon_i_saken'>{t('el:option-videresend-grunn-01')}</RadioPanel>
            <RadioPanel value='institusjonen_er_ikke_lenger_kompetent_institusjon_i_saken'>{t('el:option-videresend-grunn-02')}</RadioPanel>
            <RadioPanel value='annet'>{t('el:option-videresend-grunn-99')}</RadioPanel>
          </VStack>
        </RadioGroup>

        {sed.videresend?.grunnType === 'annet' && (
          <Textarea
            error={validation[namespace + '-grunnAnnet']?.feilmelding}
            id={namespace + '-grunnAnnet'}
            label={t('label:videresend-grunn-annet')}
            maxLength={255}
            resize
            value={sed.videresend?.grunnAnnet ?? ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGrunnAnnet(e.target.value)}
          />
        )}
      </VStack>
    </Box>
  )
}

export default Videresend
