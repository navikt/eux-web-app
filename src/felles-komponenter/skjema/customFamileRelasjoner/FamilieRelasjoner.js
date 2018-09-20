import React from 'react';
import { FieldArray } from 'redux-form';
import PT from 'prop-types';

import * as MPT from '../../../proptypes/';
import * as Nav from '../../../utils/navFrontend';
import CustomFamilieRelasjoner from './CustomFamilieRelasjoner';

const FamilieRelasjoner = ({ relasjoner }) => (
  <Nav.Panel border>
    <Nav.Fieldset legend="Familiemedlemmer SEDen angår:" className="familieRelasjoner">
      <div className="familieRelasjoner__liste">
        {relasjoner.length === 0 && <Nav.Panel className="familieRelasjoner__liste__tom">(Ingen familiemedlemmer er valgt. Velg fra listen nedenfor)</Nav.Panel>}
        <FieldArray name="tilleggsopplysninger.familierelasjoner" component={CustomFamilieRelasjoner} />
      </div>
    </Nav.Fieldset>
  </Nav.Panel>
);
FamilieRelasjoner.propTypes = {
  relasjoner: PT.arrayOf(MPT.FamilieRelasjon),
};
FamilieRelasjoner.defaultProps = {
  relasjoner: [],
};

export default FamilieRelasjoner;
