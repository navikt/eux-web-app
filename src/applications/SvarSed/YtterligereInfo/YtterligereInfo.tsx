import { Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import {resetValidation, setValidation} from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
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
    <PaddedDiv>
      <Heading size='small'>
        {label}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-ytterligereInfo']?.feilmelding}
              namespace={namespace}
              id='ytterligereInfo'
              label=""
              onChanged={setYtterligeInfo}
              value={ytterligereInfo}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
    </PaddedDiv>
  )
}

export default YtterligereInfo
