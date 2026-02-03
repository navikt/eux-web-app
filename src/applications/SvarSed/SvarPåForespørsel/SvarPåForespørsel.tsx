import { Box, Heading, HGrid, Label, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import {
  validateSvarPåForespørsel,
  ValidationSvarPåForespørselProps
} from 'applications/SvarSed/SvarPåForespørsel/validation'
import commonStyles from 'assets/css/common.module.css'
import TextArea from 'components/Forms/TextArea'
import { State } from 'declarations/reducers'
import { H002Sed, H002Svar, HSvarType } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const SvarPåForespørsel: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  setReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationSvarPåForespørselProps>(
      clonedValidation, namespace, validateSvarPåForespørsel, {
        replySed,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const doWeHavePositive: boolean = !_.isEmpty((replySed as H002Sed)?.positivtSvar?.informasjon) ||
    !_.isEmpty((replySed as H002Sed)?.positivtSvar?.dokument) ||
    !_.isEmpty((replySed as H002Sed)?.positivtSvar?.sed)

  const doWeHaveNegative: boolean = !_.isEmpty((replySed as H002Sed)?.negativtSvar?.informasjon) ||
    !_.isEmpty((replySed as H002Sed)?.negativtSvar?.dokument) ||
    !_.isEmpty((replySed as H002Sed)?.negativtSvar?.sed) ||
    !_.isEmpty((replySed as H002Sed)?.negativtSvar?.grunn)

  const [_svar, _setSvar] = useState<HSvarType | undefined>(() =>
    doWeHavePositive
      ? 'positivt'
      : doWeHaveNegative
        ? 'negativt'
        : undefined
  )

  const syncWithReplySed = (needle: string, value: any) => {
    const svarChanged: boolean = needle === 'svar'
    const thisSvar = svarChanged ? value : _svar
    if (thisSvar === 'positivt') {
      const newPositivtSvar: H002Svar = {
        informasjon: (svarChanged ? (replySed as H002Sed)?.negativtSvar?.informasjon : (replySed as H002Sed)?.positivtSvar?.informasjon) ?? '',
        dokument: (svarChanged ? (replySed as H002Sed)?.negativtSvar?.dokument : (replySed as H002Sed)?.positivtSvar?.dokument) ?? '',
        sed: (svarChanged ? (replySed as H002Sed)?.negativtSvar?.sed : (replySed as H002Sed)?.positivtSvar?.sed) ?? ''
      }
      if (!svarChanged) {
        // @ts-ignore
        newPositivtSvar[needle] = value
      }

      const newReplySed: H002Sed = {
        ...(replySed as H002Sed),
        positivtSvar: newPositivtSvar
      }

      delete (newReplySed as H002Sed).negativtSvar
      dispatch(setReplySed!(newReplySed))
    } else {
      const newNegativtSvar = {
        informasjon: svarChanged ? (replySed as H002Sed)?.positivtSvar?.informasjon ?? '' : (replySed as H002Sed)?.negativtSvar?.informasjon ?? '',
        dokument: svarChanged ? (replySed as H002Sed)?.positivtSvar?.dokument ?? '' : (replySed as H002Sed)?.negativtSvar?.dokument ?? '',
        sed: svarChanged ? (replySed as H002Sed)?.positivtSvar?.sed ?? '' : (replySed as H002Sed)?.negativtSvar?.sed ?? ''
      }
      if (!svarChanged) {
        // @ts-ignore
        newNegativtSvar[needle] = value
      }

      const newReplySed: H002Sed = {
        ...(replySed as H002Sed),
        negativtSvar: newNegativtSvar
      }
      delete (newReplySed as H002Sed).positivtSvar
      dispatch(setReplySed!(newReplySed))
    }
  }

  const namespace = `${parentNamespace}-${personID}-svarpåforespørsel`

  const setSvar = (newSvar: HSvarType) => {
    _setSvar(newSvar)
    syncWithReplySed('svar', newSvar)
    if (validation[namespace + '-svar']) {
      dispatch(resetValidation(namespace + '-svar'))
    }
  }

  const setDokument = (newDokument: string) => {
    syncWithReplySed('dokument', newDokument.trim())
    if (validation[namespace + '-dokument']) {
      dispatch(resetValidation(namespace + '-dokument'))
    }
  }

  const setInformasjon = (newInformasjon: string) => {
    syncWithReplySed('informasjon', newInformasjon.trim())
    if (validation[namespace + '-informasjon']) {
      dispatch(resetValidation(namespace + '-informasjon'))
    }
  }

  const setSed = (newSed: string) => {
    syncWithReplySed('sed', newSed.trim())
    if (validation[namespace + '-sed']) {
      dispatch(resetValidation(namespace + '-sed'))
    }
  }

  const setGrunn = (newGrunn: string) => {
    syncWithReplySed('grunn', newGrunn.trim())
    if (validation[namespace + '-grunn']) {
      dispatch(resetValidation(namespace + '-grunn'))
    }
  }

  const data = _svar === 'positivt' ? (replySed as H002Sed)?.positivtSvar : (replySed as H002Sed)?.negativtSvar

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <div>
          <Label>
            {t('label:choose')}
          </Label>
          <RadioGroup
            value={_svar}
            data-testid={namespace + '-svar'}
            error={validation[namespace + '-svar']?.feilmelding}
            id={namespace + '-svar'}
            legend={t('label:choose')}
            hideLegend
            onChange={(e: string) => {
              if (e !== _svar) {
                setSvar(e as HSvarType)
              }
            }}
          >
            <HGrid columns={2} gap="4" align="start">
              <Radio className={commonStyles.radioPanel} description={t('message:help-jeg-kan-sende')} value='positivt'>
                {t('el:option-svar-1')}
              </Radio>
              <Radio className={commonStyles.radioPanel} description={t('message:help-jeg-kan-ikke-sende')} value='negativt'>
                {t('el:option-svar-2')}
              </Radio>
            </HGrid>
          </RadioGroup>
        </div>

        {!_.isNil(_svar) && (
          <>
            <TextArea
              maxLength={255}
              error={validation[namespace + '-dokument']?.feilmelding}
              namespace={namespace}
              id='dokument'
              label={t('label:vi-vedlegger-dokumenter')}
              onChanged={setDokument}
              value={data?.dokument ?? ''}
            />
            <TextArea
              maxLength={500}
              error={validation[namespace + '-informasjon']?.feilmelding}
              namespace={namespace}
              id='informasjon'
              label={t('label:vi-sender-informasjon')}
              onChanged={setInformasjon}
              value={data?.informasjon ?? ''}
            />
           <TextArea
              maxLength={65}
              error={validation[namespace + '-sed']?.feilmelding}
              namespace={namespace}
              id='sed'
              label={t('label:sed')}
              onChanged={setSed}
              value={data?.sed ?? ''}
            />
          </>
        )}

        {_svar === 'negativt' && (
          <TextArea
            maxLength={500}
            error={validation[namespace + '-grunn']?.feilmelding}
            namespace={namespace}
            id='grunn'
            label={t('label:grunn')}
            onChanged={setGrunn}
            value={data?.grunn ?? ''}
          />
        )}
      </VStack>
    </Box>
  )
}

export default SvarPåForespørsel
