import { clientClear } from 'actions/alert'
import PersonSearch from 'components/PersonSearch/PersonSearch'
import { Container, Content, Margin } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import Alertstripe from 'nav-frontend-alertstriper'
import { Knapp } from 'nav-frontend-knapper'
import { Input, Select } from 'nav-frontend-skjema'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as svarpasedActions from 'actions/svarpased'
import styled from 'styled-components'
import { FamilieRelasjon } from 'declarations/types'
import Family from 'components/Family/Family'

const SaksnummerDiv = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
`
const SaksnummerInput = styled(Input)`
  margin-right: 1rem;
`

const SetSelect = styled(Select)`
  margin-right: 1rem;
`

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
  sed: state.svarpased.sed
})

const SvarPaSed: React.FC = (): JSX.Element => {
  const [_saksnummer, setSaksnummer] = useState(undefined)
  const [validation, setValidation] = useState<{ [k: string]: any }>({})
  const [, setIsFnrValid] = useState<boolean>(false)
  // const [_sed, setSed] = useState(undefined);
  const dispatch = useDispatch()

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
    valgteFamilieRelasjoner
  }: any = useSelector<State, any>(mapState)

  const onSaksnummerClick = () => {
    dispatch(svarpasedActions.getSaksnummer(_saksnummer))
  }

  const resetAllValidation = () => {
    setValidation({})
  }

  const onSetChange = (e: any) => {
    dispatch(svarpasedActions.getSed(e.target.value))
  }

  const addTpsRelation = (relation: FamilieRelasjon): void => {
    /* Person fra TPS har alltid norsk nasjonalitet. Derfor default til denne. */
    dispatch(
      svarpasedActions.addFamilierelasjoner({
        ...relation,
        nasjonalitet: 'NO'
      })
    )
  }

  const deleteRelation = (relation: FamilieRelasjon): void => {
    dispatch(svarpasedActions.removeFamilierelasjoner(relation))
  }

  console.log('gettingSaksnummer: ', gettingSaksnummer)
  return (
    <TopContainer className='p-svarpased'>
      <Container>
        <Margin />
        <Content>
          <SaksnummerDiv>
            <SaksnummerInput
              label='saksnummer'
              bredde='M'
              onChange={(e: any) => setSaksnummer(e.target.value)}
            />
            <Knapp onClick={onSaksnummerClick}>Hent</Knapp>
          </SaksnummerDiv>

          <PersonSearch
            alertStatus={alertStatus}
            alertMessage={alertMessage}
            alertType={alertType}
            initialFnr=''
            person={person}
            gettingPerson={gettingPerson}
            className='slideAnimate'
            validation={validation}
            resetAllValidation={resetAllValidation}
            onFnrChange={() => setIsFnrValid(false)}
            onPersonFound={() => setIsFnrValid(true)}
            onSearchPerformed={(_fnr) => {
              dispatch(svarpasedActions.getPerson(_fnr))
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
              onResetPersonRelatert={() => dispatch(svarpasedActions.resetPersonRelatert())}
              onAddFailure={() => dispatch({type: types.SVARPASED_TPSPERSON_ADD_FAILURE})}
              onAddSuccess={(e: any) => {
                dispatch(svarpasedActions.addFamilierelasjoner(e))
                dispatch({type: types.SVARPASED_TPSPERSON_ADD_SUCCESS})
              }}
              onAlertClose={() => dispatch(clientClear())}
              onSearchFnr={(sok) => {
                dispatch(svarpasedActions.resetPersonRelatert())
                dispatch(svarpasedActions.getPersonRelated(sok))
              }}

            />
          )}
          {saksnummer !== undefined && saksnummer !== null && (
            <SetSelect onChange={onSetChange}>
              {saksnummer?.map((s: any) => {
                return <option key={s.sed}>{s.sed}</option>
              })}
            </SetSelect>
          )}

          {saksnummer === null && (
            <Alertstripe type='feil'>
              Fail
            </Alertstripe>
          )}
          {JSON.stringify(saksnummer)}
          {JSON.stringify(sed)}
          {JSON.stringify(person)}
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

export default SvarPaSed
