import {Box, HGrid, Heading, HStack, RadioGroup, VStack} from '@navikt/ds-react'
import RadioPanel from 'components/RadioPanel/RadioPanel'
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
import React, { useState, JSX } from 'react';
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const deriveGjelderArbeidsufoerhet = (sed: H120Sed): string => {
  if (sed.arbeidsufoer?.periodeStartdato || sed.arbeidsufoer?.periodeSluttdato) {
    return 'ja'
  }
  if (sed.arbeidsdyktig?.dekkesKostnader) {
    return 'nei'
  }
  return ''
}

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

  const [gjelderArbeidsufoerhet, setGjelderArbeidsufoerhetState] = useState<string>(
    () => deriveGjelderArbeidsufoerhet(sed)
  )

  const dekkesKostnaderOptions: Options = [
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
    setGjelderArbeidsufoerhetState(value)
    if (value === 'ja') {
      dispatch(updateReplySed('arbeidsdyktig', undefined))
    } else {
      dispatch(updateReplySed('arbeidsufoer', undefined))
    }
    if (validation[namespace + '-gjelderArbeidsufoerhet']) {
      dispatch(resetValidation(namespace + '-gjelderArbeidsufoerhet'))
    }
  }

  const setPeriodeStartdato = (value: string) => {
    dispatch(updateReplySed('arbeidsufoer.periodeStartdato', value.trim()))
    if (validation[namespace + '-startdato']) {
      dispatch(resetValidation(namespace + '-startdato'))
    }
  }

  const setPeriodeSluttdato = (value: string) => {
    dispatch(updateReplySed('arbeidsufoer.periodeSluttdato', value.trim()))
    if (validation[namespace + '-sluttdato']) {
      dispatch(resetValidation(namespace + '-sluttdato'))
    }
  }

  const setDekkesKostnader = (value: string) => {
    const target = gjelderArbeidsufoerhet === 'ja' ? 'arbeidsufoer.dekkesKostnader' : 'arbeidsdyktig.dekkesKostnader'
    dispatch(updateReplySed(target, value.trim()))
    if (validation[namespace + '-dekkesKostnader']) {
      dispatch(resetValidation(namespace + '-dekkesKostnader'))
    }
  }

  const currentDekkesKostnader = gjelderArbeidsufoerhet === 'ja'
    ? sed.arbeidsufoer?.dekkesKostnader
    : sed.arbeidsdyktig?.dekkesKostnader

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <RadioGroup
          value={gjelderArbeidsufoerhet}
          data-no-border
          data-testid={namespace + '-gjelderArbeidsufoerhet'}
          error={validation[namespace + '-gjelderArbeidsufoerhet']?.feilmelding}
          id={namespace + '-gjelderArbeidsufoerhet'}
          legend={t('label:anmodningen-gjelder-arbeidsufoerhet')}
          name={namespace + '-gjelderArbeidsufoerhet'}
          onChange={setGjelderArbeidsufoerhet}
        >
          <HStack gap="space-16">
            <RadioPanel value='ja'>
              {t('label:ja')}
            </RadioPanel>
            <RadioPanel value='nei'>
              {t('label:nei')}
            </RadioPanel>
          </HStack>
        </RadioGroup>

        {gjelderArbeidsufoerhet === 'ja' && (
          <HGrid columns={2} gap="space-16" align="start">
            <DateField
              error={validation[namespace + '-startdato']?.feilmelding}
              id='startdato'
              namespace={namespace}
              label={t('label:startdato-arbeidsufoerhet')}
              onChanged={setPeriodeStartdato}
              required
              dateValue={sed.arbeidsufoer?.periodeStartdato}
            />
            <DateField
              error={validation[namespace + '-sluttdato']?.feilmelding}
              id='sluttdato'
              namespace={namespace}
              label={t('label:sluttdato-arbeidsufoerhet')}
              onChanged={setPeriodeSluttdato}
              required
              dateValue={sed.arbeidsufoer?.periodeSluttdato}
            />
          </HGrid>
        )}

        {gjelderArbeidsufoerhet !== '' && (
          <Select
            data-testid={namespace + '-dekkesKostnader'}
            error={validation[namespace + '-dekkesKostnader']?.feilmelding}
            id={namespace + '-dekkesKostnader'}
            label={t('label:dekking-av-kostnader')}
            menuPortalTarget={document.body}
            onChange={(o: unknown) => setDekkesKostnader((o as Option).value)}
            options={dekkesKostnaderOptions}
            required
            value={_.find(dekkesKostnaderOptions, o => o.value === currentDekkesKostnader)}
            defaultValue={_.find(dekkesKostnaderOptions, o => o.value === currentDekkesKostnader)}
          />
        )}
      </VStack>
    </Box>
  )
}

export default AnmodningInfo
