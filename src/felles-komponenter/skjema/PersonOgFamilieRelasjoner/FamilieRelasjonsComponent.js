import React from 'react';
import { FieldArray } from 'redux-form';

import * as Nav from '../../../utils/navFrontend';
import FamilieRelasjonController from './FamilieRelasjonController';

const FamilieRelasjonsComponent = () => (
  <div>
    <Nav.Systemtittel>Familierelasjon(er)</Nav.Systemtittel>
    <Nav.Panel border>
      <Nav.Fieldset legend="Vennligst velg familirelasjonen SEDen angår:" className="familieRelasjoner">
        <div className="familieRelasjoner__liste">
          <FieldArray name="tilleggsopplysninger.familierelasjoner" component={FamilieRelasjonController} />
        </div>
      </Nav.Fieldset>
    </Nav.Panel>
  </div>
);

export default FamilieRelasjonsComponent;
