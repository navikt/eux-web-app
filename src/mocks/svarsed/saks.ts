import {Sak} from 'declarations/types'
import _ from 'lodash'

export default (saksnummer: string, type: string) => {
  const saks: Array<Sak> = [
    {
      cdmVersjon:'4.2',
      fornavn: 'Ola',
      etternavn: 'Nordmenn',
      kjoenn: 'M',
      foedselsdato: '1970-01-01',
      fnr: '12345678901',
      adressebeskyttelse: 'STRENGT_FORTROLIG',
      sakTittel: 'Beslutte komponent myndighet',
      sakType: 'FB_BUC_01',
      sakId: '1166592',
      internasjonalSakId: 'abvcdefghijklm',
      sakUrl: 'http://foo.com',
      sistEndretDato: '2020-01-01',
      erSakseier: true,
      sensitiv: true,
      navinstitusjon: {
        id: "NO:NAVAT07",
        navn: "NAV ACC 07"
      },
      motparter: [
        {
          formatertNavn: "ACC_County Agency For Employment Bihor (Romania)",
          motpartId: "RO:70005",
          motpartNavn: "ACC_County Agency For Employment Bihor",
          motpartLandkode: "ROM"
        },
        {
          formatertNavn: "Test institusjon",
          motpartId: "RO:70005",
          motpartNavn: "Test institusjon",
          motpartLandkode: "ROM"
        }
      ],
      fagsak: {
        "tema": "KON",
        "type": "FAGSAK",
        "nr": "1/2023",
        "system": "AO11",
        "fnr": "12345678901"
      },
      sakshandlinger: [
        'H001', 'F002', 'F026', 'F027', 'X001', 'X005', 'X007', 'X008', 'X009', 'X012', 'Close_Case', 'singleParticipant', 'Delete_Case'
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
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          vedlegg: [
            {
              "id": "3666a09dee604440a44dc9a51abf685a",
              "navn": "Påminnelse.pdf",
              "sensitivt": true
            },
            {
              "id": "7b41e7ed544f4cd4b568dcbc48266cef",
              "navn": "Melding_anmodning_om_informasjon.pdf",
              "sensitivt": true
            },
            {
              "id": "8b81b7003e354d32ad9385876a948bea",
              "navn": "Melding_anmodning_om_informasjon.pdf",
              "sensitivt": false
            },
            {
              "id": "9bfabcd05fb9466693e55592bb8845fb",
              "navn": "H001.pdf",
              "sensitivt": true
            }
          ]
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
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete', "ReadParticipants"]
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
        },
        {
          sedTittel: 'Ugyldiggjøre SED 2',
          sedType: 'X008',
          status: 'new',
          sedId: 'x008cancelled2',
          sedIdParent: 'x008cancelled',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          sistEndretDato: '2020-01-03'
        },
        {
          sedTittel: 'Ugyldiggjøre SED 3',
          sedType: 'X008',
          status: 'new',
          sedId: 'x008cancelled3',
          sedIdParent: 'x008cancelled2',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          sistEndretDato: '2020-01-03'
        },
        {
          sedTittel: 'Ugyldiggjøre SED 4',
          sedType: 'X008',
          status: 'new',
          sedId: 'x008cancelled3´´',
          sedIdParent: 'x008cancelled3',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          sistEndretDato: '2020-01-03'
        },
        {
          sedTittel: 'Unntaksfeil',
          sedType: 'X050',
          status: 'new',
          sedId: 'x050cancelled',
          sedIdParent: 'f002sent',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          sistEndretDato: '2020-01-03'
        },
        {
          sedTittel: 'Unntaksfeil 2',
          sedType: 'X050',
          status: 'new',
          sedId: 'x050cancelled2',
          sedIdParent: 'x050cancelled',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          sistEndretDato: '2020-01-03'
        },
        {
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
    },
    {
      cdmVersjon:'4.3',
      fornavn: 'Ola',
      etternavn: 'Nordmenn',
      kjoenn: 'M',
      foedselsdato: '1970-01-01',
      fnr: '12345678901',
      adressebeskyttelse: 'STRENGT_FORTROLIG',
      sakTittel: 'Beslutte komponent myndighet',
      sakType: 'FB_BUC_01',
      sakId: '2266592',
      internasjonalSakId: 'abvcdefghijklm',
      sakUrl: 'http://foo.com',
      sistEndretDato: '2020-01-01',
      erSakseier: true,
      sensitiv: true,
      navinstitusjon: {
        id: "NO:NAVAT07",
        navn: "NAV ACC 07"
      },
      motparter: [
        {
          formatertNavn: "ACC_County Agency For Employment Bihor (Romania)",
          motpartId: "RO:70005",
          motpartNavn: "ACC_County Agency For Employment Bihor",
          motpartLandkode: "ROM"
        },
        {
          formatertNavn: "Test institusjon",
          motpartId: "RO:70005",
          motpartNavn: "Test institusjon",
          motpartLandkode: "ROM"
        }
      ],
      fagsak: {
        "tema": "KON",
        "type": "FAGSAK",
        "nr": "1/2023",
        "system": "AO11",
        "fnr": "12345678901"
      },
      sakshandlinger: [
        'H001', 'F002', 'F026', 'F027', 'X001', 'X005', 'X007', 'X008', 'X009', 'X012', 'Close_Case', 'singleParticipant', 'Delete_Case'
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
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          vedlegg: [
            {
              "id": "3666a09dee604440a44dc9a51abf685a",
              "navn": "Påminnelse.pdf",
              "sensitivt": true
            },
            {
              "id": "7b41e7ed544f4cd4b568dcbc48266cef",
              "navn": "Melding_anmodning_om_informasjon.pdf",
              "sensitivt": true
            },
            {
              "id": "8b81b7003e354d32ad9385876a948bea",
              "navn": "Melding_anmodning_om_informasjon.pdf",
              "sensitivt": false
            },
            {
              "id": "9bfabcd05fb9466693e55592bb8845fb",
              "navn": "H001.pdf",
              "sensitivt": true
            }
          ]
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
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete', "ReadParticipants"]
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
        },
        {
          sedTittel: 'Ugyldiggjøre SED 2',
          sedType: 'X008',
          status: 'new',
          sedId: 'x008cancelled2',
          sedIdParent: 'x008cancelled',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          sistEndretDato: '2020-01-03'
        },
        {
          sedTittel: 'Ugyldiggjøre SED 3',
          sedType: 'X008',
          status: 'new',
          sedId: 'x008cancelled3',
          sedIdParent: 'x008cancelled2',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          sistEndretDato: '2020-01-03'
        },
        {
          sedTittel: 'Ugyldiggjøre SED 4',
          sedType: 'X008',
          status: 'new',
          sedId: 'x008cancelled3´´',
          sedIdParent: 'x008cancelled3',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          sistEndretDato: '2020-01-03'
        },
        {
          sedTittel: 'Unntaksfeil',
          sedType: 'X050',
          status: 'new',
          sedId: 'x050cancelled',
          sedIdParent: 'f002sent',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          sistEndretDato: '2020-01-03'
        },
        {
          sedTittel: 'Unntaksfeil 2',
          sedType: 'X050',
          status: 'new',
          sedId: 'x050cancelled2',
          sedIdParent: 'x050cancelled',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          sistEndretDato: '2020-01-03'
        },
        {
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
    },
    {
      cdmVersjon: '4.2',
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
      erSakseier: false,
      sensitiv: false,
      navinstitusjon: {
        id: "NO:NAVAT07",
        navn: "NAV ACC 07"
      },
      motparter: [
        {
          formatertNavn: "ACC_County Agency For Employment Bihor (Romania)",
          motpartId: "RO:70005",
          motpartNavn: "ACC_County Agency For Employment Bihor",
          motpartLandkode: "ROM"
        }
      ],
      sakshandlinger: [
        'H001', 'X005', 'X007', 'X009', 'X012', 'Close_Case'
      ],
      fagsak: {
        "tema": "KON",
        "type": "FAGSAK",
        "nr": "1/2023",
        "system": "AO11",
        "fnr": "12345678901"
      },
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
      cdmVersjon: '4.2',
      fornavn: 'Ola',
      etternavn: 'Nordmenn',
      kjoenn: 'M',
      foedselsdato: '1970-01-01',
      fnr: '12345678901',
      sakTittel: 'Horisontal',
      sakType: 'UB_BUC_04',
      sakId: '398793',
      internasjonalSakId: "2663a13d3fa443ca8970be821c7ba2cc",
      sakUrl: 'https://rina-ss3-q.adeo.no/portal/#/caseManagement/398793?rightView=filtering',
      sistEndretDato: '2021-04-07',
      erSakseier: true,
      sensitiv: false,
      sakseier: {
        id: "NO:NAVAT07",
        navn: "NAV ACC 07"
      },
      navinstitusjon: {
        id: "NO:NAVAT07",
        navn: "NAV ACC 07"
      },
      motparter: [
        {
          formatertNavn: "ACC_County Agency For Employment Bihor (Romania)",
          motpartId: "RO:70005",
          motpartNavn: "ACC_County Agency For Employment Bihor",
          motpartLandkode: "ROM"
        }
      ],
      sakshandlinger: [
        'H001', 'X005', 'X007', 'X009', 'X012', 'Close_Case'
      ],
      fagsak: {
        "tema": "KON",
        "type": "FAGSAK",
        "nr": "1/2023",
        "system": "AO11",
        "fnr": "12345678901"
      },

      ikkeJournalfoerteSed: [
        "F001 - Anmodning om avgjørelse av kompetanse",
      ],
      sedUnderJournalfoeringEllerUkjentStatus : [
        "H001 - Melding/anmodning om informasjon",
      ],
      relaterteRinasakIder: [
        "161007",
        "161007",
        "161007",
      ],
      sedListe: [
        {
          sedTittel: 'Horizontal',
          sedType: 'H001',
          sedId: 'h001new',
          status: 'new',
          sistEndretDato: '2021-02-19',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete'],
          vedlegg: [
            {
              "id": "3666a09dee604440a44dc9a51abf685a",
              "navn": "Påminnelse.pdf",
              "sensitivt": true
            },
            {
              "id": "7b41e7ed544f4cd4b568dcbc48266cef",
              "navn": "Melding_anmodning_om_informasjon.pdf",
              "sensitivt": true
            },
            {
              "id": "8b81b7003e354d32ad9385876a948bea",
              "navn": "Melding_anmodning_om_informasjon.pdf",
              "sensitivt": false
            },
            {
              "id": "9bfabcd05fb9466693e55592bb8845fb",
              "navn": "H001.pdf",
              "sensitivt": true
            }
          ]
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
        },
        {
          sedTittel: 'F003 - Mottat',
          sedType: 'F003',
          sedId: 'f001mottatt',
          status: 'received',
          sistEndretDato: '2021-02-19',
          sedHandlinger: ['Read', 'Send', 'Delete'],
          manglerInformasjonOmEktefelleEllerAnnenPerson: false
        }
      ]
    },
    {
      cdmVersjon: '4.2',
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
      sensitiv: false,
      navinstitusjon: {
        id: "NO:NAVAT07",
        navn: "NAV ACC 07"
      },
      motparter: [
        {
          formatertNavn: "ACC_County Agency For Employment Bihor (Romania)",
          motpartId: "RO:70005",
          motpartNavn: "ACC_County Agency For Employment Bihor",
          motpartLandkode: "ROM"
        }
      ],
      sakshandlinger: [
        'H001', 'X005', 'X007', 'X009', 'X012', 'Close_Case'
      ],
      erSakseier: false,
      fagsak: {
        "tema": "KON",
        "type": "FAGSAK",
        "nr": "1/2023",
        "system": "AO11",
        "fnr": "12345678901"
      },
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
    },
    {
      cdmVersjon: '4.2',
      "fnr": "25086820857",
      "fornavn": "LEALAUS",
      "etternavn": "KOPP",
      "foedselsdato": "1968-08-25",
      "kjoenn": "K",
      "sakTittel": "Adhoc informasjonsutveksling",
      "sakType": "H_BUC_01",
      "sakId": "1442979",
      "internasjonalSakId": "2663a13d3fa443ca8970be821c7ba2cc",
      "erSakseier": false,
      "sensitiv": false,
      "sakUrl": "https://rina-ss1-q.adeo.no/portal_new/case-management/1442979",
      fagsak: {
        "tema": null,
        "type": "FAGSAK",
        "nr": "1/2023",
        "system": "AO11",
        "fnr": "12345678901"
      },
      "sistEndretDato": "2022-10-03",
      navinstitusjon: {
        id: "NO:NAVAT07",
        navn: "NAV ACC 07"
      },
      motparter: [
        {
          formatertNavn: "ACC_County Agency For Employment Bihor (Romania)",
          motpartId: "RO:70005",
          motpartNavn: "ACC_County Agency For Employment Bihor",
          motpartLandkode: "ROM"
        }
      ],
      "sakshandlinger": [
        "Close_Case",
        "X007",
        "X009"
      ],
      "sedListe": [
        {
          "sedTittel": "Melding/anmodning om informasjon",
          "sedType": "H001",
          "sedId": "e083f65f168442a1b838763048dc2977",
          "sedUrl": "https://rina-ss1-q.adeo.no/portal_new/case-management/1442979",
          "status": "received",
          "sistEndretDato": "2022-10-03",
          "sedHandlinger": [
            "Read",
            "ReadParticipants",
            "H002"
          ]
        },
        {
          "sedTittel": "Svar på anmodning om informasjon",
          "sedType": "H002",
          "sedId": "e11677f21a84434eac2ae0a5d937d2b5",
          "sedIdParent": "e083f65f168442a1b838763048dc2977",
          "sedUrl": "https://rina-ss1-q.adeo.no/portal_new/case-management/1442979",
          "status": "cancelled",
          "sistEndretDato": "2022-10-03",
          "sedHandlinger": [
            "Read"
          ]
        },
        {
          "sedTittel": "Ugyldiggjøre SED",
          "sedType": "X008",
          "sedId": "c02b02249c1841e8933eedd241a897d9",
          "sedIdParent": "e11677f21a84434eac2ae0a5d937d2b5",
          //"sedIdParent": "e083f65f168442a1b838763048dc2977",
          "sedUrl": "https://rina-ss1-q.adeo.no/portal_new/case-management/1442979",
          "status": "sent",
          "sistEndretDato": "2022-10-03",
          "sedHandlinger": [
            "Read"
          ]
        },
        {
          "sedTittel": "Ugyldiggjøre SED 2",
          "sedType": "X008",
          "sedId": "c02b02249c1841e8933eedd241a897d9",
          "sedIdParent": "e11677f21a84434eac2ae0a5d937d2b5",
          //"sedIdParent": "e083f65f168442a1b838763048dc2977",
          "sedUrl": "https://rina-ss1-q.adeo.no/portal_new/case-management/1442979",
          "status": "sent",
          "sistEndretDato": "2022-10-03",
          "sedHandlinger": [
            "Read"
          ]
        },
        {
          "sedTittel": "Svar på anmodning om informasjon",
          "sedType": "H001",
          "sedId": "e11677f21a84434eac2ae0a5d937d2xx",
          "sedIdParent": "e083f65f168442a1b838763048dc2977",
          "sedUrl": "https://rina-ss1-q.adeo.no/portal_new/case-management/1442979",
          "status": "sent",
          "sistEndretDato": "2022-11-03",
          "sedHandlinger": [
            "Read"
          ]
        },
      ]
    },
    {
      cdmVersjon: '4.2',
      fornavn: 'Ola',
      etternavn: 'Nordmenn',
      kjoenn: 'M',
      foedselsdato: '1970-01-01',
      fnr: '12345678901',
      adressebeskyttelse: 'STRENGT_FORTROLIG',
      sakTittel: 'Beslutte komponent myndighet',
      sakType: 'FB_BUC_04',
      sakId: '123456789',
      internasjonalSakId: 'abvcdefghijklm',
      sakUrl: 'http://foo.com',
      sistEndretDato: '2020-01-01',
      erSakseier: true,
      sensitiv: true,
      navinstitusjon: {
        id: "NO:NAVAT07",
        navn: "NAV ACC 07"
      },
      motparter: [
        {
          formatertNavn: "ACC_County Agency For Employment Bihor (Romania)",
          motpartId: "RO:70005",
          motpartNavn: "ACC_County Agency For Employment Bihor",
          motpartLand: "RO",
          motpartLandkode: "ROM"
        },
        {
          formatertNavn: "Test institusjon",
          motpartId: "RO:70005",
          motpartNavn: "Test institusjon",
          motpartLand: "RO",
          motpartLandkode: "ROM"
        }
      ],
      fagsak: {
        "tema": "KON",
        "type": "FAGSAK",
        "nr": "1/2023",
        "system": "AO11",
        "fnr": "12345678901"
      },
      sakshandlinger: [
        'Close_Case', 'singleParticipant', 'Delete_Case'
      ],
      sedListe: [
        {
          sedTittel: 'Description for sent F003',
          status: 'sent',
          sedType: 'F003',
          sedId: 'f003sent',
          sistEndretDato: '2024-01-02',
          sedHandlinger: ['Read', 'Update', 'Send', 'Delete']
        }
      ]
    },
    {
      "fnr": "25086820857",
      "fornavn": "LEALAUS",
      "etternavn": "KOPP",
      "foedselsdato": "1968-08-25",
      "kjoenn": "K",
      "adressebeskyttelse": "UGRADERT",
      "erSakseier": true,
      "sakseier": {
        "id": "NO:NAVAT07",
        "navn": "NAV ACC 07"
      },
      "navinstitusjon": {
        "id": "NO:NAVAT07",
        "navn": "NAV ACC 07"
      },
      "sakTittel": "Sammenlegging av perioder - ved sykdom, svangerskap eller fødsel",
      "sakType": "S_BUC_24",
      "sakId": "1451972",
      "internasjonalSakId": "798934cebe4d413b9a93a7a572345ffd",
      "sakUrl": "https://rina-ss1-q.adeo.no/portal_new/case-management/1451972",
      "sistEndretDato": "2025-04-14",
      "motparter": [
        {
          "formatertNavn": "NAV ACC 05 (Norge)",
          "motpartId": "NO:NAVAT05",
          "motpartNavn": "NAV ACC 05",
          "motpartLand": "NO",
          "motpartLandkode": "NOR"
        }
      ],
      "sakshandlinger": [
        "Delete_Case",
        "singleParticipant"
      ],
      "sedListe": [
        {
          "sedTittel": "Forespørsel om perioder - trygdeytelse: sykdom, svangerskap og fødsel.",
          "sedType": "S040",
          "sedId": "d1ea214561ce4bcaa3bad3651fe15624",
          "status": "new",
          "sistEndretDato": "2025-04-14",
          "sedHandlinger": [
            "Update",
            "Delete",
            "Read",
            "Send"
          ]
        }
      ],
      "fagsak": {
        "tema": "SYM",
        "type": "GENERELL_SAK",
        "system": "FS22",
        "fnr": "25086820857"
      },
      "sensitiv": false,
      "cdmVersjon": "4.3"
    },
    {
      "fnr": "28506726605",
      "fornavn": "KORREKT",
      "etternavn": "INNHEGNING",
      "foedselsdato": "1967-10-28",
      "kjoenn": "K",
      "adressebeskyttelse": "UGRADERT",
      "erSakseier": true,
      "sakseier": {
        "id": "NO:NAVAT07",
        "navn": "NAV ACC 07"
      },
      "navinstitusjon": {
        "id": "NO:NAVAT07",
        "navn": "NAV ACC 07"
      },
      "sakTittel": "Informasjon om hvorvidt det er utbetalt kontantytelser ved arbeidsuførhet",
      "sakType": "S_BUC_14",
      "sakId": "1452402",
      "internasjonalSakId": "e42581455ddd4e09802715ddbb32d3ab",
      "sakUrl": "https://rina-ss1-q.adeo.no/portal_new/case-management/1452402",
      "sistEndretDato": "2025-06-23",
      "motparter": [
        {
          "formatertNavn": "NAV ACC 05 (Norge)",
          "motpartId": "NO:NAVAT05",
          "motpartNavn": "NAV ACC 05",
          "motpartLand": "NO",
          "motpartLandkode": "NOR"
        }
      ],
      "sakshandlinger": [
        "Delete_Case",
        "singleParticipant"
      ],
      "sedListe": [
        {
          "sedTittel": "Informasjon om utbetaling eller ikke utbetaling av kontantytelser",
          "sedType": "S046",
          "sedId": "805ca15c55314e278d8304349bd33096",
          "status": "new",
          "sistEndretDato": "2025-06-23",
          "sedHandlinger": [
            "Delete",
            "Read",
            "Send",
            "Update"
          ]
        }
      ],
      "fagsak": {
        "tema": "SYK",
        "type": "GENERELL_SAK",
        "fnr": "28506726605"
      },
      "sensitiv": false,
      "cdmVersjon": "4.3"
    },

    {
      "fnr": "14086025796",
      "fornavn": "Vet Ikke",
      "etternavn": "Uklart",
      "foedselsdato": "1980-03-07",
      "kjoenn": "K",
      "adressebeskyttelse": "UGRADERT",
      "erSakseier": false,
      "sakseier": {
        "id": "NO:NAVAT05",
        "navn": "NAV ACC 05"
      },
      "navinstitusjon": {
        "id": "NO:NAVAT07",
        "navn": "NAV ACC 07"
      },
      "sakTittel": "Beslutte kompetent myndighet",
      "sakType": "FB_BUC_01",
      "sakId": "1451323",
      "internasjonalSakId": "526fdb2aa00142fda4e24bd64839e2de",
      "sakUrl": "https://rina-ss1-q.adeo.no/portal_new/case-management/1451323",
      "sistEndretDato": "2025-07-30",
      "motparter": [
        {
          "formatertNavn": "NAV ACC 05 (NO)",
          "motpartId": "NO:NAVAT05",
          "motpartNavn": "NAV ACC 05",
          "motpartLand": "NO",
          "motpartLandkode": "NOR"
        }
      ],
      "sakshandlinger": [
        "X005",
        "X007",
        "X009",
        "H001",
        "H003",
        "H004",
        "H005",
        "H010",
        "H011",
        "H061",
        "H065",
        "H070",
        "H120",
        "H121",
        "F004",
        "F022",
        "F023",
        "F026"
      ],
      "sedListe": [
        {
          "sedTittel": "Svar om avgjørelse av kompetanse",
          "sedType": "F002",
          "sedId": "111f0543711146da8cf2958bea08995a",
          "sedIdParent": "12f40e1ab72e42878af78a895a8ea13f",
          "status": "new",
          "sistEndretDato": "2025-07-30",
          "svarsedType": null,
          "svarsedId": null,
          "sedHandlinger": [
            "Delete",
            "Read",
            "Send",
            "Update"
          ],
          "vedlegg": [
            {
              "id": "409f10dfe006418fa686c4def4a20c0f",
              "navn": "Forespørsel_om_perioder_-_trygdeytelse:_sykdom__svangerskap_og_fødsel..pdf",
              "sensitivt": false
            },
            {
              "id": "dc58f2c46064462babca20c7c5c77798",
              "navn": "Svar_om_avgjørelse_av_kompetanse.pdf",
              "sensitivt": false
            }
          ],
          "manglerInformasjonOmEktefelleEllerAnnenPerson": false,
          "fagsak": {
            "tema": "KON",
            "type": "FAGSAK",
            "nr": null,
            "fnr": "28506726605",
            "system": "IT01"
          }
        },
        {
          "sedTittel": "Svar på mer informasjon",
          "sedType": "F027",
          "sedId": "92d5c100bca24eb49dc99d5d143ed147",
          "sedIdParent": null,
          "status": "new",
          "sistEndretDato": "2025-06-24",
          "svarsedType": null,
          "svarsedId": null,
          "sedHandlinger": [
            "Update",
            "Delete",
            "Read",
            "Participants_Send"
          ],
          "vedlegg": [
            {
              "id": "64f96d0e101e40f28a46a9311664b2a0",
              "navn": "Melding_anmodning_om_informasjon.pdf",
              "sensitivt": false
            },
            {
              "id": "df59a9b5188b4f3b961b98045a3c38c9",
              "navn": "Klargjør_innhold.pdf",
              "sensitivt": false
            }
          ],
          "manglerInformasjonOmEktefelleEllerAnnenPerson": false,
          "fagsak": {
            "tema": "KON",
            "type": "FAGSAK",
            "nr": null,
            "fnr": "28506726605",
            "system": "IT01"
          }
        },
        {
          "sedTittel": "Anmodning om avgjørelse av kompetanse",
          "sedType": "F001",
          "sedId": "12f40e1ab72e42878af78a895a8ea13f",
          "sedIdParent": null,
          "status": "received",
          "sistEndretDato": "2025-02-03",
          "svarsedType": null,
          "svarsedId": null,
          "sedHandlinger": [
            "Read",
            "ReadParticipants"
          ],
          "vedlegg": [],
          "manglerInformasjonOmEktefelleEllerAnnenPerson": true,
          "fagsak": {
            "tema": "BAR",
            "type": "FAGSAK",
            "nr": "0331A01",
            "fnr": "1768259612910",
            "system": "IT01"
          }
        }
      ],
      "fagsak": {
        "tema": "KON",
        "type": "FAGSAK",
        "nr": null,
        "fnr": "28506726605",
        "system": "IT01"
      },
      "journalpoststatus": null,
      "relaterteRinasakIder": [],
      "ikkeJournalfoerteSed": [],
      "sedUnderJournalfoeringEllerUkjentStatus": [],
      "sensitiv": false,
      "cdmVersjon": "4.3"
    }
  ]

  if (type === 'saksnummer') {
    const sak: Sak | undefined = _.find(saks, {sakId: saksnummer})
    if (sak) {
      return sak
    }
    return [saks[0]]
  }

  return saks
}
