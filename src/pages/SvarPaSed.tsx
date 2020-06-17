import TopContainer from 'components/TopContainer/TopContainer'
import { State } from 'declarations/reducers'
import React from 'react'
import Ui from 'eessi-pensjon-ui'
import { useDispatch, useSelector } from 'react-redux'
import * as svarpasedActions from 'actions/svarpased'
import styled from 'styled-components'

const SaksnummerDiv = styled.div`
   display: flex;
   align-items: flex-end;
   flex-direction: row;
`
const SaksnummerInput = styled(Ui.Nav.Input)`
   margin-right: 1rem;
`

const mapState = (state: State): any => ({
  gettingSaksnummer: state.loading.gettingSaksnummer,
  saksnummer: state.svarpased.saksnummer
})

const SvarPaSed: React.FC = (): JSX.Element => {

  const dispatch = useDispatch()

  const { gettingSaksnummer, saksnummer }: any = useSelector<State, any>(mapState)

  const onSaksnummerClick = (e: any) => {
     const saksnummer = e.target.value

     dispatch(svarpasedActions.getSaksnummer(saksnummer))
  }

  console.log('gettingSaksnummer: ', gettingSaksnummer)
  return (
    <TopContainer className='p-svarpased'>
      <Ui.Nav.Row className='m-0'>
        <div className='col-sm-1' />
        <div className='col-sm-10 m-4'>
         <SaksnummerDiv>
           <SaksnummerInput
             label='saksnummer'
             bredde='M'
           />
           <Ui.Nav.Knapp
             onClick={onSaksnummerClick}
           >
             Hent
           </Ui.Nav.Knapp>
         </SaksnummerDiv>
          {saksnummer === null && (<Ui.Nav.AlertStripe status='ERROR'>Fail</Ui.Nav.AlertStripe>)}
        </div>
        <div className='col-sm-1' />
      </Ui.Nav.Row>
    </TopContainer>
  )
}

export default SvarPaSed
