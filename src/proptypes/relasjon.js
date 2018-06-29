/* eslint import/prefer-default-export:"off" */
import PT from 'prop-types';

const RelasjonPropType = PT.shape({
  fnr: PT.string,
  sammensattNavn: PT.string,
  kjoenn: PT.string,
});

export { RelasjonPropType as Relasjon };
