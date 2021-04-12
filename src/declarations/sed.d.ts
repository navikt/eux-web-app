
export type AdresseType = 'bosted' | 'opphold' | 'kontakt' | 'annet'

export type BarnRelasjon = '01' | '02' | '03' | '04'

export type BarnRelasjonType = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08'

export type RelasjonType = 'BARN' |'EKTE' | 'REPA' | 'SAMB' | 'ANNEN'

export type Kjoenn = 'K' | 'M' | 'U'

export type TelefonType = 'arbeid' | 'hjemme' | 'mobil'

export type ReplySed = F002Sed | U002Sed | U004Sed | U017Sed

export type JaNei = 'ja' | 'nei'

export interface Adresse {
  by?: string
  bygning?: string
  gate?: string
  land?: string
  postnummer?: string
  region?: string
  type?: AdresseType
}

export interface Periode {
  startdato: string
  sluttdato?: string
  aapenPeriodeType?: string
}

export interface Aktivitet {
  perioderMedAktivitet?: {
    type: string
    perioder: Array<Periode>
  }
  perioderUtenAktivitet?: {
    type: string
    perioder: Array<Periode>
  }
  perioderUkjentAktivitet?: {
    ytterligereinfo: string
    perioder: Array<Periode>
  }
}

export interface PensjonPeriode {
  pensjonstype: string
  periode: Periode
}

export interface Arbeidsgiver {
  arbeidsgiver: {
    navn: string
    adresse?: Adresse
    identifikator: Array<{
      type: string
      id: string
    }>
    periode: Periode
    typeTrygdeforhold: string
  }
  kreverinformasjonomtypearberidsforhold?: string
  kreverinformasjonomantallarbeidstimer?: string
  kreverinformasjonominntekt?:string
}

export interface Epost {
  adresse: string
}

export interface Flyttegrunn {
  datoFlyttetTilAvsenderlandet: string
  datoFlyttetTilMottakerlandet: string
  perioder: Array<Periode>
  personligSituasjon: string
}

export interface FamilieRelasjon2 {
  annenRelasjonDato: string
  annenRelasjonPersonNavn: string
  annenRelasjonType: string
  borSammen: string
  periode: Periode
  relasjonInfo: string
  relasjonType?: RelasjonType
}

export interface Pin {
  land ?: string
  sektor ?: string
  identifikator ?: string
  institusjonsid ?: string
  institusjonsnavn ?: string
}

export interface Statsborgerskap {
  land: string,
  fradato?: string
}

export interface PersonInfo {
  fornavn: string
  etternavn: string
  kjoenn: Kjoenn
  foedselsdato: string
  statsborgerskap: Array<Statsborgerskap>
  pin: Array<Pin>
  pinMangler?: {
    foedested: {
      by: string
      region: string
      land: string
    }
    far: {
      fornavn: string
      etternavnVedFoedsel: string
    }
    mor: {
      fornavn: string
      etternavnVedFoedsel: string
    }
    etternavnVedFoedsel: string
    fornavnVedFoedsel: string
  }
}

export interface Person {
  adresser ?: Array<Adresse>
  aktivitet ?: Aktivitet
  epost ?: Array<Epost>
  familierelasjoner ?: Array<FamilieRelasjon2>
  flyttegrunn ?: Flyttegrunn
  ikkeRettTilYtelser ?: {
    typeGrunn: string
    typeGrunnAnnen: string
  }
  perioderMedArbeid ?: Array<Periode>
  perioderMedITrygdeordning ?: Array<Periode>
  perioderMedPensjon ?: Array<PensjonPeriode>
  periodeMedTrygd ?: Array<Periode>
  periodeMedYtelser ?: Array<Periode>
  perioderUtenforTrygdeordning ?: Array<Periode>
  personInfo: PersonInfo
  telefon ?: Array<Telefon>
  ytterligereInfo ?: string
}

export interface Telefon {
  type: TelefonType
  nummer: string
}

export interface Utbetaling {
  barnetsNavn?: string
  begrunnelse?: string
  beloep: string
  mottakersNavn: string
  sluttdato: string
  startdato: string
  utbetalingshyppighet?: string
  valuta: string
  vedtaksdato?: string
  ytelseNavn?: string
  ytterligereInfo?: string
}

export interface BaseReplySed {
  bruker: Person
  saksnummer ?: string
  svarSedId?: string
  svarsedDisplay?: string
  svarsedType?: string
  sedType: string
  sedVersjon: string
}

export interface USed extends BaseReplySed {
  anmodningsperiode: Periode
  lokaleSakIder: Array<{
    saksnummer: string
    institusjonsnavn: string
    institusjonsid: string
    land: string
  }>
}

export interface FSed extends BaseReplySed {
  anmodningsperioder: Array<Periode>
  formaal: Array<string>
}

export interface F002Sed extends FSed {
  annenPerson: Person
  barn: Array<{
    adresser?: Array<Adresse>
    barnetilhoerigheter?: Array<{
      borIBrukersHushold: JaNei
      borIEktefellesHushold: JaNei
      borIAnnenPersonsHushold: JaNei
      borPaaInstitusjon: JaNei
      erDeltForeldreansvar: JaNei
      relasjonTilPerson: BarnRelasjon
      relasjonType?: BarnRelasjonType
      periode: Periode
    }>
    flyttegrunn?: Flyttegrunn
    personInfo: PersonInfo
    motregning?: Utbetaling
    ytelse?: Utbetaling
  }>
  ektefelle: Person
  endredeForhold: Array<string>
  familie: {
    motregninger: Array<Utbetaling>
    ytelser: Array<Utbetaling>
  }
  krav: {
    infoPresisering: string
    infoType: string
    kravMottattDato: string
    kravType: string
  }
  utbetalingTilInstitusjon: {
    begrunnelse: string
    id: string
    navn: string
    kontoOrdinaer: {
      bankensNavn: string
      kontonummer: string
      adresse: Adresse
      swift: string
    }
  }
}

export interface U002Sed extends USed {
  perioderAnsattMedForsikring: Array<Arbeidsgiver>
  sisteAnsettelseInfo: {
    annenGrunnOpphoerAnsatt: string
    grunnOpphoerSelvstendig: string
    opphoerRettighet: string
    opphoerYtelse: string
    typeGrunnOpphoerAnsatt: string
    utbetalinger: Array<{
      beloep: string
      feriedagerTilGode: string
      loennTilDato: string
      utbetalingType: string
      valuta: string
    }>
  }
}

export interface U004Sed extends USed {
  loennsopplysninger?: Array<{
    periode: Periode
    ansettelsestype?: string
    inntekter: Array<{
      type: string
      typeAnnen?: string
      beloep: string
      valuta: string
    }>
    arbeidsdager?: string
    arbeidstimer?: string
  }>
}

export interface U017Sed extends USed {
  perioderAnsattMedForsikring?: Array<Arbeidsgiver>
  rettTilYtelse?: {
    bekreftelsesgrunn: string
    periode: Periode
    avvisningsgrunn: string
  }
}
