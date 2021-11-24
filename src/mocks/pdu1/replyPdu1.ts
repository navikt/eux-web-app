export default {
  type: 'PDU1',
  bruker: {
    personInfo: {
      fornavn: 'Homer',
      etternavn: 'Simpson',
      kjoenn: 'M',
      foedselsdato: '2001-01-01',
      statsborgerskap: [
        {
          land: 'NO'
        }
      ],
      pin: [
        {
          land: 'NO',
          sektor: 'yrkesskade_og_yrkessykdom',
          identifikator: '1000000000001',
          institusjonsid: 'ES:3100',
          institusjonsnavn: 'æøå'
        }
      ],
      pinmangler: {
        foedested: {
          by: 'Springfield',
          region: 'Springfield',
          land: 'USA'
        },
        far: {
          fornavn: 'Grandpa Simpson',
          etternavnvedfoedsel: 'Simpson'
        },
        mor: {
          fornavn: 'Grandma Simpson',
          etternavnvedfoedsel: 'Simpson'
        },
        etternavnvedfoedsel: 'Simpson',
        fornavnvedfoedsel: 'Homer'
      }
    }
  },
  perioderAnsattMedForsikring: [
    {
      arbeidsgiver: {
        navn: 'æøå',
        adresse: {
          gate: 'æøå',
          postnummer: 'æøå',
          by: 'æøå',
          land: 'NO',
          bygning: 'æøå',
          region: 'æøå',
          type: 'bodsted'
        },
        identifikatorer: [
          {
            type: 'organisasjonsnummer',
            id: 'ES:3100'
          }
        ]
      },
      sluttdato: '2002-02-02',
      startdato: '2001-01-01'
    }
  ],
  perioderAnsattUtenForsikring: [
    {
      inntektOgTimer: [],
      inntektOgTimerInfo: 'inntekt og timer info',
      arbeidsgiver: {
        navn: 'æøå',
        adresse: {
          gate: 'æøå',
          postnummer: 'æøå',
          by: 'æøå',
          land: 'NO',
          bygning: 'æøå',
          region: 'æøå',
          type: 'bodsted'
        },
        identifikatorer: [
          {
            type: 'organisasjonsnummer',
            id: 'ES:3100'
          }
        ]
      },
      sluttdato: '2002-02-02',
      startdato: '2001-01-01'
    }
  ],

  grunntilopphor: {
    typeGrunnOpphoerAnsatt: '01',
    annenGrunnOpphoerAnsatt: 'annen',
    grunnOpphoerSelvstendig: 'grunn'
  },
  rettTilYtelse: {
    bekreftelsesgrunn: 'artikkel_64_i_forordning_EF_nr_883_2004',
    periode: {
      startdato: '2001-01-01',
      aapenPeriodeType: 'åpen_sluttdato'
    },
    avvisningsgrunn: 'ingen_rett_til_stønad_i_henhold_til_lovgivningen_til_institusjonen_som_utsteder_denne_meldingen'
  }
}
