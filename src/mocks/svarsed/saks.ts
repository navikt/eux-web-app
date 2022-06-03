export default (saksnummer: string) => {
  const saks = [
    {
      fornavn: 'Ola',
      etternavn: 'Nordmenn',
      kjoenn: 'M',
      foedselsdato: '1970-01-01',
      fnr: '12345678901',
      sakTittel: 'Beslutte komponent myndighet',
      sakType: 'FB_BUC_01',
      sakId: '1166592',
      sakUrl: 'http://foo.com',
      sistEndretDato: '2020-01-01',
      erSakseier: 'ja',
      motpart: [
        'Lodzkie Voivodeship Office in Lodz (Polen)'
      ],
      sedListe: [
        {
          sedTittel: 'Description for F001',
          status: 'received',
          sedType: 'F001',
          sedId: 'f001received',
          sistEndretDato: '2020-01-02',
          svarsedType: 'F002',
          svarsedDisplay: 'Description for F002',
          svarsedId: 'f001receivedSvar'
        }, {
          sedTittel: 'Description for F002',
          status: 'new',
          sedType: 'F002',
          sedId: 'f002new',
          sistEndretDato: '2020-01-01'
        }, {
          sedTittel: 'Description for F002 with sedIdParent',
          status: 'received',
          sedType: 'F002',
          sedId: 'f002received',
          sedIdParent: 'f002receivedParent',
          sistEndretDato: '2020-01-03',
          svarsedType: 'F002',
          svarsedDisplay: 'Description for F002',
          svarsedId: 'f002receivedSvar'
        }, {
          sedTittel: 'Description for F002 sent with X008',
          status: 'sent',
          sedType: 'F002',
          sedId: 'f002sent',
          sistEndretDato: '2020-01-04'
        }, {
          sedTittel: 'Ugyldiggjøre SED',
          sedType: 'X008',
          status: 'new',
          sedId: 'x008cancelled',
          sedIdParent: 'f002sent'
        }, {
          sedTittel: 'Unntaksfeil',
          sedType: 'X050',
          sedId: 'x050cancelled',
          sedIdParent: 'f002sent'
        }, {
          sedTittel: 'Description for F002 sent without X008',
          status: 'sent',
          sedType: 'F002',
          sedId: 'f002sent2',
          sistEndretDato: '2020-01-04'
        }, {
          sedTittel: 'Description for F002',
          status: 'active',
          sedType: 'F002',
          sedId: 'f002active',
          sistEndretDato: '2020-01-05'
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
      sedListe: [
        {
          sedTittel: 'Description for U001',
          status: 'sent',
          sedType: 'U001',
          sedId: '603e18ebd5b549b1b5c0f53c58558116',
          sistEndretDato: '2020-01-03',
          svarsedType: 'U002',
          svarsedDisplay: 'Description for U002',
          svarsedId: '603e18ebd5b549b1b5c0f53c58558116_2'
        }, {
          sedTittel: 'Description for U003',
          status: 'new',
          sedType: 'U003',
          sedId: '603e18ebd5b549b1b5c0f53c58558117',
          sistEndretDato: '2020-01-04',
          svarsedType: 'U004',
          svarsedDisplay: 'Description for U004',
          svarsedId: '603e18ebd5b549b1b5c0f53c58558117_2'
        }, {
          sedTittel: 'Description for U004',
          status: 'new',
          sedType: 'U004',
          sedId: '603e18ebd5b549b1b5c0f53c58558118',
          sistEndretDato: '2020-01-04'
        }, {
          sedTittel: 'Description for U00X',
          status: 'new',
          sedType: 'U00X',
          sedId: '603e18ebd5b549b1b5c0f53c58558119',
          sistEndretDato: '2020-01-04',
          svarsedType: 'U017',
          svarsedDisplay: 'Description for U017',
          svarsedId: '603e18ebd5b549b1b5c0f53c58558119_2'
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
      lenkeHvisForrigeSedMaaJournalfoeres: 'http://www.nav.no',
      sedListe: [
        {
          sedTittel: 'Horizontal',
          sedType: 'H001',
          sedId: 'h001new',
          status: 'new',
          sistEndretDato: '2021-02-19'
        }, {
          sedTittel: 'Horizontal',
          sedType: 'H001',
          sedId: 'h001cancelled',
          status: 'cancelled',
          sistEndretDato: '2021-02-19'
        }, {
          sedTittel: 'Horizontal With Link',
          sedType: 'H001',
          sedId: 'h001received',
          status: 'received',
          sistEndretDato: '2021-02-18',
          svarsedType: 'H002',
          svarsedDisplay: 'Create H002',
          lenkeHvisForrigeSedMaaJournalfoeres: 'http://www.nav.no',
          svarsedId: 'h002received'
        }, {
          sedTittel: 'Horizontal',
          sedType: 'H001',
          sedId: 'h001received2',
          status: 'received',
          sistEndretDato: '2021-02-19',
          svarsedType: 'H002',
          svarsedDisplay: 'Create H002',
          svarsedId: 'h002received2'
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
          svarsedId: '8edd012b62d84a768cbd4a734929076d_2'
        }
      ]
    }
  ]

  if (saksnummer === '1') {
    return [saks[0]]
  }

  return saks
}
