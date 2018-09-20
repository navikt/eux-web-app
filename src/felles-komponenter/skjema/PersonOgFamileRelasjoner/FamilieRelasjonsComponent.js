import React from 'react';
import { FieldArray } from 'redux-form';
import PT from 'prop-types';

import * as MPT from '../../../proptypes/';
import * as Nav from '../../../utils/navFrontend';
import FamilieRelasjonController from './FamilieRelasjonController';

const FamilieRelasjonsComponent = ({ relasjoner }) => (
  <Nav.Panel border>
    <Nav.Fieldset legend="Familiemedlemmer SEDen angår:" className="familieRelasjoner">
      <div className="familieRelasjoner__liste">
        {relasjoner.length === 0 && <Nav.Panel className="familieRelasjoner__liste__tom">(Ingen familiemedlemmer er valgt. Velg fra listen nedenfor)</Nav.Panel>}
        <FieldArray name="tilleggsopplysninger.familierelasjoner" component={FamilieRelasjonController} />
      </div>
    </Nav.Fieldset>
  </Nav.Panel>
);
FamilieRelasjonsComponent.propTypes = {
  relasjoner: PT.arrayOf(MPT.FamilieRelasjon),
};
FamilieRelasjonsComponent.defaultProps = {
  relasjoner: [],
};

export default FamilieRelasjonsComponent;
