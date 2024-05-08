import {Validation} from "../../../declarations/types";
import {State} from "../../../declarations/reducers";
import React from "react";
import {MainFormProps} from "../MainForm";
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "../../../store";
import {F003Sed,} from "../../../declarations/sed";
import {Row, Column, PaddedDiv, RadioPanelGroup, FlexRadioPanels, RadioPanel} from "@navikt/hoykontrast";
import DateField from "../../../components/DateField/DateField";
import {resetValidation, setValidation} from "../../../actions/validation";
import useUnmount from "../../../hooks/useUnmount";
import _ from "lodash";
import performValidation from "../../../utils/performValidation";
import { validateKrav, ValidationKravProps } from "./validation";

interface MottakAvSoknadSelector {
  validation: Validation
}

const mapState = (state: State): MottakAvSoknadSelector => ({
  validation: state.validation.status
})

const MottakAvSoknad: React.FC<MainFormProps> = ({
 replySed,
 parentNamespace,
 updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: any = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const krav: any | undefined = (replySed as F003Sed)?.krav
  const namespace: string = `${parentNamespace}-krav`


  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationKravProps>(
      clonedvalidation, namespace, validateKrav, {
        krav: (replySed as F003Sed).krav
      }, true)


    dispatch(setValidation(clonedvalidation))
  })

  const setKravMottattDato = (kravDato: string) => {
    dispatch(updateReplySed('krav.kravMottattDato', kravDato.trim()))
    if (validation[namespace + '-kravMottattDato']) {
      dispatch(resetValidation(namespace + '-kravMottattDato'))
    }
  }
  const setKravType = (krav: string) => {
    dispatch(updateReplySed('krav.kravType', krav.trim()))
    if (validation[namespace + '-kravType']) {
      dispatch(resetValidation(namespace + '-kravType'))
    }
  }

  return (
    <>
      <PaddedDiv>
        <Row>
          <Column flex={1}>
            <DateField
              error={validation[namespace + '-kravMottattDato']?.feilmelding}
              namespace={namespace}
              id='kravMottattDato'
              label={t('label:mottaksdato')}
              onChanged={setKravMottattDato}
              dateValue={krav?.kravMottattDato}
            />
          </Column>
          <Column flex={1.99}>
              <RadioPanelGroup
                legend={t('label:type-krav')}
                data-testid={namespace + '-typeKrav'}
                error={validation[namespace + '-typeKrav']?.feilmelding}
                id={namespace + '-kravType'}
                onChange={(e: string | number | boolean) => setKravType(e as string)}
                value={krav?.kravType}
              >
                <FlexRadioPanels>
                  <RadioPanel value='nytt_krav'>
                    {t('label:kravType-nytt_krav')}
                  </RadioPanel>
                  <RadioPanel value='endrede_omstendigheter'>
                    {t('label:kravType-endrede_omstendigheter')}
                  </RadioPanel>
                </FlexRadioPanels>
              </RadioPanelGroup>
          </Column>
        </Row>
      </PaddedDiv>
    </>
  )
}

export default MottakAvSoknad
