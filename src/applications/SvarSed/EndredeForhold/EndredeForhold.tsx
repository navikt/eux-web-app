import {
  AlignStartRow,
  Column,
  FlexRadioPanels,
  PaddedDiv,
  RadioPanelGroup,
  RadioPanel,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { H001Sed, YtterligereInfoType } from 'declarations/sed'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const EndredeForhold: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
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
      <RadioPanelGroup
        legend=''
        data-testid={namespace + '-ytterligereInfoType'}
        key={namespace + '-ytterligereInfoType-' + (replySed as H001Sed).ytterligereInfoType}
        id={namespace + '-ytterligereInfoType'}
        error={validation[namespace + '-ytterligereInfoType']?.feilmelding}
        value={(replySed as H001Sed).ytterligereInfoType}
        onChange={(e: string | number | boolean) => setYtterligereInfoType(e as YtterligereInfoType)}
      >
        <FlexRadioPanels>
          <RadioPanel value='melding_om_mer_informasjon'>
            {t('el:option-ytterligere-1')}
          </RadioPanel>
          <RadioPanel value='anmodning_om_mer_informasjon'>
            {t('el:option-ytterligere-2')}
          </RadioPanel>
        </FlexRadioPanels>
      </RadioPanelGroup>
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