import React, { Component, Fragment } from 'react';
import { FieldArray } from 'redux-form';
import PT from 'prop-types';
import * as Ikoner from '../../resources/images/index';
import * as Nav from '../../utils/navFrontend';
import { formatterDatoTilNorsk } from '../../utils/dato';

const uuid = require('uuid/v4');

const btnStyle = {
  margin: '1.25em 0 0 0',
};

const ArbeidsgiverLinje = props => {
  const { arbeidsgiveren, erValgt, arbeidsgiverKlikkHandler } = props;
  const { navn, orgnr, ansettelsesPeriode: { fom, tom } } = arbeidsgiveren;
  return (
    <Nav.Row>
      <Nav.Column xs="1" style={{ width: '5%' }}>
        <div className="panelheader__ikon" style={{ marginTop: '0.25em', backgroundImage: `url('${Ikoner.Arbeidsforhold}')` }} />
      </Nav.Column>
      <Nav.Column xs="2" style={{ width: '20%', marginBottom: '0.5em' }}>
        <strong>{navn}</strong><br />StartDato:&nbsp;{formatterDatoTilNorsk(fom)}<br />SluttDato:&nbsp;{formatterDatoTilNorsk(tom)}
      </Nav.Column>
      <Nav.Column xs="1" style={btnStyle} >
        <Nav.Checkbox checked={erValgt} onChange={() => arbeidsgiverKlikkHandler(orgnr)} label={orgnr} />
      </Nav.Column>
    </Nav.Row>
  );
};
ArbeidsgiverLinje.propTypes = {
  arbeidsgiveren: PT.object.isRequired,
  erValgt: PT.bool,
  arbeidsgiverKlikkHandler: PT.func.isRequired,
};
ArbeidsgiverLinje.defaultProps = {
  erValgt: false,
};

class ArbeidsgiverListe extends Component {
  arbeidsgiverKlikkHandler = orgnr => {
    const { fields } = this.props;
    const alleValgteFelter = fields.getAll() || [];
    const eksistererVedPosisjon = alleValgteFelter.findIndex(item => item === orgnr);
    if (eksistererVedPosisjon === -1) {
      fields.push(orgnr);
    } else {
      fields.remove(eksistererVedPosisjon);
    }
  };
  render() {
    const { fields, arbeidsgivere } = this.props;
    const alleValgteFelter = fields.getAll();
    return (
      <Fragment>
        {arbeidsgivere.map(arbeidsgiveren => {
          const orgnr = alleValgteFelter.find(item => item === arbeidsgiveren.orgnr);
          const arbeidsGiverErValgt = orgnr && orgnr.length > 0;
          return <ArbeidsgiverLinje
            key={uuid()}
            arbeidsgiveren={arbeidsgiveren}
            erValgt={arbeidsGiverErValgt}
            arbeidsgiverKlikkHandler={this.arbeidsgiverKlikkHandler}
          />;
        })}
      </Fragment>
    );
  }
}

ArbeidsgiverListe.propTypes = {
  fields: PT.object.isRequired,
  arbeidsgivere: PT.array,
};
ArbeidsgiverListe.defaultProps = {
  arbeidsgivere: [],
};

const Arbeidsgivere = props => (
  <div className="arbeidsgivere">
    <FieldArray name="tilleggsopplysninger.arbeidsgivere" component={ArbeidsgiverListe} props={props} />
  </div>
);
export default Arbeidsgivere;
