/* eslint-disable */
import * as Kodeverk from './modules/kodeverk';
import * as Saksbehandler from './modules/saksbehandler';
import * as Vedlegg from './modules/vedlegg';
import * as Personer from './modules/personer';
import * as Rinasak from './modules/rinasak';
// from .env or .env.local
// const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}`;
// console.log('process.env', process.env);


export {
  Rinasak,
  Kodeverk,
  Saksbehandler,
  Personer,
  Vedlegg,
};
