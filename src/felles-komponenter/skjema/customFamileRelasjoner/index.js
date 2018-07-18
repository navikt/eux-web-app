import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';

import * as MPT from '../../../proptypes';
import * as Nav from '../../../utils/navFrontend';

import './familierelasjoner.css';
import * as KodeverkSelectors from '../../../ducks/kodeverk/selectors';

const uuid = require('uuid/v4');

const FamilieRelasjon = ({ relasjon: familie, indeks, slettRelasjon }) => (
  <div className="familierelasjoner__linje">
    <dl className="familierelasjoner__detailjer">
      <dt className="familierelasjoner__tittel">Familierelasjon #{indeks + 1}:</dt>
      <dd className="familierelasjoner__detalj">{familie.relasjon}</dd>
      <dd className="familierelasjoner__detalj">{familie.fnr}</dd>
      <dd className="familierelasjoner__detalj">{familie.kjoenn}</dd>
      <dd className="familierelasjoner__detalj">{familie.sammensattNavn}</dd>
    </dl>
    <Nav.Knapp
      className="familierelasjoner__knapp familierelasjoner__knapp--slett"
      onClick={() => slettRelasjon(familie.fnr)}>
      <Nav.Ikon kind="trashcan" size="20" className="familierelasjoner__knapp__ikon" />
      <div>Fjern</div>
    </Nav.Knapp>
  </div>
);

FamilieRelasjon.propTypes = {
  indeks: PT.number.isRequired,
  relasjon: MPT.FamilieRelasjon.isRequired,
  slettRelasjon: PT.func.isRequired,
};

class CustomFamilieRelasjoner extends Component {
  state = {
    fnr: '', relasjon: '', kjoenn: '', sammensattNavn: '',
  };

  leggTilRelasjon = () => {
    const { fields } = this.props;
    const {
      fnr, relasjon, kjoenn, sammensattNavn,
    } = this.state;
    if (!fnr || !relasjon || !kjoenn || !sammensattNavn) { return false; }
    const familerelasjon = {
      fnr, relasjon, kjoenn, sammensattNavn,
    };
    return fields.push(familerelasjon);
  };

  oppdaterState = (felt, event) => {
    const { value } = event.currentTarget;
    this.setState({ [felt]: value });
  };

  slettRelasjon = fnr => {
    const { fields } = this.props;
    const index = fields.getAll().findIndex(relasjon => relasjon.fnr === fnr);
    fields.remove(index);
  };

  render() {
    const { familierelasjonKodeverk, kjoennKodeverk, fields } = this.props;
    const relasjoner = fields.getAll();

    return (
      <div className="familerelasjoner">
        {relasjoner && relasjoner.map((relasjon, indeks) => <FamilieRelasjon key={uuid()} relasjon={relasjon} indeks={indeks} slettRelasjon={this.slettRelasjon} />)}
        <div className="familierelasjoner__linje">
          <Nav.Input
            label="Fnr eller Dnr"
            className="familierelasjoner__input"
            bredde="XXL"
            value={this.state.fnr}
            onChange={event => this.oppdaterState('fnr', event)} />
          <Nav.Input
            label="Navn"
            className="familierelasjoner__input"
            bredde="XXL"
            value={this.state.sammensattNavn}
            onChange={event => this.oppdaterState('sammensattNavn', event)} />
          <Nav.Select
            label="Kjønn"
            bredde="s"
            className="familierelasjoner__input"
            value={this.state.kjoenn}
            onChange={event => this.oppdaterState('kjoenn', event)}>
            <option value="" disabled>- velg -</option>
            {kjoennKodeverk && kjoennKodeverk.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
          </Nav.Select>
          <Nav.Select
            label="Familierelasjon"
            bredde="s"
            className="familierelasjoner__input"
            value={this.state.relasjon}
            onChange={event => this.oppdaterState('relasjon', event)}>
            <option value="" disabled>- velg -</option>
            {familierelasjonKodeverk && familierelasjonKodeverk.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
          </Nav.Select>
          <Nav.Knapp onClick={this.leggTilRelasjon} className="familierelasjoner__knapp">
            <Nav.Ikon kind="tilsette" size="20" className="familierelasjoner__knapp__ikon" />
            <div>Legg til</div>
          </Nav.Knapp>
        </div>
      </div>
    );
  }
}

CustomFamilieRelasjoner.propTypes = {
  familierelasjonKodeverk: PT.arrayOf(MPT.Kodeverk),
  kjoennKodeverk: PT.arrayOf(MPT.Kodeverk),
  fields: PT.object.isRequired,
};
CustomFamilieRelasjoner.defaultProps = {
  familierelasjonKodeverk: [],
  kjoennKodeverk: [],
};

const mapStateToProps = state => ({
  familierelasjonKodeverk: KodeverkSelectors.familierelasjonerSelector(state),
  kjoennKodeverk: KodeverkSelectors.kjoennSelector(state),
});

export default connect(mapStateToProps)(CustomFamilieRelasjoner);
