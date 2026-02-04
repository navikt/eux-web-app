import { Box, Heading, HStack, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateEndredeForhold, ValidationEndredeForholdProps } from 'applications/SvarSed/EndredeForhold/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { State } from 'declarations/reducers'
import { H001Sed, ReplySed, YtterligereInfoType } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import commonStyles from 'assets/css/common.module.css'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const EndredeForhold: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-endredeforhold`

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationEndredeForholdProps>(
      clonedValidation, namespace, validateEndredeForhold, {
        replySed: (replySed as ReplySed),
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setYtterligereInfoType = (newYtterligereInfoType: YtterligereInfoType) => {
    dispatch(updateReplySed('ytterligereInfoType', newYtterligereInfoType.trim()))
    if (validation[namespace + '-ytterligereInfoType']) {
      dispatch(resetValidation(namespace + '-ytterligereInfoType'))
    }
  }

  const setYtterligereInfo = (newYtterligereInfo: string) => {
    dispatch(updateReplySed('ytterligereInfo', newYtterligereInfo.trim()))
    if (validation[namespace + '-ytterligereInfo']) {
      dispatch(resetValidation(namespace + '-ytterligereiInfo'))
    }
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <RadioGroup
          legend=''
          data-testid={namespace + '-ytterligereInfoType'}
          id={namespace + '-ytterligereInfoType'}
          error={validation[namespace + '-ytterligereInfoType']?.feilmelding}
          value={(replySed as H001Sed).ytterligereInfoType}
          onChange={(e: string | number | boolean) => setYtterligereInfoType(e as YtterligereInfoType)}
        >
          <HStack gap="4">
            <Radio className={commonStyles.radioPanel} value='melding_om_mer_informasjon'>
              {t('el:option-ytterligere-1')}
            </Radio>
            <Radio className={commonStyles.radioPanel} value='anmodning_om_mer_informasjon'>
              {t('el:option-ytterligere-2')}
            </Radio>
          </HStack>
        </RadioGroup>
        <TextArea
          namespace={namespace}
          error={validation[namespace + '-ytterligereInfo']?.feilmelding}
          id='ytterligereInfo'
          label={t('label:ytterligere-informasjon-til-sed')}
          onChanged={setYtterligereInfo}
          value={(replySed as H001Sed).ytterligereInfo ?? ''}
        />
      </VStack>
    </Box>
  )
}

export default EndredeForhold
