import {Heading} from '@navikt/ds-react'
import {AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv} from '@navikt/hoykontrast'
import { resetValidation, setValidation } from 'actions/validation'
import { validateCoverLetter, ValidationCoverLetterProps } from 'applications/PDU1/CoverLetter/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'

import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import styled from "styled-components";

export const TextAreaNoWidth = styled(TextArea)`
  .navds-textarea__wrapper {
    width: auto !important;
  }
`

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const CoverLetter: React.FC<MainFormProps> = ({
  parentNamespace,
  replySed,
  updateReplySed
} :MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'info'
  const info: string | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-coverletter`

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationCoverLetterProps>(
      clonedvalidation, namespace, validateCoverLetter, {
        info
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setInfo = (newInfo: string) => {
    dispatch(updateReplySed(`${target}`, newInfo.trim()))
    if (validation[namespace + 'info']) {
      dispatch(resetValidation(namespace + '-info'))
    }
  }

  return (
    <PaddedDiv key={namespace + '-div'}>
      <Heading size='medium'>
        {t('label:cover-letter')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <TextAreaNoWidth
            style={{ minHeight: '140px'}}
            cols={80}
            maxLength={0}
            error={validation[namespace + '-info']?.feilmelding}
            id='info'
            label={t('label:informasjon')}
            namespace={namespace}
            onChanged={setInfo}
            value={info}
          />
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default CoverLetter
