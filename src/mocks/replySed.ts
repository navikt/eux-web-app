export default {
  sedType: 'U002',
  sedVersjon: '4.2',
  bruker: {
    personInfo: {
      fornavn: 'æøå',
      etternavn: 'æøå',
      kjoenn: 'M',
      foedselsdato: 'æøå',
      statsborgerskap: [
        {
          land: 'NO'
        }
      ],
      pin: [
        {
          land: 'NO',
          sektor: 'yrkesskade_og_yrkessykdom',
          identifikator: '02026100715',
          institusjonsid: 'æøå',
          institusjonsnavn: 'æøå'
        }
      ],
      pinmangler: {
        foedested: {
          by: 'æøå',
          region: 'æøå',
          land: 'NO'
        },
        far: {
          fornavn: 'æøå',
          etternavnvedfoedsel: 'æøå'
        },
        mor: {
          fornavn: 'æøå',
          etternavnvedfoedsel: 'æøå'
        },
        etternavnvedfoedsel: 'æøå',
        fornavnvedfoedsel: 'æøå'
      }
    }
  },
  anmodningsperiode: {
    fastperiode: {
      startdato: '2020-01-01',
      sluttdato: '2020-12-31'
    },
    aapenperiode: {
      startdato: 'æøå',
      type: 'åpen_sluttdato'
    }
  },
  lokaleSakIder: [
    {
      saksnummer: 'æøå',
      institusjonsnavn: 'æøå',
      institusjonsid: 'æøå',
      land: 'NO'
    }
  ],
  dagpengeperioder: [
    {
      periode: {
        fastperiode: {
          startdato: 'æøå',
          sluttdato: 'æøå'
        },
        aapenperiode: {
          startdato: 'æøå',
          type: 'åpen_sluttdato'
        }
      },
      institusjon: {
        navn: 'æøå',
        id: 'æøå',
        idmangler: {
          navn: 'æøå',
          adresse: {
            gate: 'æøå',
            postnummer: 'æøå',
            by: 'æøå',
            land: 'NO',
            bygning: 'æøå',
            region: 'æøå'
          }
        }
      }
    }
  ],
  ansattmedforsikring: [
    {
      arbeidsgiver: {
        navn: 'æøå',
        adresse: {
          gate: 'æøå',
          postnummer: 'æøå',
          by: 'æøå',
          land: 'NO',
          bygning: 'æøå',
          region: 'æøå'
        },
        identifikator: [
          {
            type: 'registrering',
            id: 'æøå'
          }
        ]
      }
    }
  ],
  selvstendigmedforsikring: [
    {
      arbeidsgiver: {
        navn: 'æøå',
        adresse: {
          gate: 'æøå',
          postnummer: 'æøå',
          by: 'æøå',
          land: 'NO',
          bygning: 'æøå',
          region: 'æøå'
        },
        identifikator: [
          {
            type: 'registrering',
            id: 'æøå'
          }
        ]
      }
    }
  ],
  ansattutenforsikring: [
    {
      arbeidsgiver: {
        navn: 'æøå',
        adresse: {
          gate: 'æøå',
          postnummer: 'æøå',
          by: 'æøå',
          land: 'NO',
          bygning: 'æøå',
          region: 'æøå'
        },
        identifikator: [
          {
            type: 'registrering',
            id: 'æøå'
          }
        ]
      },
      kreverinformasjonomtypearberidsforhold: 'ja',
      kreverinformasjonomantallarbeidstimer: 'ja',
      kreverinformasjonominntekt: 'ja'
    }
  ],
  selvstendigutenforsikring: [
    {
      arbeidsgiver: {
        navn: 'æøå',
        adresse: {
          gate: 'æøå',
          postnummer: 'æøå',
          by: 'æøå',
          land: 'NO',
          bygning: 'æøå',
          region: 'æøå'
        },
        identifikator: [
          {
            type: 'registrering',
            id: 'æøå'
          }
        ]
      },
      kreverinformasjonomtypearberidsforhold: 'ja',
      kreverinformasjonomantallarbeidstimer: 'ja',
      kreverinformasjonominntekt: 'ja'
    }
  ]
}
