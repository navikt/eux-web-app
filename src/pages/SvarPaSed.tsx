import { clientClear } from "actions/alert";
import Arbeidsforhold from "components/Arbeidsforhold/Arbeidsforhold";
import Inntekt from "components/Inntekt/Inntekt";
import PersonSearch from "components/PersonSearch/PersonSearch";
import {
  Container,
  Content,
  Margin,
  VerticalSeparatorDiv,
} from "components/StyledComponents";
import TopContainer from "components/TopContainer/TopContainer";
import * as types from "constants/actionTypes";
import { State } from "declarations/reducers";
import Alertstripe from "nav-frontend-alertstriper";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { Knapp } from "nav-frontend-knapper";
import { Input, Select } from "nav-frontend-skjema";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as svarpasedActions from "actions/svarpased";
import styled from "styled-components";
import { FamilieRelasjon, Inntekter, Inntekt as IInntekt, Validation } from 'declarations/types'
import Family from "components/Family/Family";
import { SvarpasedState } from "reducers/svarpased";
import _ from "lodash";
import { Item } from "tabell";

const SaksnummerDiv = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
`;
const SaksnummerInput = styled(Input)`
  margin-right: 1rem;
`;

const SedSelect = styled(Select)`
  width: 25%;
`;

const mapState = (state: State): any => ({
  alertStatus: state.alert.clientErrorStatus,
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,
  gettingPerson: state.loading.gettingPerson,

  person: state.svarpased.person,
  personRelatert: state.svarpased.personRelatert,
  familierelasjonKodeverk: state.sak.familierelasjoner,
  valgteFamilieRelasjoner: state.svarpased.familierelasjoner,
  arbeidsforhold: state.svarpased.arbeidsforhold,
  valgteArbeidsforhold: state.svarpased.valgteArbeidsforhold,
  inntekter: state.svarpased.inntekter,
  selectedInntekter: state.svarpased.selectedInntekter,
  gettingSaksnummer: state.loading.gettingSaksnummer,
  saksnummer: state.svarpased.saksnummer,
  sed: state.svarpased.sed,
  svarPasedData: state.svarpased.svarPasedData,
});

export interface SvarPaSedProps {
  location: any;
}

const SvarPaSed: React.FC<SvarPaSedProps> = ({
  location,
}: SvarPaSedProps): JSX.Element => {
  const [_saksnummer, setSaksnummer] = useState<string | undefined>(undefined);
  const [validation, setValidation] = useState<{ [k: string]: any }>({});
  const [, setIsFnrValid] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [fnr, setFnr] = useState<string>("");
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    alertStatus,
    alertMessage,
    alertType,
    arbeidsforhold,
    gettingPerson,
    inntekter,
    selectedInntekter,
    person,
    personRelatert,
    saksnummer,
    familierelasjonKodeverk,
    valgteArbeidsforhold,
    valgteFamilieRelasjoner,
    svarPasedData,
  }: any = useSelector<State, any>(mapState);
  const data: SvarpasedState = useSelector<State, SvarpasedState>(
    (state) => state.svarpased
  );

  const onSaksnummerClick = () => {
    dispatch(svarpasedActions.getSaksnummer(_saksnummer));
  };

  const validate = (): Validation => {
    const validation: Validation = {
      saksnummer: saksnummer ? null : "No saksnummer",
      //fnr: !valgtFnr ? t('ui:validation-noFnr') : !isFnrValid ? t('ui:validation-uncheckedFnr') : null,
      //sektor: !valgtSektor ? t('ui:validation-noSektor') : null,
      //buctype: !valgtBucType ? t('ui:validation-noBuctype') : null,
      //sedtype: !valgtSedType ? t('ui:validation-noSedtype') : null,
      //landkode: !valgtLandkode ? t('ui:validation-noLand') : null,
      //institusjon: !valgtInstitusjon ? t('ui:validation-noInstitusjonsID') : null,
      //tema: !valgtTema ? t('ui:validation-noTema') : null,
      //saksId: !valgtSaksId ? t('ui:validation-noSaksId') : null,
      //unit: visEnheter && !valgtUnit ? t('ui:validation-noUnit') : null
    };
    setValidation(validation);
    return validation;
  };

  const resetAllValidation = () => {
    setValidation({});
  };

  const resetValidation = (key: Array<string> | string): void => {
    const newValidation = _.cloneDeep(validation);
    if (_.isString(key)) {
      newValidation[key] = null;
    }
    if (_.isArray(key)) {
      key.forEach((k) => {
        newValidation[k] = null;
      });
    }
    setValidation(newValidation);
  };

  const isValid = (_validation: Validation): boolean => {
    return _.find(_.values(_validation), (e) => e !== null) === undefined;
  };

  const sendData = (): void => {
    console.log("Hopp Hopp", validate());
    console.log("selectedInntekter", selectedInntekter);
    dispatch(svarpasedActions.sendSvarPaSedData(data));
    if (isValid(validate())) {
      console.log("Happ Happ" + validate());
      console.log("selectedInntekter", selectedInntekter);
      dispatch(svarpasedActions.sendSvarPaSedData(data));
    }
    console.log("selectedInntekter", selectedInntekter);
  };

  const onSedChange = (e: any) => {
    //resetValidation([]);
    dispatch(svarpasedActions.getSed(e.target.value));
  };

  const addTpsRelation = (relation: FamilieRelasjon): void => {
    /* Person fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
    dispatch(
      svarpasedActions.addFamilierelasjoner({
        ...relation,
        nasjonalitet: "NO",
      })
    );
  };

  const deleteRelation = (relation: FamilieRelasjon): void => {
    dispatch(svarpasedActions.removeFamilierelasjoner(relation));
  };

  const onSelectedInntekt = (items: Array<Item>) => {
    const inntekter: Inntekter = items.map(item => ({
      beloep: item.beloep,
      fraDato: item.fraDato,
      tilDato: item.tilDato,
      type: item.type
    } as IInntekt))
    console.log("onSelectedInntekt selectedInntekter", selectedInntekter);
    console.log("onSelectedInntekt items", inntekter);
    if (items) dispatch(svarpasedActions.sendSeletedInntekt(inntekter));
  };

  useEffect(() => {
    if (!mounted) {
      const params: URLSearchParams = new URLSearchParams(location.search);
      const rinasaksnummerParam = params.get("rinasaksnummer");
      const fnrParam = params.get("fnr");
      if (rinasaksnummerParam) {
        setSaksnummer(rinasaksnummerParam);
        dispatch(svarpasedActions.getSaksnummer(rinasaksnummerParam));
      }
      if (fnrParam) {
        setFnr(fnrParam);
        dispatch(svarpasedActions.getPerson(fnrParam));
        dispatch(svarpasedActions.getArbeidsforhold(fnrParam));
      }
      setMounted(true);
    }
  }, [dispatch, mounted, location.search]);

  return (
    <TopContainer>
      <Container>
        <Margin />
        <Content>
          <SaksnummerDiv>
            <SaksnummerInput
              label="Saksnummer"
              bredde="M"
              value={_saksnummer}
              feil={validation.saksnummer}
              onChange={(e: any) => {
                setSaksnummer(e.target.value);
                resetValidation("saksnummer");
              }}
            />
            <Knapp onClick={onSaksnummerClick}>Hent</Knapp>
          </SaksnummerDiv>
          <VerticalSeparatorDiv />
          <PersonSearch
            alertStatus={alertStatus}
            alertMessage={alertMessage}
            alertType={alertType}
            initialFnr={fnr}
            person={person}
            gettingPerson={gettingPerson}
            className="slideAnimate"
            validation={validation}
            resetAllValidation={resetAllValidation}
            onFnrChange={() => setIsFnrValid(false)}
            onPersonFound={() => setIsFnrValid(true)}
            onSearchPerformed={(_fnr) => {
              dispatch(svarpasedActions.getPerson(_fnr));
            }}
            onPersonRemoved={() => {}}
            onAlertClose={() => dispatch(clientClear())}
          />
          {saksnummer && (
            <SedSelect label={"Velg svar SED"} onChange={onSedChange}>
              <option key="">-</option>
              {saksnummer?.map((s: any) => {
                return <option key={s.value}>{s.label}</option>;
              })}
            </SedSelect>
          )}
          <VerticalSeparatorDiv />
          {!_.isNil(person) && (
            <>
              <Ekspanderbartpanel tittel={t("ui:label-familyRelationships")}>
                <Family
                  alertStatus={alertStatus}
                  alertMessage={alertMessage}
                  alertType={alertType}
                  familierelasjonKodeverk={familierelasjonKodeverk}
                  personRelatert={personRelatert}
                  person={person}
                  valgteFamilieRelasjoner={valgteFamilieRelasjoner}
                  onClickAddRelasjons={(value: any) => addTpsRelation(value)}
                  onClickRemoveRelasjons={(value: any) => deleteRelation(value)}
                  onResetPersonRelatert={() =>
                    dispatch(svarpasedActions.resetPersonRelatert())
                  }
                  onAddFailure={() =>
                    dispatch({ type: types.SVARPASED_TPSPERSON_ADD_FAILURE })
                  }
                  onAddSuccess={(e: any) => {
                    dispatch(svarpasedActions.addFamilierelasjoner(e));
                    dispatch({ type: types.SVARPASED_TPSPERSON_ADD_SUCCESS });
                  }}
                  onAlertClose={() => dispatch(clientClear())}
                  onSearchFnr={(sok) => {
                    dispatch(svarpasedActions.resetPersonRelatert());
                    dispatch(svarpasedActions.getPersonRelated(sok));
                  }}
                />
              </Ekspanderbartpanel>
              <VerticalSeparatorDiv />
              <Ekspanderbartpanel tittel={t("ui:label-arbeidsforhold")}>
                <Arbeidsforhold
                  getArbeidsforhold={() => {
                    dispatch(svarpasedActions.getArbeidsforhold(person?.fnr));
                  }}
                  valgteArbeidsforhold={valgteArbeidsforhold}
                  arbeidsforhold={arbeidsforhold}
                  onArbeidsforholdClick={(item: any, checked: boolean) =>
                    dispatch(
                      checked
                        ? svarpasedActions.addArbeidsforhold(item)
                        : svarpasedActions.removeArbeidsforhold(item)
                    )
                  }
                />
              </Ekspanderbartpanel>
              <VerticalSeparatorDiv />
              <Ekspanderbartpanel tittel={t("ui:label-inntekt")}>
                <Inntekt
                  fnr={person.fnr}
                  inntekter={inntekter}
                  onSelectedInntekt={onSelectedInntekt}
                />
              </Ekspanderbartpanel>
            </>
          )}
          <VerticalSeparatorDiv />
          {person && <Knapp onClick={sendData}>Send Data</Knapp>}
          {!_.isNil(svarPasedData) && (
            <Alertstripe type="suksess">{svarPasedData.message}</Alertstripe>
          )}
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  );
};

export default SvarPaSed;
