/* eslint import/prefer-default-export:"off" */
import PT from 'prop-types';

const PersonPropType = PT.shape({
  fnr: PT.string,
  sammensattNavn: PT.string,
});

export { PersonPropType as Person };
