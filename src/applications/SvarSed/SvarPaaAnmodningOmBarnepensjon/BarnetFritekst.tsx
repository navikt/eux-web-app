import {Box, Heading, VStack} from '@navikt/ds-react'
import React from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
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
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>
        <Box padding="space-16" background="neutral-soft" borderWidth="1" borderColor="neutral-subtle">
          <TextArea
            error={validation[namespace + '-fritekst']?.feilmelding}
            namespace={namespace}
            id={'fritekst'}
            label={t('label:FRITEKST')}
            hideLabel={true}
            onChanged={(v) => setFritekst(v)}
            value={fritekst ?? ''}
          />
        </Box>
      </VStack>
    </Box>
  );
}

export default BarnetFritekst
