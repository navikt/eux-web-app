import TopContainer from "components/TopContainer/TopContainer";
import { State } from "declarations/reducers";
import React, { useState } from "react";
import Ui from "eessi-pensjon-ui";
import { useDispatch, useSelector } from "react-redux";
import * as svarpasedActions from "actions/svarpased";
import styled from "styled-components";

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
  gettingSaksnummer: state.loading.gettingSaksnummer,
  saksnummer: state.svarpased.saksnummer,
  getingFnummerDnummer: state.loading.getingFnummerDnummer,
  fnummerDnummer: state.svarpased.fnummerDnummer,
  sed: state.svarpased.sed,
});

const SvarPaSed: React.FC = (): JSX.Element => {
  const [_saksnummer, setSaksnummer] = useState(undefined);
  const [_fnummerDnummer, setFnummerDnummer] = useState(undefined);
  //const [_sed, setSed] = useState(undefined);
  const dispatch = useDispatch();

  const {
    gettingSaksnummer,
    saksnummer,
    getingFnummerDnummer,
    fnummerDnummer,
    sed,
  }: any = useSelector<State, any>(mapState);

  const onSaksnummerClick = () => {
    dispatch(svarpasedActions.getSaksnummer(_saksnummer));
  };

  const onFnrDnrClick = () => {
    dispatch(svarpasedActions.getFnummerDnummer(_fnummerDnummer));
  };

  const onSetChange = (e: any) => {
    dispatch(svarpasedActions.getSed(e.target.value));
  };

  console.log("gettingSaksnummer: ", gettingSaksnummer);
  console.log("getFnummerDnummer", getingFnummerDnummer);
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

            <SaksnummerInput
              label="Fnr/Dnr"
              bredde="M"
              onChange={(e: any) => setFnummerDnummer(e.target.value)}
            />
            <Ui.Nav.Knapp onClick={onFnrDnrClick}>Hent</Ui.Nav.Knapp>
          </SaksnummerDiv>
          <SetSelect onChange={onSetChange}>
            {saksnummer?.map((s: any) => {
              return <option key={s.sed}>{s.sed}</option>;
            })}
          </SetSelect>

          {saksnummer === null && (
            <Ui.Nav.AlertStripe status="ERROR">Fail</Ui.Nav.AlertStripe>
          )}
          {fnummerDnummer === null && (
            <Ui.Nav.AlertStripe status="ERROR">Fail</Ui.Nav.AlertStripe>
          )}
        </div>
        {JSON.stringify(saksnummer)}
        {JSON.stringify(fnummerDnummer)}
        {JSON.stringify(sed)}
        <div className="col-sm-1" />
      </Ui.Nav.Row>
    </TopContainer>
  );
};

export default SvarPaSed;
