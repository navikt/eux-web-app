import {Box, Heading, VStack} from '@navikt/ds-react'
import {resetValidation, setValidation} from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import {validateYtterligereInfo, ValidationYtterligereInfoProps} from "./validation";
import {ReplySed} from "../../../declarations/sed";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const YtterligereInfo: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-ytterligereInfo`
  const target = `${personID}.ytterligereInfo`
  const ytterligereInfo: string | undefined = _.get(replySed, target)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationYtterligereInfoProps>(
      clonedvalidation, namespace, validateYtterligereInfo, {
        replySed: (replySed as ReplySed),
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setYtterligeInfo = (newInfo: string) => {
    dispatch(updateReplySed(`${target}`, newInfo.trim()))
    if (validation[namespace]) {
      dispatch(resetValidation(namespace))
    }
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <TextArea
          error={validation[namespace + '-ytterligereInfo']?.feilmelding}
          namespace={namespace}
          id='ytterligereInfo'
          label=""
          onChanged={setYtterligeInfo}
          value={ytterligereInfo}
        />
      </VStack>
    </Box>
  );
}

export default YtterligereInfo
