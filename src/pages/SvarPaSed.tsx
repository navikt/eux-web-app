import { clientClear } from "actions/alert";
import PersonSearch from "components/PersonSearch/PersonSearch";
import { Container, Content, Margin } from "components/StyledComponents";
import TopContainer from "components/TopContainer/TopContainer";
import * as types from "constants/actionTypes";
import { State } from "declarations/reducers";
import Alertstripe from "nav-frontend-alertstriper";
import { Knapp } from "nav-frontend-knapper";
import { Input, Select } from "nav-frontend-skjema";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as svarpasedActions from "actions/svarpased";
import styled from "styled-components";
import { FamilieRelasjon, Validation } from "declarations/types";
import Family from "components/Family/Family";
import { SvarpasedState } from "reducers/svarpased";
import _ from "lodash";

const SaksnummerDiv = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
`;
const SaksnummerInput = styled(Input)`
  margin-right: 1rem;
`;

const SetSelect = styled(Select)`
  margin-right: 1rem;
`;

const mapState = (state: State): any => ({
  alertStatus: state.alert.clientErrorStatus,
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,
  gettingPerson: state.loading.gettingPerson,

  person: state.svarpased.person,
  personRelatert: state.svarpased.personRelatert,
  // familierelasjonKodeverk: state.svarpased.
  familierelasjonKodeverk: state.sak.familierelasjoner,
  valgteFamilieRelasjoner: state.svarpased.familierelasjoner,

  gettingSaksnummer: state.loading.gettingSaksnummer,
  saksnummer: state.svarpased.saksnummer,
  sed: state.svarpased.sed,
  svarPasedData: state.svarpased.svarPasedData,
});

const SvarPaSed: React.FC = (): JSX.Element => {
  const [_saksnummer, setSaksnummer] = useState(undefined);
  const [validation, setValidation] = useState<{ [k: string]: any }>({});
  const [, setIsFnrValid] = useState<boolean>(false);
  // const [_sed, setSed] = useState(undefined);
  const dispatch = useDispatch();

  const {
    alertStatus,
    alertMessage,
    alertType,
    gettingPerson,
    person,
    personRelatert,
    gettingSaksnummer,
    saksnummer,
    familierelasjonKodeverk,
    sed,
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
    console.log("Hopp Hopp" + validate());
    if (isValid(validate())) {
      console.log("Happ Happ" + validate());
      dispatch(svarpasedActions.sendSvarPaSedData(data));
    }
  };

  const onSetChange = (e: any) => {
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

  console.log("gettingSaksnummer: ", gettingSaksnummer);
  return (
    <TopContainer className="p-svarpased">
      <Container>
        <Margin />
        <Content>
          <SaksnummerDiv>
            <SaksnummerInput
              label="saksnummer"
              bredde="M"
              feil={validation.saksnummer}
              onChange={(e: any) => {
                setSaksnummer(e.target.value);
                resetValidation("saksnummer");
              }}
            />
            <Knapp onClick={onSaksnummerClick}>Hent</Knapp>
          </SaksnummerDiv>

          <PersonSearch
            alertStatus={alertStatus}
            alertMessage={alertMessage}
            alertType={alertType}
            initialFnr=""
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
          {person !== undefined && person !== null && (
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
          )}
          {saksnummer !== undefined && saksnummer !== null && (
            <SetSelect onChange={onSetChange}>
              {saksnummer?.map((s: any) => {
                return <option key={s.sed}>{s.sed}</option>;
              })}
            </SetSelect>
          )}

          {saksnummer === null && <Alertstripe type="feil">Fail</Alertstripe>}
          {JSON.stringify(saksnummer)}
          {JSON.stringify(sed)}
          {JSON.stringify(person)}
          <Knapp onClick={() => sendData()}>Send Data</Knapp>
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
