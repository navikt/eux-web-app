import React, { Component, Fragment } from 'react';
import { FieldArray } from 'redux-form';
import PT from 'prop-types';
import * as Ikoner from '../../resources/images/index';
import Ui from 'eessi-pensjon-ui'
import { formatterDatoTilNorsk } from '../../utils/dato';
import { ArbeidsforholdPropType, ArbeidsforholdetPropType } from '../../declarations/types.pt';

const uuid = require('uuid/v4');

const btnStyle = {
  margin: '1.25em 0 0 0',
};

const ArbeidsforholdLinje = props => {
  const { arbeidsforholdet, erValgt, arbeidsforholdKlikkHandler } = props;
  const {
    arbeidsforholdIDnav, navn, orgnr, ansettelsesPeriode: { fom, tom },
  } = arbeidsforholdet;
  return (
    <Ui.Nav.Row>
      <Ui.Nav.Column xs="1" style={{ width: '5%' }}>
        <div className="panelheader__ikon" style={{ marginTop: '0.25em', backgroundImage: `url('${Ikoner.Arbeidsforhold}')` }} />
      </Ui.Nav.Column>
      <Ui.Nav.Column xs="2" style={{ width: '20%', marginBottom: '0.5em' }}>
        <strong>{navn}</strong><br />Orgnr:&nbsp;{orgnr}<br />StartDato:&nbsp;{formatterDatoTilNorsk(fom)}<br />SluttDato:&nbsp;{formatterDatoTilNorsk(tom)}
      </Ui.Nav.Column>
      <Ui.Nav.Column xs="1" style={btnStyle} >
        <Ui.Nav.Checkbox checked={erValgt} onChange={() => arbeidsforholdKlikkHandler(arbeidsforholdIDnav)} label="Velg" />
      </Ui.Nav.Column>
    </Ui.Nav.Row>
  );
};
ArbeidsforholdLinje.propTypes = {
  arbeidsforholdet: ArbeidsforholdetPropType.isRequired,
  erValgt: PT.bool,
  arbeidsforholdKlikkHandler: PT.func.isRequired,
};
ArbeidsforholdLinje.defaultProps = {
  erValgt: false,
};

class ArbeidsforholdListe extends Component {
  arbeidsforholdKlikkHandler = arbeidsforholdIDnav => {
    const { fields, arbeidsforhold } = this.props;
    const alleValgteFelter = fields.getAll() || [];
    const valgtArbeidsgiver = arbeidsforhold.find(elem => elem.arbeidsforholdIDnav === arbeidsforholdIDnav);
    const eksistererVedPosisjon = alleValgteFelter.findIndex(item => item.arbeidsforholdIDnav === arbeidsforholdIDnav);
    if (eksistererVedPosisjon === -1) {
      fields.push({ ...valgtArbeidsgiver });
    } else {
      fields.remove(eksistererVedPosisjon);
    }
  };
  render() {
    const { fields, arbeidsforhold } = this.props;
    const alleValgteFelter = fields.getAll();
    return (
      <Fragment>
        {arbeidsforhold.map(arbeidsforholdet => {
          const arbeidsForholdErValgt = alleValgteFelter.find(item => item.arbeidsforholdIDnav === arbeidsforholdet.arbeidsforholdIDnav);
          return <ArbeidsforholdLinje
            key={uuid()}
            arbeidsforholdet={arbeidsforholdet}
            erValgt={arbeidsForholdErValgt !== undefined}
            arbeidsforholdKlikkHandler={this.arbeidsforholdKlikkHandler}
          />;
        })}
      </Fragment>
    );
  }
}

ArbeidsforholdListe.propTypes = {
  fields: PT.object.isRequired,
  arbeidsforhold: ArbeidsforholdPropType,
};
ArbeidsforholdListe.defaultProps = {
  arbeidsforhold: [],
};

const Arbeidsforhold = props => (
  <div className="arbeidsforhold">
    <FieldArray name="tilleggsopplysninger.arbeidsforhold" component={ArbeidsforholdListe} props={props} />
  </div>
);
export default Arbeidsforhold;
