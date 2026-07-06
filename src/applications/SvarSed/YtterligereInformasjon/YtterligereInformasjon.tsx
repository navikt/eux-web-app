import { Box, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { H070Sed } from 'declarations/h070'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateYtterligereInformasjon, ValidationYtterligereInformasjonProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const YtterligereInformasjon: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-ytterligereinformasjon`
  const sed = replySed as H070Sed

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationYtterligereInformasjonProps>(
      clonedvalidation, namespace, validateYtterligereInformasjon, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setYtterligereInfo = (newInfo: string) => {
    dispatch(updateReplySed('ytterligereInfo', newInfo.trim() ? newInfo.trim() : undefined))
    if (validation[namespace + '-ytterligereInfo']) {
      dispatch(resetValidation(namespace + '-ytterligereInfo'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>
        <TextArea
          error={validation[namespace + '-ytterligereInfo']?.feilmelding}
          namespace={namespace}
          id='ytterligereInfo'
          label=''
          maxLength={500}
          onChanged={setYtterligereInfo}
          value={sed.ytterligereInfo ?? ''}
        />
      </VStack>
    </Box>
  )
}

export default YtterligereInformasjon
