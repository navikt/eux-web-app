/* eslint import/prefer-default-export:"off" */
import PT from 'prop-types';

import { Periode } from './periode';

const ArbeidsforholdetPropType = PT.shape({
  arbeidsforholdIDnav: PT.number,
  orgnr: PT.string,
  navn: PT.string,
  ansettelsesPeriode: Periode,
});

const ArbeidsforholdPropType = PT.arrayOf(ArbeidsforholdetPropType);

export {
  ArbeidsforholdetPropType as Arbeidsforholdet,
  ArbeidsforholdPropType as Arbeidsforhold,
};
