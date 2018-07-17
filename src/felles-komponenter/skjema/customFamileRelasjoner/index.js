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
  state = { fnr: '', relasjon: '' };

  leggTilRelasjon = () => {
    const { fields } = this.props;
    const { fnr, relasjon } = this.state;
    if (!fnr || !relasjon) { return false; }
    const familerelasjon = { fnr, relasjon };
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
    const { familierelasjonKodeverk, fields } = this.props;
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
  fields: PT.object.isRequired,
};
CustomFamilieRelasjoner.defaultProps = {
  familierelasjonKodeverk: [],
};

const mapStateToProps = state => ({
  familierelasjonKodeverk: KodeverkSelectors.familierelasjonerSelector(state),
});

export default connect(mapStateToProps)(CustomFamilieRelasjoner);
