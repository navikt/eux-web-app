import React from 'react';
import PT from 'prop-types';
import Ui from 'eessi-pensjon-ui';
import { Field } from 'redux-form';
import '../skjema.css';

function InnerInputComponent({
  input,
  label,
  children,
  ...rest
}) {
  const feil = (rest.meta.error && rest.meta.touched && !rest.meta.active) ? { feilmelding: rest.meta.error } : undefined;
  const inputProps = {
    ...input,
    ...rest,
  };
  return (
    <Ui.Nav.Select label={label} feil={feil} {...inputProps}>
      <option />
      {children}
    </Ui.Nav.Select>
  );
}

InnerInputComponent.defaultProps = {
  children: <option disabled value="0">ingen valg tilgjengelig</option>,
  input: undefined,
  meta: undefined,
};

InnerInputComponent.propTypes = {
  label: PT.string.isRequired,
  children: PT.node,
  input: PT.object, // eslint-disable-line react/forbid-prop-types
  meta: PT.object, // eslint-disable-line react/forbid-prop-types
};

function Select({
  id, feltNavn, className, ...rest
}) {
  return (
    <Field
      name={feltNavn}
      className={className}
      id={id}
      component={InnerInputComponent}
      props={rest}
    />
  );
}

Select.defaultProps = {
  className: '',
  id: undefined,
};

Select.propTypes = {
  feltNavn: PT.string.isRequired,
  id: PT.string,
  className: PT.string,
};

export default Select;
