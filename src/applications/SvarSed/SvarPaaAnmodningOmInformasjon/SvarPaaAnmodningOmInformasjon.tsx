import {Validation} from "../../../declarations/types";
import {State} from "../../../declarations/reducers";
import React from "react";
import {MainFormProps} from "../MainForm";
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "../../../store";
import {F027Sed} from "../../../declarations/sed";
import {
  Row,
  Column,
  PaddedDiv,
  RadioPanelGroup,
  FlexRadioPanels,
  RadioPanel
} from "@navikt/hoykontrast";
import DateField from "../../../components/DateField/DateField";
import {resetValidation, setValidation} from "../../../actions/validation";
import useUnmount from "../../../hooks/useUnmount";
import _ from "lodash";
import performValidation from "../../../utils/performValidation";
import { validateKrav, ValidationKravProps } from "./validation";
import {Box, Checkbox, VStack} from "@navikt/ds-react";
import {setDeselectedFormaal} from "../../../actions/svarsed";

interface KravSelector {
  validation: Validation
}

const mapState = (state: State): KravSelector => ({
  validation: state.validation.status
})

const SvarPaaAnmodningOmInformasjon: React.FC<MainFormProps> = ({
 replySed,
 parentNamespace,
 updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: any = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const krav: any | undefined = (replySed as F027Sed)?.krav
  const erKravEllerSvarPaaKrav: string | undefined = (replySed as F027Sed)?.erKravEllerSvarPaaKrav
  const namespace: string = `${parentNamespace}-krav`

  const target = 'anmodningOmMerInformasjon.svar'
  const svarPaaAnmodningOmMerInformasjon: any | undefined = _.get(replySed, target)


  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationKravProps>(
      clonedvalidation, namespace, validateKrav, {
        krav: (replySed as F027Sed).krav
      }, true)


    dispatch(setValidation(clonedvalidation))
  })

  const setKravMottattDato = (kravDato: string) => {
    dispatch(updateReplySed('krav.kravMottattDato', kravDato.trim()))
    if (validation[namespace + '-kravMottattDato']) {
      dispatch(resetValidation(namespace + '-kravMottattDato'))
    }
  }

  const setKravEllerSvarPaaKrav = (krav: string) => {
    dispatch(updateReplySed('erKravEllerSvarPaaKrav', krav.trim()))
    if (validation[namespace + '-erKravEllerSvarPaaKrav']) {
      dispatch(resetValidation(namespace + '-erKravEllerSvarPaaKrav'))
    }
  }

  const setSvarPaaAnmodning = (item: string, checked: boolean) => {
    if(!checked){
      dispatch(setDeselectedFormaal(item))
    } else {
      dispatch(setDeselectedFormaal(undefined))
    }

    dispatch(updateReplySed(`${target}.${item}`, checked ? {} : undefined))
  }

  return (
    <>
      <PaddedDiv>
        <VStack gap="4">
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">
            <Row>
              <Column flex={1}>
                <DateField
                  error={validation[namespace + '-kravMottattDato']?.feilmelding}
                  namespace={namespace}
                  id='kravMottattDato'
                  label={t('label:dato-for-krav')}
                  onChanged={setKravMottattDato}
                  dateValue={krav?.kravMottattDato}
                />
              </Column>
              <Column flex={1.99}>
                <RadioPanelGroup
                  legend={t('label:krav-eller-svar-paa-krav')}
                  data-testid={namespace + '-krav-eller-svar-paa-krav'}
                  error={validation[namespace + '-krav-eller-svar-paa-krav']?.feilmelding}
                  id={namespace + '-krav-eller-svar-paa-krav'}
                  onChange={(e: string | number | boolean) => setKravEllerSvarPaaKrav(e as string)}
                  value={erKravEllerSvarPaaKrav}
                >
                  <FlexRadioPanels>
                    <RadioPanel value='01'>
                      {t('label:krav-eller-svar-paa-krav-nytt_krav')}
                    </RadioPanel>
                    <RadioPanel value='02'>
                      {t('label:krav-eller-svar-paa-krav-svar-paa-krav')}
                    </RadioPanel>
                  </FlexRadioPanels>
                </RadioPanelGroup>
              </Column>
            </Row>
          </Box>
          <Box padding="4" background="surface-subtle" borderWidth="1" borderColor="border-subtle">

              <Checkbox
                value="adopsjon"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvarPaaAnmodning("adopsjon", e.target.checked)}
                checked={!!svarPaaAnmodningOmMerInformasjon?.adopsjon}>
                Svar på forespørsel om adopsjon
              </Checkbox>
              <Checkbox
                value="inntekt"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvarPaaAnmodning("inntekt", e.target.checked)}
                checked={!!svarPaaAnmodningOmMerInformasjon?.inntekt}>
                Svar på anmodning om inntekt
              </Checkbox>
              <Checkbox
                value="ytelseTilForeldreloese"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvarPaaAnmodning("ytelseTilForeldreloese", e.target.checked)}
                checked={!!svarPaaAnmodningOmMerInformasjon?.ytelseTilForeldreloese}>
                Svar på anmodning om barnepensjon
              </Checkbox>
              <Checkbox
                value="annenInformasjonBarnet"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvarPaaAnmodning("annenInformasjonBarnet", e.target.checked)}
                checked={!!svarPaaAnmodningOmMerInformasjon?.annenInformasjonBarnet}>
                Svar på anmodning om annen informasjon angående barnet
              </Checkbox>
              <Checkbox
                value="utdanningsinstitusjon"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvarPaaAnmodning("utdanningsinstitusjon", e.target.checked)}
                checked={!!svarPaaAnmodningOmMerInformasjon?.utdanningsinstitusjon}>
                Svar om fremmøte på skole / høyskole / opplæring / arbeidsledighet
              </Checkbox>
              <Checkbox
                value="deltakelsePaaUtdanning"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvarPaaAnmodning("deltakelsePaaUtdanning", e.target.checked)}
                checked={!!svarPaaAnmodningOmMerInformasjon?.deltakelsePaaUtdanning}>
                Datoer for deltakelse på skole / høyskole / opplæring / arbeidsledighet
              </Checkbox>
          </Box>
        </VStack>
      </PaddedDiv>
    </>
  );
}

export default SvarPaaAnmodningOmInformasjon
