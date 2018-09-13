/* eslint-disable */

import { vaskInputDato, normaliserInputDato, formatterDatoTilNorsk, formatterDatoTilISO, formatterKortDatoTilNorsk } from './dato';

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

it('godtar alle tillatte datoformater', () => {
  const tillatteDatoer = [
    {test: '130101', 'forvent': '2013.01.01'},
    {test: '130130', 'forvent': '2013.01.30'},
    {test: '010101', 'forvent': '2001.01.01'},
    {test: '790426', 'forvent': '1979.04.26'},
    {test: '19790426', 'forvent': '1979.04.26'},
    {test: '79-04-26', 'forvent': '1979.04.26'},
    {test: '79-01-01', 'forvent': '1979.01.01'},
    {test: '1979-04-26', 'forvent': '1979.04.26'},
    {test: '02-03-1979', 'forvent': false},
    {test: '17-29-02', 'forvent': false},
    {test: '790230', 'forvent': false},
    {test: 'abcdef', 'forvent': false},
   ];

  tillatteDatoer.map(datoTest => {
    const vasketDato = vaskInputDato(datoTest.test);
    expect(vasketDato).toEqual(datoTest.forvent);
  })
});

it('tolker årstall med 2 siffer riktig', () => {
  MockDate.set('1/1/2010');

  const tillatteDatoer = [
    {test: `10-10-26`, 'forvent': `2010.10.26`},
    {test: `11-10-26`, 'forvent': `1911.10.26`},
    {test: `20-04-26`, 'forvent': `1920.04.26`},
    {test: `30-04-03`, 'forvent': `1930.04.03`},
  ];

  tillatteDatoer.map(datoTest => {
    const vasketDato = vaskInputDato(datoTest.test);
    expect(vasketDato).toEqual(datoTest.forvent);
  });
});

it('håndterer skuddår korrekt', () => {
  const tillatteDatoer = [
    {test: '2016-02-29', 'forvent': '2016.02.29'},
    {test: '2017-02-29', 'forvent': false},
  ];

  tillatteDatoer.map(datoTest => {
    const vasketDato = vaskInputDato(datoTest.test);
    expect(vasketDato).toEqual(datoTest.forvent);
  })
});

it('normaliserer ikke dersom verdiene er forskjellige, dvs at brukeren fortsatt står i felt (focus)', () => {
  const verdi = '123456';
  const forrigeVerdi = '12345';

  expect(normaliserInputDato(verdi, forrigeVerdi)).toEqual(verdi);
});

it('normaliserer dersom begge verdiene er like (indikerer forlatt felt / blur field)', () => {
  const verdi = '011217';
  const forrigeVerdi = '011217';

  // Forvent en eller annen form for normalisering. Sjekker IKKE selve formatet, men kun at det
  // har skjedd en endring fra verdi.
  expect(normaliserInputDato(verdi, forrigeVerdi)).not.toEqual(false);
});

it('formatterer datoen riktig til format YYYY.MM.DD HH:mm:ss (tid er optional)', () => {
  const tillatteDatoer = [
    {test: '2016-01-12', 'forvent': '2016.01.12', klokkeslett: false},
    {test: '2017-12-01T20:58:01', 'forvent': '2017.12.01', klokkeslett: false},
    {test: '2017-12-01T20:58:01', 'forvent': '2017.12.01 20:58', klokkeslett: true},
    {test: '2017-12-01T01:08:01', 'forvent': '2017.12.01 01:08', klokkeslett: true},
    {test: '1979.01.02', 'forvent': '1979.01.02', klokkeslett: false},
    {test: '1979.03.05', 'forvent': '1979.03.05', klokkeslett: false},
    {test: '2000.02.12 20:00:1', 'forvent': '2000.02.12 20:00', klokkeslett: true},
  ];

  tillatteDatoer.forEach(datoTest => {
    const formattertDato = formatterDatoTilNorsk(datoTest.test, datoTest.klokkeslett);
    expect(formattertDato).toEqual(datoTest.forvent);
  });
})

it('formatterer norsk dato korrekt tilbake til maskinlesbar dato', () => {
  const tillatteDatoer = [
    {test: '2018.01.01 10:34', tid: true, forvent: '2018-01-01T10:34:00'},
    {test: '2018.01.01', tid: false, forvent: '2018-01-01'},
    {test: '2018.12.10 10:34', tid: true, forvent: '2018-12-10T10:34:00'},
    {test: '2018.04.29', tid: false, forvent: '2018-04-29'}
  ]

  tillatteDatoer.forEach(datoTest => {
    const formattertDato = formatterDatoTilISO(datoTest.test, datoTest.tid);
    expect(formattertDato).toEqual(datoTest.forvent);
  });
})

it('formatterer kort-datoene korrekt til lesbar dato', () => {
  const tillatteDatoer = [
    {test: '2007-01', forvent: 'jan - 2007'},
    {test: '2014-05', forvent: 'mai - 2014'},
    {test: '2016-10-31', forvent: 'okt - 2016'},
  ]

  tillatteDatoer.forEach(datoTest => {
    const formattertDato = formatterKortDatoTilNorsk(datoTest.test);
    expect(formattertDato).toEqual(datoTest.forvent);
  });
});
