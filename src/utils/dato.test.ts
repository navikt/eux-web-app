/* eslint-disable */

import { vaskInputDato } from './dato';

import MockDate from 'mockdate';
import moment from 'moment/moment'

moment.updateLocale('nb', {
  monthsShort: [
    'jan',
    'feb',
    'mar',
    'apr',
    'mai',
    'jun',
    'jul',
    'aug',
    'sep',
    'okt',
    'nov',
    'des',
  ],
});

describe('dato.ts:', () => {
  describe('vaskInputDato', () => {
    test('godtar alle tillatte kortdatoformater', () => {
      const tillatteDatoer = [
        {test: '010113', 'forvent': '01.01.2013'},
        {test: '300113', 'forvent': '30.01.2013'},
        {test: '010479', 'forvent': '01.04.1979'},
        {test: '260479', 'forvent': '26.04.1979'},
        {test: '26041979', 'forvent': '26.04.1979'},
        {test: '22.07.09', 'forvent': '22.07.2009'},
        {test: '26-04-79', 'forvent': '26.04.1979'},
        {test: '01-01-79', 'forvent': '01.01.1979'},
        {test: '26-04-1979', 'forvent': '26.04.1979'},
       ];

      tillatteDatoer.forEach(datoTest => {
        const vasketDato = vaskInputDato(datoTest.test);
        expect(vasketDato).toEqual(datoTest.forvent);
      })
    });

    test('feiler på alle ugyldige datoformater', () => {
      const galeDatoer = [
        {test: '1979-07-02', 'forvent': false},
        {test: '29-02-17', 'forvent': false},
        {test: 123456789, 'forvent': false},
        {test: 'abcdef', 'forvent': false},
        {test: undefined, 'forvent': false},
        {test: null, 'forvent': false},
      ];

      galeDatoer.forEach(datoTest => {
        const vasketDato = vaskInputDato(datoTest.test);
        expect(vasketDato).toEqual(datoTest.forvent);
      })
    });

    test('feiler hvis dato er mindre enn 6 tegn', () => {
      const galDato = '26479';
      const vasketDato = vaskInputDato(galDato);
      expect(vasketDato).toEqual(false);
    });

    test('tolker årstall med 2 siffer til riktig århundre', () => {
      MockDate.set('1/1/2010');

      const testDatoer = [
        {test: '26-04-20', 'forvent': '26.04.2020'},
        {test: '26-04-30', 'forvent': '26.04.1930'},
      ];

      testDatoer.forEach(datoTest => {
        const vasketDato = vaskInputDato(datoTest.test);
        expect(vasketDato).toEqual(datoTest.forvent);
      });
    });
  });
});
