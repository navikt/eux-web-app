import { Sak } from 'declarations/types'
import _ from 'lodash'

export default (saksnummer: string, type: string) => {
  const saks: Array<Sak> = [
    {
      fornavn: 'Ola',
      etternavn: 'Nordmenn',
      kjoenn: 'M',
      foedselsdato: '1970-01-01',
      fnr: '12345678901',
      sakTittel: 'Beslutte komponent myndighet',
      sakType: 'FB_BUC_01',
      sakId: '1166592',
      internasjonalSakId: 'abvcdefghijklm',
      sakUrl: 'http://foo.com',
      sistEndretDato: '2020-01-01',
      erSakseier: 'ja',
      motpart: [
        'Lodzkie Voivodeship Office in Lodz (Polen)'
      ],
      sakshandlinger: [
        'H001', 'X001', 'X005', 'X007', 'X008', 'X009', 'X012', 'Close_Case'
      ],
      sedListe: [
        {
          sedTittel: 'Påminnelse',
          sedType: 'X009',
          sedId: '46f4ea863edd4106bd20b36675315008',
          sedUrl: 'https://rina-ss1-q.adeo.no/portal_new/case-management/1441020',
          status: 'received',
          sistEndretDato: '2022-07-18',
          sedHandlinger: ['X010', 'Read']
        }, {
          sedTittel: 'Description for new F001',
          status: 'new',
          sedType: 'F001',
          sedId: 'f001new',
          sistEndretDato: '2020-01-02',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete']
        }, {
          sedTittel: 'Description for sent F001',
          status: 'sent',
          sedType: 'F001',
          sedId: 'f001sent',
          sistEndretDato: '2020-01-02',
          svarsedType: 'F002',
          svarsedDisplay: 'Description for F002',
          svarsedId: 'f001receivedSvar',
          sedHandlinger: ['F002', 'Read', 'Update', 'Send', 'Delete']
        }, {
          sedTittel: 'Description for received F001',
          status: 'received',
          sedType: 'F001',
          sedId: 'f001received',
          sistEndretDato: '2020-01-02',
          sedHandlinger: ['X008', 'X011', 'X012', 'Read', 'Update', 'Send', 'Delete']
        }, {
          sedTittel: 'Description for new F002',
          status: 'new',
          sedType: 'F002',
          sedId: 'f002new',
          sistEndretDato: '2020-01-01',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete']
        }, {
          sedTittel: 'Description for received F002 with sedIdParent',
          status: 'received',
          sedType: 'F002',
          sedId: 'f002received',
          sedIdParent: 'f002receivedParent',
          sistEndretDato: '2020-01-03',
          svarsedType: 'F002',
          svarsedDisplay: 'Description for F002',
          svarsedId: 'f002receivedSvar',
          sedHandlinger: ['F002', 'Read', 'Update', 'Send', 'Delete']
        }, {
          sedTittel: 'Description for sent F002 with X008',
          status: 'sent',
          sedType: 'F002',
          sedId: 'f002sent',
          sistEndretDato: '2020-01-04',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete']
        }, {
          sedTittel: 'Ugyldiggjøre SED',
          sedType: 'X008',
          status: 'new',
          sedId: 'x008cancelled',
          sedIdParent: 'f002sent',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          sistEndretDato: '2020-01-03'
        }, {
          sedTittel: 'Unntaksfeil',
          sedType: 'X050',
          status: 'new',
          sedId: 'x050cancelled',
          sedIdParent: 'f002sent',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          sistEndretDato: '2020-01-03'
        }, {
          sedTittel: 'Description for sent F002 without X008',
          status: 'sent',
          sedType: 'F002',
          sedId: 'f002sent2',
          sistEndretDato: '2020-01-04',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete']
        }, {
          sedTittel: 'Description for active F002',
          status: 'active',
          sedType: 'F002',
          sedId: 'f002active',
          sistEndretDato: '2020-01-05',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete']
        }
      ]
    }, {
      fornavn: 'Ola',
      etternavn: 'Nordmenn',
      kjoenn: 'M',
      foedselsdato: '1970-01-01',
      fnr: '12345678901',
      sakTittel: 'Dagpenger',
      sakType: 'UB_BUC_01',
      sakId: '1166593',
      sakUrl: 'http://foo.com',
      sistEndretDato: '2020-01-01',
      erSakseier: 'nei',
      motpart: [
        'Lodzkie Voivodeship Office in Lodz (Polen)'
      ],
      sakshandlinger: [
        'H001', 'X005', 'X007', 'X009', 'X012', 'Close_Case'
      ],
      sedListe: [
        {
          sedTittel: 'Description for U001',
          status: 'sent',
          sedType: 'U001',
          sedId: '603e18ebd5b549b1b5c0f53c58558116',
          sistEndretDato: '2020-01-03',
          svarsedType: 'U002',
          svarsedDisplay: 'Description for U002',
          svarsedId: '603e18ebd5b549b1b5c0f53c58558116_2',
          sedHandlinger: ['U002', 'Read', 'Update', 'Send', 'Delete']
        }, {
          sedTittel: 'Description for U003',
          status: 'new',
          sedType: 'U003',
          sedId: '603e18ebd5b549b1b5c0f53c58558117',
          sistEndretDato: '2020-01-04',
          svarsedType: 'U004',
          svarsedDisplay: 'Description for U004',
          svarsedId: '603e18ebd5b549b1b5c0f53c58558117_2',
          sedHandlinger: ['U004', 'Read', 'Update', 'Send', 'Delete']
        }, {
          sedTittel: 'Description for U004',
          status: 'new',
          sedType: 'U004',
          sedId: '603e18ebd5b549b1b5c0f53c58558118',
          sistEndretDato: '2020-01-04',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete']
        }, {
          sedTittel: 'Description for U00X',
          status: 'new',
          sedType: 'U00X',
          sedId: '603e18ebd5b549b1b5c0f53c58558119',
          sistEndretDato: '2020-01-04',
          svarsedType: 'U017',
          svarsedDisplay: 'Description for U017',
          svarsedId: '603e18ebd5b549b1b5c0f53c58558119_2',
          sedHandlinger: ['U017', 'Read', 'Update', 'Send', 'Delete']
        }
      ]
    },
    {
      fornavn: 'Ola',
      etternavn: 'Nordmenn',
      kjoenn: 'M',
      foedselsdato: '1970-01-01',
      fnr: '12345678901',
      sakTittel: 'Horisontal',
      sakType: 'H_BUC_01',
      sakId: '398793',
      sakUrl: 'https://rina-ss3-q.adeo.no/portal/#/caseManagement/398793?rightView=filtering',
      sistEndretDato: '2021-04-07',
      erSakseier: 'ja',
      motpart: [
        'NAV ACCEPTANCE TEST 07 (Norge)'
      ],
      sakshandlinger: [
        'H001', 'X005', 'X007', 'X009', 'X012', 'Close_Case'
      ],
      sedListe: [
        {
          sedTittel: 'Horizontal',
          sedType: 'H001',
          sedId: 'h001new',
          status: 'new',
          sistEndretDato: '2021-02-19',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete']
        }, {
          sedTittel: 'Horizontal',
          sedType: 'H001',
          sedId: 'h001cancelled',
          status: 'cancelled',
          sistEndretDato: '2021-02-19',
          sedHandlinger: ['Read', 'Send', 'Delete']
        }, {
          sedTittel: 'Horizontal',
          sedType: 'H001',
          sedId: 'h001sent',
          status: 'sent',
          sistEndretDato: '2021-02-19',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete']
        }, {
          sedTittel: 'Horizontal With Link',
          sedType: 'H001',
          sedId: 'h001received',
          status: 'received',
          sistEndretDato: '2021-02-18',
          svarsedType: 'H002',
          svarsedDisplay: 'Create H002',
          lenkeHvisForrigeSedMaaJournalfoeres: 'http://www.nav.no',
          svarsedId: 'h002received',
          sedHandlinger: ['H002', 'Read', 'Update', 'Send', 'Delete']
        }, {
          sedTittel: 'Horizontal',
          sedType: 'H001',
          sedId: 'h001received2',
          status: 'received',
          sistEndretDato: '2021-02-19',
          svarsedType: 'H002',
          svarsedDisplay: 'Create H002',
          svarsedId: 'h002received2',
          sedHandlinger: ['H002', 'Read', 'Update', 'Send', 'Delete']
        }
      ]
    },
    {
      fornavn: 'Ola',
      etternavn: 'Nordmenn',
      kjoenn: 'M',
      foedselsdato: '1970-01-01',
      fnr: '12345678901',
      sakTittel: 'Utveksling av informasjon for å avgjøre et krav for UB',
      sakType: 'UB_BUC_01',
      sakId: '398792',
      sakUrl: 'https://rina-ss3-q.adeo.no/portal/#/caseManagement/398792?rightView=filtering',
      sistEndretDato: '2021-04-07',
      motpart: [
        'NAV ACCEPTANCE TEST 07 (Norge)'
      ],
      sakshandlinger: [
        'H001', 'X005', 'X007', 'X009', 'X012', 'Close_Case'
      ],
      erSakseier: 'nei',
      sedListe: [
        {
          sedTittel: 'Anmodning om trygdehistorikk',
          sedType: 'U001',
          sedId: '8edd012b62d84a768cbd4a734929076d',
          status: 'received',
          sistEndretDato: '2021-02-18',
          svarsedType: 'U002',
          svarsedDisplay: 'Create U002 Reply',
          svarsedId: '8edd012b62d84a768cbd4a734929076d_2',
          sedHandlinger: ['U002', 'Read', 'Update', 'Send', 'Delete']
        }
      ]
    }
  ]

  if (type === 'saksnummer') {
    const sak: Sak | undefined = _.find(saks, { sakId: saksnummer })
    if (sak) {
      return sak
    }
    return [saks[0]]
  }

  return saks
}
