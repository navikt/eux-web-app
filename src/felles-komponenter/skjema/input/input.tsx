import React from 'react';
import PT from 'prop-types';
import { Field } from 'redux-form';
import Ui from 'eessi-pensjon-ui'
import { normaliserInputDato } from '../../../utils/dato';
import '../skjema.css';

const Input: React.FC<any> = ({
  feltNavn, bredde, datoFelt, input, label, meta, ...rest
}: any): JSX.Element => {
  const normaliserDatoFunksjon = datoFelt ? normaliserInputDato : undefined;
  const placeholderTekst = datoFelt ? 'ddmmåå' : null;
  const feil = (meta && meta.error && meta.touched && !meta.active) ? meta.error : undefined;
  const inputProps = { ...input, ...rest };

  return (
    <Field
      name={feltNavn}
      normalize={normaliserDatoFunksjon}
      component={() => {
        return rest.hidden? <div/> : <Ui.Nav.Input
          bredde={bredde} label={label} feil={feil} {...inputProps} />
      }}
      placeholder={placeholderTekst}
      props={rest}
    />
  );
}

Input.propTypes = {
  bredde: PT.string,
  feltNavn: PT.string.isRequired,
  datoFelt: PT.bool,
  label: PT.string.isRequired,
  meta: PT.object, // eslint-disable-line react/forbid-prop-types
  input: PT.object, // eslint-disable-line react/forbid-prop-types
};

Input.defaultProps = {
  bredde: 'fullbredde',
  datoFelt: false,
};

export default Input
