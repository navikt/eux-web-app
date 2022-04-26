import { Heading } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const CoverLetter: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
} :TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'info'
  const info: string | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-coverletter`

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
          <TextAreaDiv>
            <TextArea
              style={{ minHeight: '140px' }}
              error={validation[namespace + '-info']?.feilmelding}
              key={namespace + '-info-' + info}
              id='info'
              label={t('label:informasjon')}
              namespace={namespace}
              onChanged={setInfo}
              value={info}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default CoverLetter
