import React, { Component } from 'react';
import PT from 'prop-types';

import * as MPT from '../../../proptypes';
import * as Nav from '../../../utils/navFrontend';

import './familierelasjoner.css';

const uuid = require('uuid/v4');

const FamilieRelasjon = ({ relasjon: familie, slettRelasjon }) => (
  <div>
    <dl>
      <dt>FamilieRelasjon</dt><dd>{familie.relasjon}</dd>
      <dt>Fødselsnummmer</dt><dd>{familie.fnr}</dd>
    </dl>
    <button onClick={() => slettRelasjon(familie.fnr)} >slett</button>
  </div>
);

FamilieRelasjon.propTypes = {
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
        <div className="familierelasjoner__linje">
          {relasjoner && relasjoner.map(relasjon => <FamilieRelasjon key={uuid()} relasjon={relasjon} slettRelasjon={this.slettRelasjon} />)}
        </div>
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
            <Nav.Ikon kind="tilsette" size="20" style={{ stroke: '#ff0000' }} className="familierelasjoner__knapp__ikon" />
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

export default CustomFamilieRelasjoner;
