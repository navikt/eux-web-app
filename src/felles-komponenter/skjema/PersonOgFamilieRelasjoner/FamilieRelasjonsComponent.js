import React from 'react';
import { FieldArray } from 'redux-form';

import Ui from 'eessi-pensjon-ui'
import FamilieRelasjonController from './FamilieRelasjonController';

const FamilieRelasjonsComponent = () => (
  <div>
    <Ui.Nav.Systemtittel>Familierelasjon(er)</Ui.Nav.Systemtittel>
    <Ui.Nav.Panel border>
      <Ui.Nav.Fieldset legend="Vennligst velg familirelasjonen SEDen angår:" className="familieRelasjoner">
        <div className="familieRelasjoner__liste">
          <FieldArray name="tilleggsopplysninger.familierelasjoner" component={FamilieRelasjonController} />
        </div>
      </Ui.Nav.Fieldset>
    </Ui.Nav.Panel>
  </div>
);

export default FamilieRelasjonsComponent;
