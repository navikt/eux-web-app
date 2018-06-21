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
    const familerelasjon = { fnr, relasjon };
    fields.push(familerelasjon);
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
      <div>
        {relasjoner && relasjoner.map(relasjon => <FamilieRelasjon key={uuid()} relasjon={relasjon} slettRelasjon={this.slettRelasjon} />)}
        <Nav.Input label="Fødsels- eller d-nummer" bredde="S" value={this.state.fnr} onChange={event => this.oppdaterState('fnr', event)} />
        <Nav.Select label="Familierelasjon" bredde="s" value={this.state.relasjon} onChange={event => this.oppdaterState('relasjon', event)}>
          <option value="" disabled>- velg -</option>
          {familierelasjonKodeverk && familierelasjonKodeverk.map(element => <option value={element.kode} key={uuid()}>{element.term}</option>)}
        </Nav.Select>
        <button onClick={this.leggTilRelasjon}>Legg til</button>
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
