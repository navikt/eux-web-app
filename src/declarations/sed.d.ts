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

export type GrunnUenighet = 'bosted' | 'medlemsperiode' | 'personligSituasjon'| 'pensjon' | 'oppholdetsVarighet' | 'ansettelse'

export type ArbeidsgiverIdentifikatorType = 'organisasjonsnummer' | 'trygd' | 'skattemessig' | 'ukjent'

export type PeriodeInputType = 'simple' | 'withcheckbox'

export type PeriodeType = 'ansettelsesforhold' | 'selvstendig_næringsvirksomhet'

export type KontoType = 'sepa' | 'ordinaer'

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
  // internal use, for periode labeling
  __type ?: string
  __index ?: number
}

export interface PensjonPeriode {
  pensjonstype: string
  periode: Periode
}

export interface ArbeidsgiverIdentifikator {
  type: ArbeidsgiverIdentifikatorType
  id: string
}

export interface ArbeidsgiverWithAdresse {
  navn: string
  adresse?: Adresse
  identifikator: Array<ArbeidsgiverIdentifikator>
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
  perioderMedTrygd ?: Array<Periode>
  perioderMedYtelser ?: Array<Periode>
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
  antallPersoner?: string
  beloep: string
  mottakersNavn: string
  sluttdato: string
  startdato: string
  utbetalingshyppighet: Utbetalingshyppighet
  valuta: string
  ytelseNavn: string
}

