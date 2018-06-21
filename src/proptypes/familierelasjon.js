/* eslint import/prefer-default-export:"off" */
import PT from 'prop-types';

const FamilieRelasjonType = PT.shape({
  fnr: PT.string,
  relasjon: PT.string,
});

export { FamilieRelasjonType as FamilieRelasjon };
