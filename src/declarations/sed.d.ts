export type AdresseType = 'bosted' | 'opphold' | 'kontakt' | 'annet'

export type BarnRelasjon = '01' | '02' | '03' | '04'

export type BarnRelasjonType = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08'

export type RelasjonType = 'BARN' |'EKTE' | 'REPA' | 'SAMB' | 'ANNEN'

export type Kjoenn = 'K' | 'M' | 'U'

export type TelefonType = 'arbeid' | 'hjemme' | 'mobil'

export type ReplySed = F002Sed | U002Sed | U004Sed | U017Sed | H002Sed

export type SedTypes = 'F002' | 'U002' | 'U004' | 'U017' | 'H002'

export type SedCategory = 'perioderMedArbeid' | 'perioderMedTrygd' |
  'perioderMedYtelser' | 'perioderMedPensjon'

export type JaNei = 'ja' | 'nei'

export type PensjonsType = 'alderspensjon' | 'uførhet'

export type YtelseNavn = 'Barnetrygd' | 'Kontantstøtte'

export type Utbetalingshyppighet = 'Månedlig'| 'Årlig'

export type HSvarType = 'positivt' | 'negative'

export type BarnaEllerFamilie = 'barna' | 'familie'

export type AnmodningSvarType = 'anmodning_om_motregning_per_barn' | 'svar_om_anmodning_om_motregning_per_barn'

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
  personligSituasjon?: string
}

export interface FamilieRelasjon {
  annenRelasjonDato?: string
  annenRelasjonPersonNavn?: string
  annenRelasjonType?: string
  borSammen?: JaNei
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
  fraDato?: string
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
  epost ?: Array<Epost>
  familierelasjoner ?: Array<FamilieRelasjon>
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
  perioderSomAnsatt?: Array<Periode>
  perioderSomSelvstendig?: Array<Periode>
  perioderSomSykMedLoenn?: Array<Periode>
  perioderSomPermittertMedLoenn?: Array<Periode>
  perioderSomPermittertUtenLoenn?: Array<Periode>
  personInfo: PersonInfo
  telefon ?: Array<Telefon>
  ytterligereInfo ?: string
}

export interface Telefon {
  type: TelefonType
  nummer: string
}

export interface Ytelse {
  beloep: string
  mottakersNavn: string
  sluttdato: string
  startdato: string
  utbetalingshyppighet: Utbetalingshyppighet
  valuta: string
  ytelseNavn: string
  barnetsNavn?: string
}

export interface Motregning {
  barnetsNavn?: string
  begrunnelse: string
  beloep: string
  mottakersNavn: string
  svarType?: AnmodningSvarType
  sluttdato: string
  startdato: string
  utbetalingshyppighet: Utbetalingshyppighet
  valuta: string
  vedtaksdato: string
  ytelseNavn?: string
  ytterligereInfo: string
}

export interface BaseReplySed {
  bruker: Person
  sedType: string
  sedVersjon: string
  // added
  saksnummer ?: string
  sedUrl ?: string
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

export interface HSvar {
  informasjon: string
  dokument:string
  sed: string
  grunn?: string
}

export interface HSed extends BaseReplySed {
  vedlagteDokumenttyper: {
    dokumenttyper: Array<string>
    andreDokumenttyper: Array<string>
  }
  positivtSvar: HSvar,
  negativeSvar: HSvar
  ytterligereInfo: string
  tema?: string
}

export interface Barnetilhoerighet {
  borIBrukersHushold: JaNei
  borIEktefellesHushold: JaNei
  borIAnnenPersonsHushold: JaNei
  borPaaInstitusjon: JaNei
  erDeltForeldreansvar: JaNei
  relasjonTilPerson: BarnRelasjon
  relasjonType?: BarnRelasjonType
  periode: Periode
}

export interface NavnOgBetegnelse {
  navn: string
  betegnelsePåYtelse: string
}

export interface KontoOrdinaer {
  bankensNavn?: string
  kontonummer?: string
  adresse?: Adresse
  swift: string
  iban: string
  sepaKonto?: JaNei
}

export interface UtbetalingTilInstitusjon {
  begrunnelse: string
  id: string
  navn: string
  kontoOrdinaer: KontoOrdinaer
}

export interface PeriodeMedVedtak {
  periode: Periode
  vedtak: string
}

export interface Grunn {
  grunn: string
  person: Array<string>
}

export interface XXXFormalVedtak {
  barn: Array<string>
  periode: Periode,
  type: string
  grunnen: string
  vedtaksperioder: Array<PeriodeMedVedtak>
}

export interface XXXFormalProsedyreVedUenighet {
  grunner: Array<Grunn>
  ytterligereInfo: string
}

export interface XXXFormalKravOmRefusjon {
  krav: string
}

export interface XXXSisteAnsettelsesForhold {
  beloep: string
  valuta: string
  mottattDato: string
  antallDager: string
  avkall: string
  grunn: string
  annenYtelser: string
}

export interface Barn {
  adresser?: Array<Adresse>
  barnetilhoerigheter?: Array<Barnetilhoerighet>
  flyttegrunn?: Flyttegrunn
  personInfo: PersonInfo
  motregning?: Motregning
  ytelse?: Ytelse
}

export interface F002Sed extends FSed {
  annenPerson: Person
  barn: Array<Barn>
  ektefelle: Person
  endredeForhold: Array<string>
  familie: {
    motregning?: Motregning
    ytelse?: Ytelse
  }
  krav: {
    infoPresisering: string
    infoType: string
    kravMottattDato: string
    kravType: string
  }
  utbetalingTilInstitusjon: UtbetalingTilInstitusjon
  xxxformaal?: {
    vedtak?: XXXFormalVedtak
    prosedyreveduenighet?: XXXFormalProsedyreVedUenighet
    kravomrefusjon?: XXXFormalKravOmRefusjon
  }
}

export interface U002Sed extends USed {
  perioderAnsattMedForsikring: Array<Arbeidsgiver>
  xxxsisteAnsettelsesForhold: XXXSisteAnsettelsesForhold
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

export interface H002Sed extends HSed {}
