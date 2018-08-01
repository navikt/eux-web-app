/* eslint import/prefer-default-export:"off" */
import PT from 'prop-types';

const FamilieRelasjonType = PT.shape({
  fnr: PT.string,
  fdato: PT.string,
  rolle: PT.string,
  kjoenn: PT.string,
  fornavn: PT.string,
  etternavn: PT.string,
});

export { FamilieRelasjonType as FamilieRelasjon };
