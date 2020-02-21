import * as vedleggActions from 'actions/vedlegg'
import { State } from 'declarations/reducers'
import Ui from 'eessi-pensjon-ui'
import * as Skjema from 'felles-komponenter/skjema'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StatusLinje } from '../felles-komponenter/statuslinje'

import { getParam } from '../utils/queryString'
import DokumentSok from './dokumentsok'
import './Vedlegg.css'

export interface VedleggSelector {
  vedlegg: any;
  inntastetRinasaksnummer: any;
  rinasaksnummer: any;
  journalpostID: any;
  rinadokumentID: any;
  dokumentID: any;
  rinaNrErGyldig: any;
  rinaNrErSjekket: any;
  sendingVedlegg: boolean;
}

export interface VedleggProps {
  location: any;
}

const mapState = (state: State): VedleggSelector => ({
  vedlegg: state.vedlegg.vedlegg,
  inntastetRinasaksnummer: state.vedlegg.rinasaksnummer,
  rinasaksnummer: state.vedlegg.rinasaksnummer,
  journalpostID: state.vedlegg.journalpostID,
  rinadokumentID: state.vedlegg.rinadokumentID,
  dokumentID: state.vedlegg.dokumentID,
  rinaNrErGyldig: state.vedlegg.rinaNrErGyldig,
  rinaNrErSjekket: state.vedlegg.rinaNrErSjekket,
  sendingVedlegg: state.loading.sendingVedlegg
});

const Vedlegg: React.FC<VedleggProps> = ({ location }: VedleggProps): JSX.Element => {

  const [mounted, setMounted] = useState(false)
  const {vedlegg, journalpostID, dokumentID, inntastetRinasaksnummer, rinasaksnummer, rinadokumentID, rinaNrErGyldig, rinaNrErSjekket, sendingVedlegg}: VedleggSelector = useSelector<State, VedleggSelector>(mapState)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!mounted) {
      const rinasaksnummer = getParam(location, 'rinasaksnummer')
      dispatch(vedleggActions.set('rinasaksnummer', rinasaksnummer))
      setMounted(true)
    }
  }, [mounted, dispatch, location])

  const overrideDefaultSubmit = (event: React.FormEvent) => {
    event.preventDefault()
  }

  const sendSkjema = () => {
    if (!validate({})) {
      return
    }
    dispatch(vedleggActions.sendVedlegg({
      journalpostID: journalpostID,
      dokumentID: dokumentID,
      rinasaksnummer: rinasaksnummer,
      rinaNrErSjekket: rinaNrErSjekket,
      rinaNrErGyldig: rinaNrErGyldig,
      rinadokumentID: rinadokumentID
    }))
  }

  const settRinaGyldighet = (erGyldig: boolean) => {
    dispatch(vedleggActions.set('rinaNrErGyldig', erGyldig))
  }

  const settRinaSjekket = (erSjekket: boolean) => {
    dispatch(vedleggActions.set('rinaNrErSjekket', erSjekket))
  }

  const validate = (values: any) => {
    const journalpostID = journalpostValidation(values.journalpostID);
    const dokumentID = !values.dokumentID ? 'Du må taste inn en dokumentID' : null;
    const saksnummer = !values.saksnummer ? 'Du må taste inn et RINA saksnummer' : null;
    const rinadokumentID = !values.rinadokumentID ? 'Du må velge en SED' : null;
    return {
      journalpostID,
      dokumentID,
      saksnummer,
      rinadokumentID,
    }
  }

  const journalpostValidation = (journalpostID: any) => {
    if (!journalpostID) { return 'Du må taste inn en journalpostID'; }
    return null;
  };
  const responsLenke = vedlegg && vedlegg.url;
  const disableSendKnapp = !(rinaNrErGyldig && rinaNrErSjekket && rinadokumentID);

  return (
    <div className="vedlegg">
      <Ui.Nav.Container fluid>
        <form onSubmit={overrideDefaultSubmit}>
          <Ui.Nav.Row>
            <Ui.Nav.Column xs="6">
              <Ui.Nav.Panel className="vedlegg__skjema">
                <Ui.Nav.Fieldset legend="Vedleggs informasjon">
                  <Ui.Nav.HjelpetekstBase id="journalPostID" type="hoyre">Journalpost ID finner du i Gosys</Ui.Nav.HjelpetekstBase>
                  <Skjema.Input feltNavn="journalpostID" label="JournalpostID" />
                  <Ui.Nav.HjelpetekstBase id="dokumentID" type="under">Dokument ID finner du i Gosys</Ui.Nav.HjelpetekstBase>
                  <Skjema.Input feltNavn="dokumentID" label="DokumentID" />
                  <DokumentSok
                    inntastetRinasaksnummer={inntastetRinasaksnummer}
                    settRinaGyldighet={settRinaGyldighet}
                    settRinaSjekket={settRinaSjekket}
                  />
                </Ui.Nav.Fieldset>
                <div className="vedlegg__submmit">
                  <Ui.Nav.Hovedknapp
                    onClick={sendSkjema}
                    disabled={disableSendKnapp || sendingVedlegg}
                    spinner={sendingVedlegg}>Send vedlegg
                  </Ui.Nav.Hovedknapp>
                </div>
                <StatusLinje status='OK' rinaURL={responsLenke} tittel="Vedlegget" />
              </Ui.Nav.Panel>
            </Ui.Nav.Column>
          </Ui.Nav.Row>
        </form>
      </Ui.Nav.Container>
    </div>
  );
}

Vedlegg.propTypes = {
  location: PT.object.isRequired
};

export default Vedlegg;
