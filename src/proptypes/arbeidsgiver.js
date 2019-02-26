/* eslint import/prefer-default-export:"off" */
import PT from 'prop-types';

import { Periode } from './periode';

const ArbeidsgiverPropType = PT.shape({
  arbeidsforholdIDnav: PT.number,
  orgnr: PT.string,
  navn: PT.string,
  ansettelsesPeriode: Periode,
});

const ArbeidsgiverePropType = PT.arrayOf(ArbeidsgiverPropType);

export {
  ArbeidsgiverPropType as Arbeidsgiver,
  ArbeidsgiverePropType as Arbeidsgivere,
};
