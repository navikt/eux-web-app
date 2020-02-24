import * as sakActions from 'actions/sak'
import { State } from 'declarations/reducers'
import Ui from 'eessi-pensjon-ui'

import PT from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Arbeidsforhold from 'components/sak/arbeidsforhold'

export interface ArbeidsForholdSelector {
  arbeidsforhold: any
}

export interface ArbeidsForholdProps {
  fnr?: string
}

const mapState = (state: State): ArbeidsForholdSelector => ({
  arbeidsforhold: state.sak.arbeidsforhold
})

const ArbeidsforholdController: React.FC<ArbeidsForholdProps> = ({ fnr = '' }: ArbeidsForholdProps): JSX.Element => {
  const { dispatch } = useDispatch()
  const { arbeidsforhold }: ArbeidsForholdSelector = useSelector<State, ArbeidsForholdSelector>(mapState)
  const hentArbeidsforhold = () => {
    dispatch(sakActions.getArbeidsforhold(fnr))
  }

  return (
    <div className='arbeidsforhold'>
      <Ui.Nav.Row>
        <Ui.Nav.Column xs='3'>
          <strong>AA Registeret</strong><br />Arbeidsforhold/Arbeidsgivere
        </Ui.Nav.Column>
        <Ui.Nav.Column xs='2'>
          <Ui.Nav.Knapp onClick={hentArbeidsforhold}>Søk</Ui.Nav.Knapp>
        </Ui.Nav.Column>
      </Ui.Nav.Row>
      <Ui.Nav.Row>
        &nbsp;
      </Ui.Nav.Row>
      {arbeidsforhold?.length > 0 && <Arbeidsforhold arbeidsforhold={arbeidsforhold} />}
    </div>
  )
}

ArbeidsforholdController.propTypes = {
  fnr: PT.string
}

export default ArbeidsforholdController
