import {Box, Heading, VStack} from '@navikt/ds-react'
import React from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {TextAreaDiv} from "../../../components/StyledComponents";
import TextArea from "../../../components/Forms/TextArea";
import {useAppDispatch, useAppSelector} from "../../../store";
import {useTranslation} from "react-i18next";
import _ from "lodash";
import {State} from "../../../declarations/reducers";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {
  validateBarnetFritekst,
  ValidationBarnetFritekstProps,
} from "./validation";
import {setValidation} from "../../../actions/validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const BarnetFritekst: React.FC<MainFormProps> = ({
 label,
 parentNamespace,
 replySed,
 updateReplySed,
 options
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-ytelsetilforeldreloese-barnet-${options.fieldname}`
  const target = `anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.barnet.${options.fieldname}`
  const fritekst: string =  _.get(replySed, target)

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationBarnetFritekstProps>(clonedValidation, namespace, validateBarnetFritekst, {
      fritekst
    }, true)
    dispatch(setValidation(clonedValidation))
  })

  const setFritekst = (value: string) => {
    dispatch(updateReplySed(target, value.trim()))
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
          <TextAreaDiv>
            <TextArea
              error={validation[namespace + '-fritekst']?.feilmelding}
              namespace={namespace}
              id={'fritekst'}
              label={t('label:FRITEKST')}
              hideLabel={true}
              onChanged={(v) => setFritekst(v)}
              value={fritekst ?? ''}
            />
          </TextAreaDiv>
        </Box>
      </VStack>
    </Box>
  )
}

export default BarnetFritekst
