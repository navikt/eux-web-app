export default [
  {
    sakTittel: 'Beslutte komponent myndighet',
    sakType: 'FB_BUC_01',
    sakId: '1166592',
    sakUrl: 'http://foo.com',
    sistEndretDato: '2020-01-01',
    motpart: [
      'Lodzkie Voivodeship Office in Lodz (Polen)'
    ],
    sedListe: [
      {
        sedTittel: 'Description for F001',
        status: 'received',
        sedType: 'F001',
        sedId: '603e18ebd5b549b1b5c0f53c58558115',
        sistEndretDato: '2020-01-02',
        svarsedType: 'F002',
        svarsedDisplay: 'Description for F002',
        svarsedId: '603e18ebd5b549b1b5c0f53c58558115_2'
      }, {
        sedTittel: 'Description for F002',
        status: 'received',
        sedType: 'F002',
        sedId: '603e18ebd5b549b1b5c0f53c58558116',
        sedIdParent: '603e18ebd5b549b1b5c0f53c58558117',
        sistEndretDato: '2020-01-02',
        svarsedType: 'F002',
        svarsedDisplay: 'Description for F002',
        svarsedId: '603e18ebd5b549b1b5c0f53c58558116_2'
      }
    ]
  }, {
    sakTittel: 'Dagpenger',
    sakType: 'U_BUC_01',
    sakId: '1166593',
    sakUrl: 'http://foo.com',
    sistEndretDato: '2020-01-01',
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
      },
      {
        sedTittel: 'Description for U003',
        status: 'new',
        sedType: 'U003',
        sedId: '603e18ebd5b549b1b5c0f53c58558117',
        sistEndretDato: '2020-01-04',
        svarsedType: 'U004',
        svarsedDisplay: 'Description for U004',
        svarsedId: '603e18ebd5b549b1b5c0f53c58558117_2'
      }, {
        sedTittel: 'Description for U00X',
        status: 'new',
        sedType: 'U00X',
        sedId: '603e18ebd5b549b1b5c0f53c58558118',
        sistEndretDato: '2020-01-04',
        svarsedType: 'U017',
        svarsedDisplay: 'Description for U017',
        svarsedId: '603e18ebd5b549b1b5c0f53c58558118_2'
      }
    ]
  },
  {
    sakTittel: 'Horisontal',
    sakType: 'H_BUC_01',
    sakId: '398793',
    sakUrl: 'https://rina-ss3-q.adeo.no/portal/#/caseManagement/398793?rightView=filtering',
    sistEndretDato: '2021-04-07',
    motpart: [
      'NAV ACCEPTANCE TEST 07 (Norge)'
    ],
    lenkeHvisForrigeSedMaaJournalfoeres: 'http://www.nav.no',
    sedListe: [
      {
        sedTittel: 'Horizontal',
        sedType: 'H001',
        sedId: '8edd012b62d84a768cbd4a734929076f',
        status: 'received',
        sistEndretDato: '2021-02-18',
        svarsedType: 'H002',
        svarsedDisplay: 'Create H002',
        lenkeHvisForrigeSedMaaJournalfoeres: 'http://www.nav.no',
        svarsedId: '8edd012b62d84a768cbd4a734929076f_2'
      }, {
        sedTittel: 'Horizontal',
        sedType: 'H001',
        sedId: '8edd012b62d84a768cbd4a734929076d',
        status: 'received',
        sistEndretDato: '2021-02-19',
        svarsedType: 'H002',
        svarsedDisplay: 'Create H002',
        svarsedId: '8edd012b62d84a768cbd4a734929076d_2'
      }
    ]
  },
  {
    sakTittel: 'Utveksling av informasjon for å avgjøre et krav for UB',
    sakType: 'UB_BUC_01',
    sakId: '398792',
    sakUrl: 'https://rina-ss3-q.adeo.no/portal/#/caseManagement/398792?rightView=filtering',
    sistEndretDato: '2021-04-07',
    motpart: [
      'NAV ACCEPTANCE TEST 07 (Norge)'
    ],
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