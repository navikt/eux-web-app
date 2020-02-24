import * as sakActions from 'actions/sak'
import * as vedleggActions from 'actions/vedlegg'
import 'components/DocumentSearch/DocumentSearch.css'
import { State } from 'declarations/reducers'
import Ui from 'eessi-pensjon-ui'
import moment from 'moment'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export interface DocumentSearchSelector {
  gettingDokumenter: boolean;
  dokumenter: any;
  rinadokumentID: any;
}

export interface DocumentSearchProps {
  inntastetRinasaksnummer: any;
  settRinaGyldighet: any;
  settRinaSjekket: any;
}

const mapState = (state: State): DocumentSearchSelector => ({
  gettingDokumenter: state.loading.gettingDokumenter,
  dokumenter: state.sak.dokumenter,
  rinadokumentID: state.vedlegg.rinadokumentID
})

const DocumentSearch: React.FC<DocumentSearchProps> = ({
  inntastetRinasaksnummer, settRinaGyldighet, settRinaSjekket
}: DocumentSearchProps): JSX.Element => {
  const { dokumenter, gettingDokumenter, rinadokumentID }: DocumentSearchSelector = useSelector<State, DocumentSearchSelector>(mapState)
  const dispatch = useDispatch()
  const [nyttSok, setNyttSok] = useState(false)
  const [rinadokumenter, setRinadokumenter] = useState([])

  const sokEtterDokumenter = () => {
    if (inntastetRinasaksnummer.length === 0) return
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
    setRinadokumenter([])
    setNyttSok(false)
  }

  const harIngenDokumenter = rinadokumenter && rinadokumenter.length === 0

  const onRinaSaksnummerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(vedleggActions.set('rinasaksnummer', e.target.value))
  }

  const onRinadokumentIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(vedleggActions.set('rinadokumentID', e.target.value))
  }

  const yyyMMdd = (dato: any) => moment(dato).format('YYYY-MM-DD')

  return (
    <div className='dokumentsok'>
      <div className='dokumentsok__skjema'>
        <Ui.Nav.Input
          label='RINA saksnummer'
          className='dokumentsok__input'
          bredde='XL'
          name='rinasaksnummer'
          onKeyUp={inntastetRinaSaksnummerHarBlittEndret}
          onChange={onRinaSaksnummerChange}
        />
        <Ui.Nav.Knapp className='dokumentsok__knapp' onClick={sokEtterDokumenter} spinner={gettingDokumenter}>SØK</Ui.Nav.Knapp>
      </div>
      {rinadokumenter && rinadokumenter.length ? (
        <Ui.Nav.Panel className='dokumentsok__kort'>
          <Ui.Nav.Select
            id='id-rinadokument'
            name='rinadokumentID'
            label='Velg SED Type' bredde='xl'
            onChange={onRinadokumentIDChange}
            value={rinadokumentID}
          >
            {dokumenter && dokumenter.map((element: any) => (
              <option value={element.rinadokumentID} key={element.rinadokumentID}>{element.kode} =&gt; {yyyMMdd(element.opprettetdato)}</option>)
            )}
          </Ui.Nav.Select>
        </Ui.Nav.Panel>
      ) : null}
      {(nyttSok && harIngenDokumenter) ? <p>Ingen dokumenter funnet</p> : null}
    </div>
  )
}

DocumentSearch.propTypes = {
  inntastetRinasaksnummer: PT.string,
  settRinaGyldighet: PT.func.isRequired,
  settRinaSjekket: PT.func.isRequired
}

export default DocumentSearch
