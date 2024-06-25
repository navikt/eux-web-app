import {State} from "../../../declarations/reducers";
import {MainFormProps, MainFormSelector} from "../MainForm";
import React from "react";
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "../../../store";
import {FamilieRelasjon, JaNei, Periode, ForelderType} from "../../../declarations/sed";
import _ from "lodash";
import {
  AlignStartRow,
  Column,
  FlexRadioPanels,
  PaddedDiv, RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from "@navikt/hoykontrast";
import {Heading} from "@navikt/ds-react";
import PeriodeInput from "../../../components/Forms/PeriodeInput";
import Select from "../../../components/Forms/Select";
import {Option, Options} from "../../../declarations/app";
import Input from "../../../components/Forms/Input";
import {resetValidation, setValidation} from "../../../actions/validation";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {validateFamilierelasjon, ValidationFamilierelasjonProps} from "./validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const familieRelasjonF003: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const {t} = useTranslation()
  const {validation} = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target: string = `${personID}.familierelasjon`
  const familieRelasjon: FamilieRelasjon | undefined = _.get(replySed, target)
  const namespace: string = `${parentNamespace}-${personID}-familierelasjonf003`

  const forelderTypeOptions: Options = [
    { label: t('el:placeholder-select-default'), value: '' },
    { label: t('el:option-familierelasjon-skilt'), value: 'skilt' },
    { label: t('el:option-familierelasjon-aleneforelder'), value: 'aleneforelder' },
    { label: t('el:option-familierelasjon-annet'), value: 'annet' }
  ]

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationFamilierelasjonProps>(
      clonedValidation, namespace, validateFamilierelasjon, {
        familierelasjon: familieRelasjon,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })


  const setForelderType = (forelderType: ForelderType) => {
    dispatch(updateReplySed(`${target}.forelderType`, forelderType))
    if (validation[namespace + '-forelderType']) {
      dispatch(resetValidation(namespace + '-forelderType'))
    }
  }

  const setPeriode = (periode: Periode) => {
    dispatch(updateReplySed(`${target}.periode`, periode))
  }

  const setAnnenRelasjonType = (annenRelasjonType: string) => {
    dispatch(updateReplySed(`${target}.annenRelasjonType`, annenRelasjonType))
    if (validation[namespace + '-annenRelasjonType']) {
      dispatch(resetValidation(namespace + '-annenRelasjonType'))
    }
  }

  const setAnnenRelasjonPersonNavn = (annenRelasjonPersonNavn: string) => {
    dispatch(updateReplySed(`${target}.annenRelasjonPersonNavn`, annenRelasjonPersonNavn))
    if (validation[namespace + '-annenRelasjonPersonNavn']) {
      dispatch(resetValidation(namespace + '-annenRelasjonPersonNavn'))
    }
  }

  const setBorSammen = (borSammen: JaNei) => {
    dispatch(updateReplySed(`${target}.borSammen`, borSammen))
    if (validation[namespace + '-borSammen']) {
      dispatch(resetValidation(namespace + '-borSammen'))
    }
  }

  return(
    <>
      <PaddedDiv>
        <Heading size='small'>
          {label}
        </Heading>
      </PaddedDiv>
      <PaddedDiv>
        <AlignStartRow>
          <PeriodeInput
            namespace={namespace + '-periode'}
            error={{
              startdato: validation[namespace + '-periode-startdato']?.feilmelding,
              sluttdato: validation[namespace + '-periode-sluttdato']?.feilmelding
            }}
            hideLabel={false}
            requiredStartDato={true}
            setPeriode={(p: Periode) => setPeriode(p)}
            value={familieRelasjon?.periode}
          />
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Select
              data-testid={namespace + '-forelderType'}
              error={validation[namespace + '-forelderType']?.feilmelding}
              id={namespace + '-forelderType'}
              label={t('label:type')}
              menuPortalTarget={document.body}
              onChange={(e: unknown) => setForelderType((e as Option).value as ForelderType)}
              options={forelderTypeOptions}
              required
              defaultValue={_.find(forelderTypeOptions, r => r.value === familieRelasjon?.forelderType)}
              value={_.find(forelderTypeOptions, r => r.value === familieRelasjon?.forelderType)}
            />
          </Column>
          {familieRelasjon?.forelderType === 'annet'
            ? (
              <Column>
                <Input
                  error={validation[namespace + '-annenRelasjonType']?.feilmelding}
                  namespace={namespace}
                  id='annenRelasjonType'
                  label={t('label:annen-relasjon')}
                  onChanged={(value: string) => setAnnenRelasjonType(value)}
                  value={familieRelasjon?.annenRelasjonType}
                />
              </Column>
            )
            : (<Column />)}
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-annenRelasjonPersonNavn']?.feilmelding}
              namespace={namespace}
              id='annenRelasjonPersonNavn'
              label={t('label:person-navn')}
              onChanged={(value: string) => setAnnenRelasjonPersonNavn(value)}
              value={familieRelasjon?.annenRelasjonPersonNavn}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            <RadioPanelGroup
              value={familieRelasjon?.borSammen}
              data-testid={namespace + '-borSammen'}
              data-no-border
              id={namespace + '-borSammen'}
              error={validation[namespace + '-borSammen']?.feilmelding}
              legend={t('label:bor-sammen')}
              name={namespace + '-borSammen'}
              onChange={(e: string) => setBorSammen(e as JaNei)}
            >
              <FlexRadioPanels>
                <RadioPanel value='ja'>{t('label:ja')}</RadioPanel>
                <RadioPanel value='nei'>{t('label:nei')}</RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
          </Column>
        </AlignStartRow>
      </PaddedDiv>
    </>
  )
}

export default familieRelasjonF003

