import Ui from "eessi-pensjon-ui"
import React from 'react'
import { formatterDatoTilNorsk } from 'utils/dato'
import { PanelHeader } from 'felles-komponenter/panelHeader';
import * as Eux from 'felles-komponenter/Ikon';
import * as MPT from '../../proptypes';

const PersonKort: React.FC<any> = ({ person }: any): JSX.Element => {
  const {
    fnr, fdato, fornavn, etternavn, kjoenn,
  } = person;

  const panelUndertittel = (
    <div className="panelheader__undertittel">
      <span>Fødselsnummer: {fnr}</span>
      <span>Fødselsdato: {formatterDatoTilNorsk(fdato)}</span>
    </div>
  )

  return (
    <div>
      <Ui.Nav.Panel className="personsok__kort">
        <PanelHeader ikon={Eux.IkonFraKjonn(kjoenn)} tittel={`${fornavn} ${etternavn}`} undertittel={panelUndertittel} />
        <Ui.Nav.Knapp
          className="familierelasjoner__knapp familierelasjoner__knapp--slett"
          onClick={() => window.location.reload()}
        >
          <Eux.Icon kind="trashcan" size="20" className="familierelasjoner__knapp__ikon" />
          <div className="familierelasjoner__knapp__label">Fjern</div>
        </Ui.Nav.Knapp>
      </Ui.Nav.Panel>
    </div>
  );
};

PersonKort.propTypes = {
  person: MPT.Person.isRequired,
};

export default PersonKort
