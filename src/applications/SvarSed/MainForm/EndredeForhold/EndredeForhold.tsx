import { Heading, Radio, RadioGroup } from '@navikt/ds-react'
import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { H001Sed, YtterligereInfoType } from 'declarations/sed'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const EndredeForhold: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}:TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    validation
  } = useSelector<State, TwoLevelFormSelector>(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-${personID}-endredeforhold`

  const setYtterligereInfoType = (newYtterligereInfoType: YtterligereInfoType) => {
    dispatch(updateReplySed('ytterligereInfoType', newYtterligereInfoType))
    if (validation[namespace + '-ytterligereInfoType']) {
      dispatch(resetValidation(namespace + '-ytterligereInfoType'))
    }
  }

  const setYtterligereInfo = (newYtterligereInfo: string) => {
    dispatch(updateReplySed('ytterligereInfo', newYtterligereInfo))
    if (validation[namespace + '-ytterligereInfo']) {
      dispatch(resetValidation(namespace + '-ytterligereiInfo'))
    }
  }

  return (
    <PaddedDiv>
      <AlignStartRow>
        <Column>
          <Heading size='small'>
            {t('label:ytterligere-informasjon_endrede_forhold')}
          </Heading>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <RadioGroup
        legend=''
        data-testid={namespace + '-ytterligereInfoType'}
        key={namespace + '-ytterligereInfoType-' + (replySed as H001Sed).ytterligereInfoType}
        id={namespace + '-ytterligereInfoType'}
        error={validation[namespace + '-ytterligereInfoType']?.feilmelding}
        value={(replySed as H001Sed).ytterligereInfoType}
        onChange={(e: string | number | boolean) => setYtterligereInfoType(e as YtterligereInfoType)}
      >
        <Radio value='melding_om_mer_informasjon'>
          {t('el:option-ytterligere-1')}
        </Radio>
        <Radio value='anmodning_om_mer_informasjon'>
          {t('el:option-ytterligere-2')}
        </Radio>
      </RadioGroup>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <TextAreaDiv>
            <TextArea
              namespace={namespace}
              error={validation[namespace + '-ytterligereInfo']?.feilmelding}
              id='ytterligereInfo'
              label={t('label:ytterligere-informasjon-til-sed')}
              onChanged={setYtterligereInfo}
              value={(replySed as H001Sed).ytterligereInfo ?? ''}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
    </PaddedDiv>
  )
}

export default EndredeForhold