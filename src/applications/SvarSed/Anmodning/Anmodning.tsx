import {Box, Heading, VStack} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateAnmodning, ValidationAnmodningProps } from 'applications/SvarSed/Anmodning/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { State } from 'declarations/reducers'
import { H001Svar, ReplySed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Anmodning: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-anmodning`
  const target = 'anmodning'
  const anmodning: H001Svar | undefined = _.get(replySed, target)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAnmodningProps>(
      clonedvalidation, namespace, validateAnmodning, {
        replySed: (replySed as ReplySed),
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setDokument = (newDokument: string) => {
    dispatch(updateReplySed(`${target}.dokumentasjon.dokument`, newDokument.trim()))
    if (validation[namespace + '-dokument']) {
      dispatch(resetValidation(namespace + '-dokument'))
    }
  }

  const setInformasjon = (newInformasjon: string) => {
    dispatch(updateReplySed(`${target}.dokumentasjon.informasjon`, newInformasjon.trim()))
    if (validation[namespace + '-informasjon']) {
      dispatch(resetValidation(namespace + '-informasjon'))
    }
  }

  const setSed = (newSed: string) => {
    dispatch(updateReplySed(`${target}.dokumentasjon.sed`, newSed.trim()))
    if (validation[namespace + '-sed']) {
      dispatch(resetValidation(namespace + '-sed'))
    }
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <TextArea
          maxLength={255}
          error={validation[namespace + '-dokument']?.feilmelding}
          namespace={namespace}
          id='dokument'
          label={t('label:vennligst-send-oss-folgende-dokumenter')}
          onChanged={setDokument}
          value={anmodning?.dokumentasjon?.dokument ?? ''}
        />
        <TextArea
          maxLength={(replySed as ReplySed)?.sedType === 'H001' ? 255 : 500}
          error={validation[namespace + '-informasjon']?.feilmelding}
          namespace={namespace}
          id='informasjon'
          label={t('label:vennligst-send-oss-folgende-informasjon')}
          onChanged={setInformasjon}
          value={anmodning?.dokumentasjon?.informasjon ?? ''}
        />
        <TextArea
          maxLength={65}
          error={validation[namespace + '-sed']?.feilmelding}
          namespace={namespace}
          id='sed'
          label={t('label:vennligst-send-oss-folgende-sed-er')}
          onChanged={setSed}
          value={anmodning?.dokumentasjon?.sed ?? ''}
        />
      </VStack>
    </Box>
  )
}

export default Anmodning
