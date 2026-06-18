import { Box, Heading, RadioGroup, Select, Textarea, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import RadioPanel from 'components/RadioPanel/RadioPanel'
import { State } from 'declarations/reducers'
import { Motpart } from 'declarations/types'
import { X006Sed } from 'declarations/x006'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateFjernInstitusjon, ValidationFjernInstitusjonProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const FjernInstitusjon: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-fjerninstitusjon`
  const sed = replySed as X006Sed
  const motparter: Array<Motpart> = sed.sak?.motparter ?? []

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationFjernInstitusjonProps>(
      clonedValidation, namespace, validateFjernInstitusjon, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const onInstitusjonChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const id = event.target.value
    const motpart = _.find(motparter, (m: Motpart) => m.motpartId === id)
    dispatch(updateReplySed('fjernInstitusjon.institusjonId', id))
    dispatch(updateReplySed('fjernInstitusjon.institusjonNavn', motpart?.motpartNavn ?? ''))
    if (validation[namespace + '-institusjon']) {
      dispatch(resetValidation(namespace + '-institusjon'))
    }
  }

  const setGrunnType = (grunnType: string) => {
    dispatch(updateReplySed('fjernInstitusjon.grunnType', grunnType.trim()))
    if (grunnType !== 'annet') {
      dispatch(updateReplySed('fjernInstitusjon.grunnAnnet', ''))
    }
    if (validation[namespace + '-grunnType']) {
      dispatch(resetValidation(namespace + '-grunnType'))
    }
  }

  const setGrunnAnnet = (grunnAnnet: string) => {
    dispatch(updateReplySed('fjernInstitusjon.grunnAnnet', grunnAnnet))
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

        <Select
          data-testid={namespace + '-institusjon'}
          error={validation[namespace + '-institusjon']?.feilmelding}
          id={namespace + '-institusjon'}
          label={t('label:institusjon')}
          onChange={onInstitusjonChange}
          value={sed.fjernInstitusjon?.institusjonId ?? ''}
        >
          <option value=''>{t('label:velg')}</option>
          {_.orderBy(motparter, 'motpartNavn').map((m: Motpart) => (
            <option value={m.motpartId} key={m.motpartId}>
              {m.formatertNavn ?? m.motpartNavn}
            </option>
          ))}
        </Select>

        <RadioGroup
          value={sed.fjernInstitusjon?.grunnType ?? ''}
          data-testid={namespace + '-grunnType'}
          error={validation[namespace + '-grunnType']?.feilmelding}
          id={namespace + '-grunnType'}
          legend={t('label:fjerninstitusjon-grunn')}
          onChange={setGrunnType}
        >
          <VStack gap="space-4">
            <RadioPanel value='personen_arbeider_ikke_eller_har_ikke_arbeidet_i_dette_landet'>{t('el:option-fjerninstitusjon-grunn-01')}</RadioPanel>
            <RadioPanel value='en_annen_institusjon_er_ikke_kompetent_til_å_behandle_denne_saken'>{t('el:option-fjerninstitusjon-grunn-02')}</RadioPanel>
            <RadioPanel value='annet'>{t('el:option-fjerninstitusjon-grunn-99')}</RadioPanel>
          </VStack>
        </RadioGroup>

        {sed.fjernInstitusjon?.grunnType === 'annet' && (
          <Textarea
            error={validation[namespace + '-grunnAnnet']?.feilmelding}
            id={namespace + '-grunnAnnet'}
            label={t('label:fjerninstitusjon-grunn-annet')}
            maxLength={255}
            resize
            value={sed.fjernInstitusjon?.grunnAnnet ?? ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGrunnAnnet(e.target.value)}
          />
        )}
      </VStack>
    </Box>
  )
}

export default FjernInstitusjon
