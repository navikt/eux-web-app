import { Box, HGrid, Heading, HStack, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateAnmodningInfo, ValidationAnmodningInfoProps } from 'applications/SvarSed/AnmodningInfo/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import DateField from 'components/DateField/DateField'
import Select from 'components/Forms/Select'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { H120Sed } from 'declarations/h120'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import commonStyles from 'assets/css/common.module.css'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const AnmodningInfo: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-anmodninginfo`
  const sed = replySed as H120Sed

  const dekningKostnaderOptions: Options = [
    { label: t('el:option-h120-dekningkostnader-ja'), value: 'ja' },
    { label: t('el:option-h120-dekningkostnader-nei'), value: 'nei' },
    { label: t('el:option-h120-dekningkostnader-gjelder_ikke'), value: 'gjelder_ikke' }
  ]

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAnmodningInfoProps>(
      clonedvalidation, namespace, validateAnmodningInfo, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setGjelderArbeidsufoerhet = (value: string) => {
    const boolValue = value === 'ja'
    dispatch(updateReplySed('anmodningInfo.gjelderArbeidsufoerhet', boolValue))
    if (!boolValue) {
      dispatch(updateReplySed('anmodningInfo.periodeStartdato', undefined))
      dispatch(updateReplySed('anmodningInfo.periodeSluttdato', undefined))
    }
    if (validation[namespace + '-gjelderArbeidsufoerhet']) {
      dispatch(resetValidation(namespace + '-gjelderArbeidsufoerhet'))
    }
  }

  const setPeriodeStartdato = (value: string) => {
    dispatch(updateReplySed('anmodningInfo.periodeStartdato', value.trim()))
    if (validation[namespace + '-startdato']) {
      dispatch(resetValidation(namespace + '-startdato'))
    }
  }

  const setPeriodeSluttdato = (value: string) => {
    dispatch(updateReplySed('anmodningInfo.periodeSluttdato', value.trim()))
    if (validation[namespace + '-sluttdato']) {
      dispatch(resetValidation(namespace + '-sluttdato'))
    }
  }

  const setDekningKostnader = (value: string) => {
    dispatch(updateReplySed('anmodningInfo.dekningKostnader', value.trim()))
    if (validation[namespace + '-dekningKostnader']) {
      dispatch(resetValidation(namespace + '-dekningKostnader'))
    }
  }

  const gjelderArbeidsufoerhet = sed.anmodningInfo?.gjelderArbeidsufoerhet

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <RadioGroup
          value={gjelderArbeidsufoerhet === true ? 'ja' : gjelderArbeidsufoerhet === false ? 'nei' : ''}
          data-no-border
          data-testid={namespace + '-gjelderArbeidsufoerhet'}
          error={validation[namespace + '-gjelderArbeidsufoerhet']?.feilmelding}
          id={namespace + '-gjelderArbeidsufoerhet'}
          legend={t('label:anmodningen-gjelder-arbeidsufoerhet')}
          name={namespace + '-gjelderArbeidsufoerhet'}
          onChange={setGjelderArbeidsufoerhet}
        >
          <HStack gap="space-16">
            <Radio className={commonStyles.radioPanel} value='ja'>
              {t('label:ja')}
            </Radio>
            <Radio className={commonStyles.radioPanel} value='nei'>
              {t('label:nei')}
            </Radio>
          </HStack>
        </RadioGroup>

        {gjelderArbeidsufoerhet === true && (
          <HGrid columns={2} gap="space-16" align="start">
            <DateField
              error={validation[namespace + '-startdato']?.feilmelding}
              id='startdato'
              namespace={namespace}
              label={t('label:startdato-arbeidsufoerhet')}
              onChanged={setPeriodeStartdato}
              required
              dateValue={sed.anmodningInfo?.periodeStartdato}
            />
            <DateField
              error={validation[namespace + '-sluttdato']?.feilmelding}
              id='sluttdato'
              namespace={namespace}
              label={t('label:sluttdato-arbeidsufoerhet')}
              onChanged={setPeriodeSluttdato}
              required
              dateValue={sed.anmodningInfo?.periodeSluttdato}
            />
          </HGrid>
        )}

        <Select
          data-testid={namespace + '-dekningKostnader'}
          error={validation[namespace + '-dekningKostnader']?.feilmelding}
          id={namespace + '-dekningKostnader'}
          label={t('label:dekking-av-kostnader')}
          menuPortalTarget={document.body}
          onChange={(o: unknown) => setDekningKostnader((o as Option).value)}
          options={dekningKostnaderOptions}
          required
          value={_.find(dekningKostnaderOptions, o => o.value === sed.anmodningInfo?.dekningKostnader)}
          defaultValue={_.find(dekningKostnaderOptions, o => o.value === sed.anmodningInfo?.dekningKostnader)}
        />
      </VStack>
    </Box>
  )
}

export default AnmodningInfo
