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
import {setDeselectedMenu} from "../../../actions/svarsed";
import ErrorLabel from "../../../components/Forms/ErrorLabel";

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
    dispatch(resetValidation(parentNamespace + '-' + item))

    if(!checked){
      dispatch(setDeselectedMenu(item))
    } else {
      dispatch(setDeselectedMenu(undefined))
    }

    if(item === "utdanning"){
      dispatch(updateReplySed(`${target}.utdanning`, checked ? {} : undefined))
      dispatch(updateReplySed(`${target}.deltakelsePaaUtdanning`, checked ? [] : undefined))
    } else {
      dispatch(updateReplySed(`${target}.${item}`, checked ? {} : undefined))
    }
  }

  return (
    <>
      <Box padding="4">
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
                    <RadioPanel value='krav'>
                      {t('label:krav-eller-svar-paa-krav-nytt_krav')}
                    </RadioPanel>
                    <RadioPanel value='svar_paa_krav'>
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
                checked={!!svarPaaAnmodningOmMerInformasjon?.adopsjon}
              >
                {t('label:svar-på-anmodning-om-adopsjon') }
                <br/><ErrorLabel error={validation[parentNamespace + '-adopsjon-content']?.feilmelding}/>
              </Checkbox>
              <Checkbox
                value="inntekt"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvarPaaAnmodning("inntekt", e.target.checked)}
                checked={!!svarPaaAnmodningOmMerInformasjon?.inntekt}
              >
                {t('label:svar-på-anmodning-om-inntekt')}
                <br/><ErrorLabel error={validation[parentNamespace + '-inntekt-content']?.feilmelding}/>
              </Checkbox>
              <Checkbox
                value="ytelseTilForeldreloese"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvarPaaAnmodning("ytelseTilForeldreloese", e.target.checked)}
                checked={!!svarPaaAnmodningOmMerInformasjon?.ytelseTilForeldreloese}
              >
                {t('label:svar-på-anmodning-om-barnepensjon')}
                <br/><ErrorLabel error={validation[parentNamespace + '-ytelsetilforeldreloese-content']?.feilmelding}/>
              </Checkbox>
              <Checkbox
                value="annenInformasjonBarnet"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvarPaaAnmodning("annenInformasjonBarnet", e.target.checked)}
                checked={!!svarPaaAnmodningOmMerInformasjon?.annenInformasjonBarnet}
              >
                {t('label:svar-på-anmodning-om-annen-informasjon-om-barnet')}
                <br/><ErrorLabel error={validation[parentNamespace + '-anneninformasjonbarnet-content']?.feilmelding}/>
              </Checkbox>
              <Checkbox
                value="utdanning"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSvarPaaAnmodning("utdanning", e.target.checked)}
                checked={!!svarPaaAnmodningOmMerInformasjon?.utdanning || !!svarPaaAnmodningOmMerInformasjon?.deltakelsePaaUtdanning}>
                {t('label:svar-om-fremmøte-skole-høyskole-opplæring-arbeidsledighet')}
                <br/><ErrorLabel error={validation[parentNamespace + '-utdanning-content']?.feilmelding}/>
              </Checkbox>
          </Box>
        </VStack>
      </Box>
    </>
  );
}

export default SvarPaaAnmodningOmInformasjon
