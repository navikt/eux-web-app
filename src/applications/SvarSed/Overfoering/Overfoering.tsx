import { Box, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateOverfoering, ValidationOverfoeringProps } from 'applications/SvarSed/Overfoering/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { State } from 'declarations/reducers'
import { H065Overfoering, H065Sed, ReplySed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Overfoering: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-overfoering`
  const target = 'overfoering'
  const overfoering: H065Overfoering | undefined = _.get(replySed, target)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationOverfoeringProps>(
      clonedValidation, namespace, validateOverfoering, {
        replySed: (replySed as ReplySed),
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setKrav = (newKrav: string) => {
    dispatch(updateReplySed(`${target}.krav`, newKrav.trim()))
    if (validation[namespace + '-krav']) {
      dispatch(resetValidation(namespace + '-krav'))
    }
  }

  const setDokument = (newDokument: string) => {
    dispatch(updateReplySed(`${target}.dokument`, newDokument.trim()))
    if (validation[namespace + '-dokument']) {
      dispatch(resetValidation(namespace + '-dokument'))
    }
  }

  const setInformasjon = (newInformasjon: string) => {
    dispatch(updateReplySed(`${target}.informasjon`, newInformasjon.trim()))
    if (validation[namespace + '-informasjon']) {
      dispatch(resetValidation(namespace + '-informasjon'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>
        <TextArea
          maxLength={500}
          error={validation[namespace + '-krav']?.feilmelding}
          namespace={namespace}
          id='krav'
          label={t('label:overfoering-krav')}
          onChanged={setKrav}
          value={overfoering?.krav ?? ''}
        />
        <TextArea
          maxLength={500}
          error={validation[namespace + '-dokument']?.feilmelding}
          namespace={namespace}
          id='dokument'
          label={t('label:overfoering-dokument')}
          onChanged={setDokument}
          value={overfoering?.dokument ?? ''}
        />
        <TextArea
          maxLength={500}
          error={validation[namespace + '-informasjon']?.feilmelding}
          namespace={namespace}
          id='informasjon'
          label={t('label:overfoering-informasjon')}
          onChanged={setInformasjon}
          value={overfoering?.informasjon ?? ''}
        />
      </VStack>
    </Box>
  )
}

export default Overfoering
