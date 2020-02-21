import * as sakActions from 'actions/sak'
import * as vedleggActions from 'actions/vedlegg'
import { State } from 'declarations/reducers'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DocumentCard from '../components/DocumentCard/DocumentCard'
import './dokumentsok.css'

export interface DocumentSearchSelector {
  gettingDokumenter: boolean;
  dokumenter: any;
}

export interface DocumentSearchProps {
  inntastetRinasaksnummer: any;
  settRinaGyldighet: any;
  settRinaSjekket: any;
}

const mapState = (state: State): DocumentSearchSelector => ({
  gettingDokumenter: state.loading.gettingDokumenter,
  dokumenter: state.sak.dokumenter
})

const DokumentSok: React.FC<DocumentSearchProps> = ({
  inntastetRinasaksnummer, settRinaGyldighet, settRinaSjekket
}: DocumentSearchProps): JSX.Element => {

  const { dokumenter, gettingDokumenter }: DocumentSearchSelector = useSelector<State, DocumentSearchSelector>(mapState)
  const dispatch = useDispatch()
  const [nyttSok, setNyttSok] = useState(false)
  const [rinadokumenter, setRinadokumenter] = useState([])

  const sokEtterDokumenter = () => {
    if (inntastetRinasaksnummer.length === 0) return;
    dispatch(sakActions.getDokumenter(inntastetRinasaksnummer))
  }

  useEffect(() => {
    if (dokumenter && !rinadokumenter) {
      setNyttSok(true)
      setRinadokumenter(dokumenter)
      settRinaSjekket(true)
      if (dokumenter.length > 0) {
        settRinaGyldighet(true)
      }
    }
  }, [dokumenter, rinadokumenter, settRinaSjekket, settRinaGyldighet])

  const inntastetRinaSaksnummerHarBlittEndret = () => {
    setRinadokumenter( [] )
    setNyttSok(false)
  }

  const harIngenDokumenter = rinadokumenter && rinadokumenter.length === 0;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(vedleggActions.set('rinasaksnummer', e.target.value))
  }

  return (
    <div className="dokumentsok">
      <div className="dokumentsok__skjema">
        <Ui.Nav.Input
          label="RINA saksnummer"
          className="dokumentsok__input"
          bredde="XL"
          name="rinasaksnummer"
          onKeyUp={inntastetRinaSaksnummerHarBlittEndret}
          onChange={onChange}
        />
        <Ui.Nav.Knapp className="dokumentsok__knapp" onClick={sokEtterDokumenter} spinner={gettingDokumenter}>SØK</Ui.Nav.Knapp>
      </div>
      {rinadokumenter && rinadokumenter.length ? <DocumentCard dokumenter={rinadokumenter} /> : null}
      {(nyttSok && harIngenDokumenter) ? <p>Ingen dokumenter funnet</p> : null}
    </div>
  );
}

DokumentSok.propTypes = {
  inntastetRinasaksnummer: PT.string,
  settRinaGyldighet: PT.func.isRequired,
  settRinaSjekket: PT.func.isRequired,
};
DokumentSok.defaultProps = {
  inntastetRinasaksnummer: ''
};

export default DokumentSok
