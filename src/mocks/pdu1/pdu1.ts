export default {
  saksreferanse: '123412341234',
  dato: '12. nov 2021',
  bruker: {
    fnr: '01015000232',
    kjoenn: 'M',
    fornavn: 'Per',
    etternavn: 'Person',
    foedselsdato: '11 feb. 2001',
    statsborgerskap: ['NO', 'SE'],
    utenlandskePin: [
      'SE 680825-1126'
    ],
    etternavnVedFoedsel: 'Lilleungen',
    adresse: {
      gate: 'Omvei 1',
      postnr: '1234',
      poststed: 'Poststedet',
      land: 'NO'
    }
  },
  nav: {
    enhetNavn: 'Nav kontoret',
    enhetId: '4404',
    adresse: {
      gate: 'Navgata 1',
      postnr: '0000',
      poststed: 'Naveren',
      land: 'NO'
    },
    tlf: '001 113',
    saksbehandler: {
      navn: 'Thomas',
      enhet: 'Nav Eessi'
    }
  },
  info: 'Melding til bruker.<br/> med mange linjer.. <br/> 1<br/>2<br/>3<br/> ..for å se at avsender <br/>ikke <br/>dyttes nedover og <br/>over til nesteside.',
  perioderAnsattMedForsikring: [
    {
      startdato: '2001-01-01',
      sluttdato: '2002-02-02'
    },
    {
      startdato: '2003-03-03',
      sluttdato: '2004-04-04'
    },
    {
      startdato: '2005-05-05',
      sluttdato: '2006-06-06'
    }
  ],
  perioderSelvstendigMedForsikring: [
    {
      startdato: '2011-01-01',
      sluttdato: '2012-02-02'
    },
    {
      startdato: '2013-03-03',
      sluttdato: '2014-04-04'
    }
  ],
  perioderAnsattUtenForsikring: [
    {
      startdato: '2011-01-01',
      sluttdato: '2012-02-02',
      aktivitetstype: 'aktivitet...1'
    },
    {
      startdato: '2013-03-03',
      sluttdato: '2014-04-04',
      aktivitetstype: 'aktivitet...2'
    }
  ],
  perioderSelvstendigUtenForsikring: [
    {
      startdato: '2011-01-01',
      sluttdato: '2012-02-02',
      aktivitetstype: 'aktivitet...1'
    },
    {
      startdato: '2013-03-03',
      sluttdato: '2014-04-04',
      aktivitetstype: 'aktivitet...2'
    }
  ],
  perioderAndreForsikringer: [
    {
      startdato: '2011-01-01',
      sluttdato: '2012-02-02',
      type: 'sykdom'
    },
    {
      startdato: '2013-03-03',
      sluttdato: '2014-04-04',
      type: 'syk'
    },
    {
      startdato: '2013-03-03',
      sluttdato: '2014-04-04',
      type: 'frihetsberoevet'
    },
    {
      startdato: '2013-03-03',
      sluttdato: '2014-04-04',
      type: 'utdanning'
    },
    {
      startdato: '2013-03-03',
      sluttdato: '2014-04-04',
      type: 'militaertjeneste'
    },
    {
      startdato: '2013-03-03',
      sluttdato: '2014-04-04',
      type: 'dagpenger'
    },
    {
      startdato: '2013-03-03',
      sluttdato: '2014-04-04',
      type: 'annet'
    }
  ],
  perioderAnsettSomForsikret: [
    {
      startdato: '2001-01-01',
      sluttdato: '2002-02-02',
      begrunnelse: 'Sykdom'
    },
    {
      startdato: '2003-03-03',
      sluttdato: '2004-04-04',
      begrunnelse: 'Under utdanning'
    }
  ],
  opphoer: {
    typeGrunnOpphoerAnsatt: 'oppsagt_av_arbeidsgiver',
    annenGrunnOpphoerAnsatt: 'æøå',
    annenGrunnOpphoerSelvstendig: 'æøå'
  },
  perioderLoennSomAnsatt: [
    {
      startdato: '2010-01-01',
      sluttdato: '2020-02-02',
      loenn: '30 000 pr mnd'
    }
  ],
  perioderInntektSomSelvstendig: [
    {
      startdato: '2010-01-01',
      sluttdato: '2020-02-02',
      inntekt: 'lommerusk og vekslepenger'
    }
  ],
  andreMottatteUtbetalinger: {
    utbetalingEtterEndtArbeidsforhold: '100 NOK',
    kompensasjonForEndtArbeidsforhold: '100 NOK',
    kompensasjonForFeriedager: {
      antallDager: '5',
      beloep: '100 NOK'
    },
    avkallKompensasjonBegrunnelse: 'Hadde glemt det',
    andreYtelserSomMottasForTiden: 'Lett lufting'
  },
  perioderDagpengerMottatt: [
    {
      startdato: '2011-01-01',
      sluttdato: '2012-02-02'
    },
    {
      startdato: '2013-03-03',
      sluttdato: '2014-04-04'
    }
  ],
  rettTilDagpenger: {
    startdato: '2013-03-03',
    sluttdato: '2014-04-04',
    ihhTilArtikkel64: 'ja',
    ihhTilArtikkel65: 'ja'
  },
  ikkeRettTilDagpenger: {
    ihhTilLovgivning: 'ja',
    ikkeSoekt: 'ja'
  }
}