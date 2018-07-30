/* eslint-disable */
import {
  boolTilNorsk,
  norskTilBool,
  boolTilStreng,
  strengTilBool,
  strengTilInt,
  tekstEllerDash,
  isEmpty, sammensattNavn
} from './streng';

describe('streng.js', () => {
  describe('boolTilNorsk', () => {
    test('Oversetter true til "JA"', () => {
      expect(boolTilNorsk(true)).toEqual('JA');
    });
    test('Oversetter false til "NEI"', () => {
      expect(boolTilNorsk(false)).toEqual('NEI');
    });
  });
  describe('norskTilBool', () => {
    test('Oversetter JA til true', () => {
      expect(norskTilBool('JA')).toEqual(true);
    });
    test('Oversetter NEI til false', () => {
      expect(norskTilBool('NEI')).toEqual(false);
    });
  });
  describe('boolTilStreng', () => {
    test('Oversetter true => "true"', () => {
      expect(boolTilStreng(true)).toEqual('true');
    });
    test('Oversetter false => "false"', () => {
      expect(boolTilStreng(false)).toEqual('false');
    });
    test('Oversetter ikke undefined', () => {
      expect(boolTilStreng(undefined)).toEqual(undefined);
    });
  });
  describe('strengTilBool', () => {
    test('Transformerer "true" => true', () => {
      expect(strengTilBool('true')).toEqual(true);
    });
    test('Transformerer "false" => false', () => {
      expect(strengTilBool('false')).toEqual(false);
    });
    test('Transformerer "undefined" => false', () => {
      expect(strengTilBool('undefined')).toEqual(false);
    });
  });
  describe('strengTilInt', () => {
    test('Transformerer "1" => 1', () => {
      expect(strengTilInt('1')).toEqual(1);
    });
    test('Transformerer "-1" => -1', () => {
      expect(strengTilInt('-1')).toEqual(-1);
    });
  });
  describe('tekstEllerDash', () => {
    test('Oversetter tom verdi med "-"', () => {
      expect(tekstEllerDash(undefined)).toEqual('-');
    });
    test('Returnerer gyldig verdi uendret', () => {
      const data = {}
      expect(tekstEllerDash(data)).toEqual(data);
    });
  });
  describe('isEmpty', () => {
    test('streng = undefined return true', () => {
      expect(isEmpty(undefined)).toEqual(true);
    });
    test('string = "" return true', () => {
      expect(isEmpty('')).toEqual(true);
    });
    test('data = "astring" return false', () => {
      expect(isEmpty('astring')).toEqual(false);
    });
  });
  describe('sammensattNavn', () => {
    test('Gyldig fnavn OG enavn to concatenate correctly', () => {
      expect(sammensattNavn('fornavn', 'etternavn')).toEqual('fornavn etternavn');
    });
    test('Ugyldig fnavn OG enavn, to be undefined', () => {
      expect(sammensattNavn(undefined, undefined)).toEqual(undefined);
    });
    test('Gyldig fnavn OG Ugyldig enavn, to be undefined', () => {
      expect(sammensattNavn('fornavn', undefined)).toEqual(undefined);
    });
    test('Ugyldig fnavn OG Gyldig enavn, to be undefined', () => {
      expect(sammensattNavn(undefined, 'etternavn')).toEqual(undefined);
    });
  })
});
