import {Box, Heading, HStack, RadioGroup, VStack} from '@navikt/ds-react'
import RadioPanel from 'components/RadioPanel/RadioPanel'
import { resetValidation, setValidation } from 'actions/validation'
import {
  validateYtterligereInfoBruker,
  ValidationYtterligereInfoBrukerProps
} from 'applications/SvarSed/YtterligereInfoBruker/validation'
import { toYtterligereInfoType } from 'applications/SvarSed/YtterligereInfoBruker/ytterligereInfoType'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { H001Sed } from 'declarations/h001'
import { H002Sed } from 'declarations/h002'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react';
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const YtterligereInfoBruker: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  options
}:MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-ytterligereinfobruker`
  const target = 'bruker'
  const bruker = (replySed as H001Sed | H002Sed).bruker
  const showYtterligereInfoType: boolean = options?.showYtterligereInfoType ?? false

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationYtterligereInfoBrukerProps>(
      clonedValidation, namespace, validateYtterligereInfoBruker, {
        replySed: (replySed as ReplySed),
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setYtterligereInfoType = (newYtterligereInfoType: string) => {
    dispatch(updateReplySed(`${target}.ytterligereInfoType`, toYtterligereInfoType(newYtterligereInfoType.trim())))
    if (validation[namespace + '-ytterligereInfoType']) {
      dispatch(resetValidation(namespace + '-ytterligereInfoType'))
    }
  }

  const setYtterligereInfo = (newYtterligereInfo: string) => {
    dispatch(updateReplySed(`${target}.ytterligereInfo`, newYtterligereInfo.trim()))
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
        {showYtterligereInfoType && (
          <RadioGroup
            legend=''
            data-testid={namespace + '-ytterligereInfoType'}
            id={namespace + '-ytterligereInfoType'}
            error={validation[namespace + '-ytterligereInfoType']?.feilmelding}
            value={toYtterligereInfoType((bruker as H001Sed['bruker'])?.ytterligereInfoType)}
            onChange={(e: string | number | boolean) => setYtterligereInfoType(e as string)}
          >
            <HStack gap="space-16">
              <RadioPanel value='melding_om_mer_informasjon'>
                {t('el:option-ytterligere-1')}
              </RadioPanel>
              <RadioPanel value='anmodning_om_tilleggsinformasjon'>
                {t('el:option-ytterligere-2')}
              </RadioPanel>
            </HStack>
          </RadioGroup>
        )}
        <TextArea
          namespace={namespace}
          error={validation[namespace + '-ytterligereInfo']?.feilmelding}
          id='ytterligereInfo'
          label={t('label:ytterligere-informasjon-til-sed')}
          onChanged={setYtterligereInfo}
          value={bruker?.ytterligereInfo ?? ''}
          maxLength={500}
        />
      </VStack>
    </Box>
  )
}

export default YtterligereInfoBruker
