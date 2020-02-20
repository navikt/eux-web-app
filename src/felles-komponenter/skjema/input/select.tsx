import React from 'react';
import PT from 'prop-types';
import Ui from 'eessi-pensjon-ui';
import { Field } from 'redux-form';
import '../skjema.css';

const Select: React.FC<any> = ({
  id, feltNavn, input, className, label, children, meta, ...rest
}: any): JSX.Element => {
  const feil = (meta && meta.error && meta.touched && !meta.active) ?  meta.error : undefined;
  const inputProps = {
    ...input,
    ...rest,
  };
  return (
    <Field
      name={feltNavn}
      className={className}
      id={id}
      component={() => (<Ui.Nav.Select label={label} feil={feil} {...inputProps}>
        {children || <option disabled value="0">ingen valg tilgjengelig</option>}
      </Ui.Nav.Select>)}
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
  label: PT.string.isRequired,
  children: PT.node,
  input: PT.object, // eslint-disable-line react/forbid-prop-types
  meta: PT.object, // eslint-disable-line react/forbid-prop-types
};

export default Select;
