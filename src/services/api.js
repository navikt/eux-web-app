/* eslint-disable */
import * as Kodeverk from './modules/kodeverk';
import * as Saksbehandler from './modules/saksbehandler';
import * as Personer from './modules/personer';
import * as Rina from './modules/rina';
import * as Dokumenter from './modules/dokumenter';
import * as Fagsaker from './modules/fagsaker';
import * as Institusjoner from './modules/institusjoner';
import * as Arbeidsgivere from './modules/arbeidsgivere';
import * as Landkoder from './modules/landkoder';

// from .env or .env.local
// const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}`;
// console.log('process.env', process.env);


export {
  Arbeidsgivere,
  Dokumenter,
  Fagsaker,
  Institusjoner,
  Kodeverk,
  Landkoder,
  Personer,
  Rina,
  Saksbehandler,
};