export interface Motregning {
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

export interface HSvar {
  informasjon: string
  dokument: string
  sed: string
  grunn?: string
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

export interface KontoOrdinaer {
  bankensNavn?: string
  kontonummer?: string
  adresse?: Adresse
  swift: string
}

export interface KontoSepa {
  swift: string
  iban: string
}

export interface UtbetalingTilInstitusjon {
  begrunnelse: string
  id: string
  navn: string
  kontoOrdinaer?: KontoOrdinaer
  kontoSepa?: KontoSepa
}

export interface Grunn {
  grunn: string
  person: string
}

export interface VedtakPeriode {
  periode: Periode
  skalYtelseUtbetales?: JaNei
}

export interface VedtakBarn {
  fornavn: string
  etternavn: string
  foedselsdato: string

}

export interface Vedtak {
  innhold: string
  ytterligereInfo: string
  vedtakstype: string
  vedtaksdato: string
  begrunnelse: string
  primaerkompetanseArt58: Array<VedtakPeriode>
  sekundaerkompetanseArt58: Array<VedtakPeriode>,
  primaerkompetanseArt68: Array<VedtakPeriode>,
  sekundaerkompetanseArt68: Array<VedtakPeriode>,
  vedtaksperioder: Array<Periode>,
  barnVedtaketOmfatter: Array<VedtakBarn>
  gjelderAlleBarn: JaNei
}

export interface ProsedyreVedUenighet {
  bosted?: string
  medlemsperiode?: string
  personligSituasjon?: string
  pensjon?: string
  oppholdetsVarighet?: string
  ansettelse?: string
  ytterligereGrunner?: string
}

export interface Utbetaling {
  utbetalingType: string// typebeløp
  loennTilDato: string // mottattdato
  feriedagerTilGode: string // antallDager
  valuta: string
  beloep: string
}

export interface SisteAnsettelsesForhold {
  opphoerRettighet: string // Avkall
  opphoerRettighetGrunn: string // grunn
  opphoerYtelse: string // annenYtelser
  utbetalinger: Array<Utbetaling>
}

export interface GrunnTilOpphør {
  typeGrunnOpphoerAnsatt: string
  annenGrunnOpphoerAnsatt: string
  grunnOpphoerSelvstendig: string
}

export interface Barn {
  adresser?: Array<Adresse>
  barnetilhoerigheter?: Array<Barnetilhoerighet>
  flyttegrunn?: Flyttegrunn
  personInfo: PersonInfo
  motregninger?: Array<Motregning>
  ytelser?: Array<Ytelse>
}

export interface Institusjon {
  navn: string
  id: string
  idmangler?: {
    navn: string
    adresse: Adresse
  }
}

export interface PeriodeDagpenger {
  periode: Periode,
  institusjon: Institusjon
}

export interface Inntekt {
  type: string
  typeAnnen?: string
  beloep: string
  valuta: string
}

export interface Loennsopplysning {
  periode: Periode
  periodetype: string
  ansettelsestype?: string
  inntekter: Array<Inntekt>
  arbeidsdager?: string
  arbeidstimer?: string
}

export interface RettTilYtelse {
  bekreftelsesgrunn?: string
  periode: Periode
  avvisningsgrunn?: string
}

export interface BaseReplySed {
  bruker: Person
  sedType: string
  sedVersjon: string
  // added
  saksnummer ?: string
  sakUrl ?: string
  sedId ?: string
}

export interface LokaleSakId {
  saksnummer: string
  institusjonsnavn: string
  institusjonsid: string
  land: string
}

export interface InntektOgTime {
  bruttoinntekt: string
  valuta: string
  arbeidstimer: string
  inntektsperiode: Periode
}

export interface PeriodeMedForsikring extends Periode {
  arbeidsgiver: ArbeidsgiverWithAdresse
  // this is just to accommodate Arbeidsgiver conversion as PeriodeMedForsikring, just for internal use while showing ArbeidsgiverBox
  extra ?: {
    fraInntektsregisteret?: string
    fraArbeidsgiverregisteret?: string
  }
}

export interface PeriodeUtenForsikring extends PeriodeMedForsikring {
  inntektOgTimer: Array<InntektOgTime>
  inntektOgTimerInfo: string
}

export interface PeriodeAnnenForsikring extends Periode {
  annenTypeForsikringsperiode: string
}

export type ForsikringPeriode = Periode | PeriodeMedForsikring | PeriodeUtenForsikring | PeriodeAnnenForsikring

export interface UenighetKonklusjon {
  vedtakFraDato: string
  kommentarTilVedtak: string
  tasTilAdministrativKommisjon: JaNei
  grunnTilUenighet: string
}

export interface FSed extends BaseReplySed {
  anmodningsperioder: Array<Periode>
  formaal: Array<string>
}

export interface F002Sed extends FSed {
  annenPerson?: Person
  barn?: Array<Barn>
  ektefelle?: Person
  endredeForhold?: Array<string>
  familie?: {
    motregninger?: Array<Motregning>
    ytelser?: Array<Ytelse>
  }
  krav: {
    infoPresisering: string
    infoType: string
    kravMottattDato: string
    kravType: string
  }
  utbetalingTilInstitusjon?: UtbetalingTilInstitusjon
  refusjonskrav ?: string
  uenighet?: ProsedyreVedUenighet
  uenighetKonklusjon?: Array<UenighetKonklusjon>
  vedtak?: Vedtak
}

export interface USed extends BaseReplySed {
  anmodningsperiode: Periode
  lokaleSakIder: Array<LokaleSakId>
}

export interface U002Sed extends USed {
  perioderAnsattMedForsikring?: Array<PeriodeMedForsikring>
  perioderSelvstendigMedForsikring?: Array<PeriodeMedForsikring>
  perioderAnsattUtenForsikring?: Array<PeriodeUtenForsikring>
  perioderSelvstendigUtenForsikring?: Array<PeriodeUtenForsikring>
  perioderSyk?: Array<Periode>
  perioderSvangerskapBarn?: Array<Periode>
  perioderUtdanning?: Array<Periode>
  perioderMilitaertjeneste?: Array<Periode>
  perioderFrihetsberoevet?: Array<Periode>
  perioderFrivilligForsikring?: Array<Periode>
  perioderKompensertFerie?: Array<Periode>
  perioderAnnenForsikring?: Array<PeriodeAnnenForsikring>
  perioderDagpenger?:Array<PeriodeDagpenger>
  grunntilopphor?: GrunnTilOpphør
  sisteAnsettelsesForhold?: SisteAnsettelsesForhold
}

export interface U004Sed extends USed {
  loennsopplysninger?: Array<Loennsopplysning>
}

export interface U017Sed extends U002Sed {
  rettTilYtelse?: RettTilYtelse
}

export interface HSed extends BaseReplySed {
  vedlagteDokumenttyper: {
    dokumenttyper: Array<string>
    andreDokumenttyper: Array<string>
  }
  positivtSvar?: HSvar
  negativeSvar?: HSvar
  ytterligereInfo: string
  tema?: string
  fagsakId?: string
}

export interface H002Sed extends HSed {}
