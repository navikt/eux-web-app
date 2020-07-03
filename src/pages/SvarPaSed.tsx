import { clientClear } from "actions/alert";
import PersonSearch from "components/PersonSearch/PersonSearch";
import TopContainer from "components/TopContainer/TopContainer";
import * as types from 'constants/actionTypes'
import { State } from "declarations/reducers";
import React, { useState } from "react";
import Ui from "eessi-pensjon-ui";
import { useDispatch, useSelector } from "react-redux";
import * as svarpasedActions from "actions/svarpased";
import styled from "styled-components";
import { FamilieRelasjon } from "declarations/types";
import Family from "components/Family/Family";

const SaksnummerDiv = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
`;
const SaksnummerInput = styled(Ui.Nav.Input)`
  margin-right: 1rem;
`;

const SetSelect = styled(Ui.Nav.Select)`
  margin-right: 1rem;
`;

const mapState = (state: State): any => ({
  alertStatus: state.alert.clientErrorStatus,
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,
  gettingPerson: state.loading.gettingPerson,

  person: state.svarpased.person,
  personRelatert: state.svarpased.personRelatert,
  //familierelasjonKodeverk: state.svarpased.
  familierelasjonKodeverk: state.sak.familierelasjoner,
  valgteFamilieRelasjoner: state.svarpased.familierelasjoner,

  gettingSaksnummer: state.loading.gettingSaksnummer,
  saksnummer: state.svarpased.saksnummer,
  sed: state.svarpased.sed,
});

const SvarPaSed: React.FC = (): JSX.Element => {
  const [_saksnummer, setSaksnummer] = useState(undefined);
  const [validation, setValidation] = useState<{ [k: string]: any }>({});
  const [, setIsFnrValid] = useState<boolean>(false);
  //const [_sed, setSed] = useState(undefined);
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
  }: any = useSelector<State, any>(mapState);

  const onSaksnummerClick = () => {
    dispatch(svarpasedActions.getSaksnummer(_saksnummer));
  };


  const resetAllValidation = () => {
    setValidation({});
  };

  const onSetChange = (e: any) => {
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
      <Ui.Nav.Row className="m-0">
        <div className="col-sm-1" />
        <div className="col-sm-10 m-4">
          <SaksnummerDiv>
            <SaksnummerInput
              label="saksnummer"
              bredde="M"
              onChange={(e: any) => setSaksnummer(e.target.value)}
            />
            <Ui.Nav.Knapp onClick={onSaksnummerClick}>Hent</Ui.Nav.Knapp>
          </SaksnummerDiv>

          <PersonSearch
            alertStatus={alertStatus}
            alertMessage={alertMessage}
            alertType={alertType}
            initialFnr={""}
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
              onResetPersonRelatert={() => {
                dispatch(svarpasedActions.resetPersonRelatert());
              }}
              onAddFailure={() => {
                dispatch({
                  type: types.SVARPASED_TPSPERSON_ADD_FAILURE,
                });
              }}
              onAddSuccess={(e: any) => {
                dispatch(
                  svarpasedActions.addFamilierelasjoner(e)
                );
                dispatch({
                  type: types.SVARPASED_TPSPERSON_ADD_SUCCESS,
                });
              }}
              onAlertClose={() => dispatch(clientClear())}
            />
          )}
          {saksnummer !== undefined && saksnummer !== null && (
            <SetSelect onChange={onSetChange}>
              {saksnummer?.map((s: any) => {
                return <option key={s.sed}>{s.sed}</option>;
              })}
            </SetSelect>
          )}

          {saksnummer === null && (
            <Ui.Nav.AlertStripe status="ERROR">Fail</Ui.Nav.AlertStripe>
          )}

        </div>
        {JSON.stringify(saksnummer)}
        {JSON.stringify(sed)}
        {JSON.stringify(person)}
        <div className="col-sm-1" />
      </Ui.Nav.Row>
    </TopContainer>
  );
};

export default SvarPaSed;
