import { Box, Heading, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import { JaNei } from 'declarations/sed'
import { U010Sed } from 'declarations/u010'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateForespoerselOmOppfoelging, ValidationForespoerselOmOppfoelgingProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const ForespoerselOmOppfoelging: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-bruker-foresporselomoppfoelging`
  const sed = replySed as U010Sed

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationForespoerselOmOppfoelgingProps>(
      clonedValidation, namespace, validateForespoerselOmOppfoelging, { replySed: sed }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setOenskerOppfoelging = (value: JaNei) => {
    dispatch(updateReplySed('oenskerOppfoelging', value))
    if (validation[`${namespace}-oenskerOppfoelging`]) {
      dispatch(resetValidation(`${namespace}-oenskerOppfoelging`))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size="small">{label}</Heading>
        <RadioGroup
          value={sed.oenskerOppfoelging ?? ''}
          id={`${namespace}-oenskerOppfoelging`}
          legend={t('label:u010-oensker-oppfoelging')}
          error={validation[`${namespace}-oenskerOppfoelging`]?.feilmelding}
          onChange={(value: string) => setOenskerOppfoelging(value as JaNei)}
        >
          <Radio value="ja">{t('label:ja')}</Radio>
          <Radio value="nei">{t('label:nei')}</Radio>
        </RadioGroup>
      </VStack>
    </Box>
  )
}

export default ForespoerselOmOppfoelging
