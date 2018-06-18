/* eslint import/prefer-default-export:"off" */
import PT from 'prop-types';

import { Kodeverk } from './kodeverk';

const BuctyperPropType = PT.shape({
  awod: PT.arrayOf(Kodeverk),
  administrative: PT.arrayOf(Kodeverk),
  family: PT.arrayOf(Kodeverk),
  horizontal: PT.arrayOf(Kodeverk),
  legislation: PT.arrayOf(Kodeverk),
  miscellaneous: PT.arrayOf(Kodeverk),
  pensions: PT.arrayOf(Kodeverk),
  recovery: PT.arrayOf(Kodeverk),
  sickness: PT.arrayOf(Kodeverk),
  unemployment: PT.arrayOf(Kodeverk),
});

export { BuctyperPropType as Buctyper };
