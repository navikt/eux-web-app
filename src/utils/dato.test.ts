/* eslint-disable */

import { vaskInputDato, formatterDatoTilNorsk } from './dato';

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


  describe('formatterDatoTilNorsk', () => {
    test('formatterer datoen riktig til norsk format DD.MM.YYYY uten klokkeslett', () => {
      const tillatteDatoer = [
        {test: '2016-01-12', 'forvent': '12.01.2016'},
        {test: '2017-12-01T20:58:01Z', 'forvent': '01.12.2017'},
        {test: '01.02.1979', 'forvent': '01.02.1979'},
        {test: '01.02.1979', 'forvent': '01.02.1979'},
      ];

      tillatteDatoer.forEach(datoTest => {
        const formattertDato = formatterDatoTilNorsk(datoTest.test);
        expect(formattertDato).toEqual(datoTest.forvent);
      });
    });

    test('returnerer tom streng dersom datoen er ugyldig.', () => {
      const feilDato = '2018-april-31';
      const formattertDato = formatterDatoTilNorsk(feilDato);
      expect(formattertDato).toEqual('');
    });

    test('formatterer datoen riktig til norsk format DD.MM.YYYY HH:mm:ss med klokkeslett', () => {
      const tillatteDatoer = [
        {test: '2017-12-01T20:58:01Z', 'forvent': '01.12.2017'},
        {test: '2017-12-01T01:08:01Z', 'forvent': '01.12.2017'},
        {test: '12.02.2000 20:00:1Z', 'forvent': '12.02.2000'},
      ];

      tillatteDatoer.forEach(datoTest => {
        const formattertDato = formatterDatoTilNorsk(datoTest.test);
        expect(formattertDato).toEqual(datoTest.forvent);
      });
    })
  });
});
