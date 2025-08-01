import { JoarkBrowserItems } from 'declarations/attachments'
import { Sak, Sed } from 'declarations/types'

export type AapenPeriodeType = 'ukjent_sluttdato' | 'åpen_sluttdato'

export type AdresseType = 'bosted' | 'opphold' | 'kontakt' | 'annet'

export type BarnRelasjon = '01' | '02' | '03' | '04'

export type BarnRelasjonType = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08'

export type RelasjonType = 'gift' |'samboer' | 'registrert_partnerskap' | 'skilt' | 'aleneforelder' | 'annet'
export type ForelderType = 'gift' | 'aleneforelder' | 'annet'

export type Kjoenn = 'K' | 'M' | 'U'

export type TelefonType = 'arbeid' | 'hjem' | 'mobil'

export type ReplySed = F001Sed | F002Sed | F003Sed | F026Sed | F027Sed | H001Sed | H002Sed | S040Sed | U002Sed | U004Sed | U017Sed | X008Sed | X009Sed | X010Sed | X011Sed | X012Sed

export type SedTypes = 'F001' | 'F002' | 'F003' | 'H001' | 'H002' | 'S040'| 'S046'| 'U002' | 'U004' | 'U017' | 'X008' | 'X009' | 'X010' | 'X011' | 'X012'

export type JaNei = 'ja' | 'nei'

export type PensjonsType = 'alderspensjon' | 'uførhet'

export type YtelseNavn = 'Barnetrygd' | 'Kontantstøtte' | 'Utvidet barnetrygd'

export type Utbetalingshyppighet = 'Månedlig'| 'Årlig'

export type HSvarType = 'positivt' | 'negativt'

export type BarnEllerFamilie = 'barn' | 'familie'

export type AnmodningSvarType = 'anmodning_om_motregning_per_barn' | 'svar_på_anmodning_om_motregning_per_barn' | 'anmodning_om_motregning_for_hele_familien' | 'svar_på_anmodning_om_motregning_for_hele_familien'

export type GrunnUenighet = 'bosted' | 'medlemsperiode' | 'personligSituasjon'| 'pensjon' | 'oppholdetsVarighet' | 'ansettelse'

export type TypeGrunn = 'oppsagt_av_arbeidsgiver' | 'arbeidstaker_har_sagt_opp_selv' | 'kontrakten_utløpt' |
  'avsluttet_etter_felles_overenskomst' | 'avskjediget_av_disiplinære_grunner' | 'overtallighet' |
  'ukjent' | 'annet'

export type ArbeidsgiverIdentifikatorType = 'organisasjonsnummer' | 'trygd' | 'skattemessig' | 'ukjent'

export type PeriodeInputType = 'simple' | 'withcheckbox'

export type AnsettelsesType = 'ansettelsesforhold' | 'selvstendig_næringsvirksomhet'

export type KontoType = 'sepa' | 'ordinaer'

export type YtterligereInfoType = 'melding_om_mer_informasjon' | 'admodning_om_mer_informasjon'

export type PeriodeSort = 'time' | 'group'

export type PeriodeView = 'periods' | 'all'

export type AdopsjonEtterspurtInformasjonType =
  'dato_da_adoptivforeldrene_fikk_omsorg_for_det_adopterte_barnet' |
  'dato_da_adopsjonsbevillingen_ble_offentlig_registrert' |
  'dokument_som_stadfester_at_adopsjonen_er_lovlig'

export type AnnenInformasjonOmBarnetEtterspurtInformasjonType =
  'hvem_har_daglig_omsorg_for_barnet' |
  'hvem_har_foreldreansvar_for_barnet' |
  'er_barnet_adoptert' |
  'forsørges_barnet_av_det_offentlige' |
  'går_barnet_i_barnehage_finansieres_barnehagen_av_staten_eller_det_offentlige_antall_timer_barnet_går_i_barnehage' |
  'barnets_sivilstand' |
  'dato_for_endrede_forhold'

export type InntektEtterspurtInformasjonType =
  'type_påkrevde_data_inntektskilde' |
  'årlig_inntekt' |
  'periode_fratil_det_kreves_opplysninger_om'

export type YtelseTilForeldreloeseEtterspurtInformasjonType =
  'identifisering_av_den_avdøde' |
  'identifisering_av_de_berørte_barna' |
  'identifikasjon_av_andre_personer_en_annen_slektning_verge_som_søker_på_vegne_av_den_foreldreløse_barnet' |
  'den_foreldreløses_barnets_bosted' |
  'relasjon_mellom_den_foreldreløse_barnet_og_avdøde' |
  'relasjon_mellom_annen_person_og_den_avdøde' |
  'den_foreldreløses_barnets_aktivitet' |
  'skole' |
  'opplæring' |
  'uførhet' |
  'qrbeidsledighet' |
  'inntekt_til_den_foreldreløse_barnet'

export type UtdanningType = 'skole' | 'høyskole' | 'universitet' | 'yrkesrettet_opplæring' | 'barnehage_daghjem'


// periode: simple period. arbeidsperiode: period as ForsikringPeriode
export type PlanItemType = 'periode' | 'forsikringPeriode'

export interface Adresse {
  by?: string
  bygning?: string
  gate?: string
  land?: string
  landnavn?: string
  landkode?: string
  postnummer?: string
  region?: string
  type?: AdresseType
}

export interface Periode {
  startdato: string
  sluttdato?: string
  aapenPeriodeType?: AapenPeriodeType
  // internal use, for periode labeling, reference and visual
  // remove it before sync with ReplySed / PDU1
  __type ?: string
  __index ?: any
}

export interface PeriodePeriode {
  periode: Periode
}

export interface PensjonPeriode extends PeriodePeriode {
  pensjonstype: string
}

export interface ArbeidsgiverIdentifikator {
  type: ArbeidsgiverIdentifikatorType
  id: string
}

export interface ArbeidsgiverWithAdresse {
  navn: string
  adresse?: Adresse
  identifikatorer: Array<ArbeidsgiverIdentifikator>
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

export interface FamilieRelasjon extends PeriodePeriode {
  annenRelasjonDato?: string
  annenRelasjonPersonNavn?: string
  annenRelasjonType?: string
  borSammen?: JaNei
  relasjonInfo: string
  relasjonType?: RelasjonType // F001, F002
  forelderType?: ForelderType // F003
}

export interface Pin {
  land ?: string
  landkode?: string
  sektor ?: string
  identifikator ?: string
  institusjonsid ?: string
  institusjonsnavn ?: string
}

export interface Statsborgerskap {
  fraDato?: string
  landkode?: string
}

export interface Foedested {
  by?: string
  region?: string
  land?: string
  landkode?: string
}

export interface PersonInfo {
  fornavn: string
  etternavn: string
  kjoenn?: Kjoenn
  foedselsdato?: string
  statsborgerskap?: Array<Statsborgerskap>
  adressebeskyttelse?: string
  pin?: Array<Pin>
  pinMangler?: {
    foedested: Foedested
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

export interface Aktivtitet {
  status: string
  perioder?: Array<Periode>
  type?: string
  begrunnelse?: string
}

export interface FillOutInfoPayload {
  bruker: {
    adresser: Array<Adresse>
    personInfo: PersonInfo
  }
}

export interface PersonType {
  personInfo: PersonInfo
}

export interface PersonTypeH extends PersonType {
  adresser?: Array<Adresse>
}

export interface PersonTypeU extends PersonType {
  adresser?: Array<Adresse>
  epost?: Array<Epost>
  telefon?: Array<Telefon>
}

export interface PersonTypeS extends PersonType{
  adresser?: Array<Adresse>
  botidilandetsiden?: string
}

export interface PersonTypeF extends PersonType {
  adresser?: Array<Adresse>
  epost?: Array<Epost>
  telefon?: Array<Telefon>
}

export interface PersonTypeF001 extends PersonTypeF {
  ikkeRettTilYtelser?: {
    typeGrunn?: string
    typeGrunnAnnen?: string
    typeGrunnForVedtak?: string
  }
  perioderMedAktivitetForInaktivPerson?: Array<Periode> //Ansettelsesperioder (6.7.5) i RINA
  familierelasjoner ?: Array<FamilieRelasjon>
  flyttegrunn ?: Flyttegrunn

  aktivitet?: Aktivtitet
  ytterligereInfo?: string
  trygdeperioder?: Array<Periode>
  perioderMedPensjon?: Array<PensjonPeriode>
  perioderMedRettTilFamilieytelser?: Array<Periode>
  dekkedePerioder?: Array<Periode>
  udekkedePerioder?: Array<Periode>
}

export interface PersonTypeBrukerF026 extends PersonTypeF {
  ikkeRettTilYtelser?: {
    typeGrunn?: string
    typeGrunnAnnen?: string
    typeGrunnForVedtak?: string
  }
  perioderMedYtelser?: Array<Periode> | null
  perioderMedITrygdeordning ?: Array<Periode> //TODO: Bør renames - det samme som dekkedePerioder (F001/F002)
  perioderUtenforTrygdeordning ?: Array<Periode> //TODO: Bør renames - det samme som udekkedePerioder (F001/F002)
}

export interface PersonTypeBrukerF027 extends PersonTypeF {
  ikkeRettTilYtelser?: {
    typeGrunn?: string
    typeGrunnAnnen?: string
    typeGrunnForVedtak?: string
  }
  perioderMedYtelser?: Array<Periode> | null
  perioderMedITrygdeordning ?: Array<Periode>
  perioderUtenforTrygdeordning ?: Array<Periode>
}

export interface PersonTypeBrukerF003 extends PersonTypeF {
  ikkeRettTilYtelser?: {
    typeGrunn?: string
    typeGrunnForVedtak?: string
    typeGrunnAnnen?: string
  } | null
  perioderMedYtelser?: Array<Periode> | null
  perioderMedITrygdeordning?: Array<Periode> | null
  perioderUtenforTrygdeordning?: Array<Periode> | null
}

export interface PersonTypeEktefelleF003 extends  PersonTypeF {
  ytterligereInfo?: string
}

export interface PersonTypeAnnenPersonF003 extends PersonTypeF {
  familierelasjon?: FamilieRelasjon
}

export interface PersonBarn {
  personInfo?: PersonInfo
  far?: {
    fornavn: string
    etternavnVedFoedsel: string
  }
  mor?: {
    fornavn: string
    etternavnVedFoedsel: string
  }
  adresser?: Array<Adresse>
  ytelser?: Array<Ytelse>
}

export interface PersonLight {
  fornavn: string
  etternavn: string
  kjoenn: Kjoenn
  foedselsdato: string
  statsborgerskap?: Array<Statsborgerskap>
  pin?: Array<Pin>
  adressebeskyttelse?: string
}

export interface Telefon {
  type: TelefonType
  nummer: string
}

export interface Ytelse extends Periode {
  antallPersoner?: string
  beloep: string
  mottakersNavn: string
  utbetalingshyppighet: Utbetalingshyppighet
  valuta: string
  ytelseNavn: string
}

export interface Motregning extends Periode {
  begrunnelse: string
  beloep: string
  mottakersNavn: string
  svarType?: AnmodningSvarType
  utbetalingshyppighet: Utbetalingshyppighet
  valuta: string
  vedtaksdato: string
  ytelseNavn?: string
  ytterligereInfo: string
}

export interface H001Svar {
  dokumentasjon: {
    informasjon: string
    dokument: string
    sed: string
  }
}

export interface H002Svar {
  informasjon: string
  dokument: string
  sed: string
  grunn?: string
}

export interface Barnetilhoerighet extends PeriodePeriode {
  borIBrukersHushold: JaNei
  borIEktefellesHushold: JaNei
  borIAnnenPersonsHushold: JaNei
  borPaaInstitusjon: JaNei
  erDeltForeldreansvar: JaNei
  relasjonTilPerson: BarnRelasjon
  relasjonType?: BarnRelasjonType
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

export interface UtbetalingTilInstitusjon extends Institusjon {
  begrunnelse: string
  kontoOrdinaer?: KontoOrdinaer
  kontoSepa?: KontoSepa
}

export interface Grunn {
  grunn: string
  person: string
  // extra: aux param to help edit
  __oldGrunn ?: string
}

export interface KompetansePeriode extends PeriodePeriode {
  skalYtelseUtbetales?: JaNei
}

export interface VedtakBarn {
  fornavn?: string
  etternavn?: string
  foedselsdato?: string

}

export interface Vedtak {
  gjelderAlleBarn: JaNei
  innhold: string
  ytterligereInfo: string
  vedtakstype: string
  vedtaksdato: string
  begrunnelse: string
  primaerkompetanseArt58: Array<KompetansePeriode>
  sekundaerkompetanseArt58: Array<KompetansePeriode>,
  primaerkompetanseArt68: Array<KompetansePeriode>,
  sekundaerkompetanseArt68: Array<KompetansePeriode>,
  vedtaksperioder: Array<Periode>,
  barnVedtaketOmfatter: Array<VedtakBarn>
}

export interface VedtakF003 {
  begrunnelse: string
  gjelderAlleBarn: JaNei
  vedtaksperioder: Array<Periode>
  barnVedtaketOmfatter: Array<VedtakBarn>
  kompetanse: string
  ytterligereInfo: string
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
  loennTilDato?: string // mottattdato
  feriedagerTilGode?: string // antallDager
  valuta: string
  beloep: string
}

export interface SisteAnsettelseInfo {
  opphoerRettighet: string // Avkall
  opphoerRettighetGrunn: string // grunn
  opphoerYtelse: string // annenYtelser
  utbetalinger: Array<Utbetaling>
  typeGrunnOpphoerAnsatt: TypeGrunn
  annenGrunnOpphoerAnsatt?: string
  grunnOpphoerSelvstendig?: string
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
  id: string
  navn: string
}

export interface PeriodeDagpenger extends PeriodePeriode {
  institusjon: Institusjon
}

export interface Inntekt extends BaseInntekt{
  type: string
  typeAnnen?: string
}

export interface BaseInntekt {
  beloep: string
  valuta: string
}

export interface Loennsopplysning extends PeriodePeriode {
  ansettelsestype?: string
  inntekter: Array<Inntekt>
  arbeidsdager?: string
  arbeidstimer?: string
}

export interface RettTilYtelse{
  bekreftelsesgrunn?: string
  avvisningsgrunn?: string
  periode?: Periode
}

export interface BaseReplySed {
  sedType: string
  sedVersjon: string

  // added
  sak?: Sak | undefined
  // this will identify if we will create the ReplySed (if undefined) or edit the ReplySed
  sed?: Sed | undefined
  attachments?: JoarkBrowserItems | undefined
}

export interface LokaleSakId {
  saksnummer: string
  institusjonsnavn: string
  institusjonsid: string
  land: string
  landkode?: string
}

export interface InntektOgTime {
  bruttoinntekt: string
  valuta: string
  arbeidstimer: string
  inntektsperiode: Periode
}

export type ForsikringPeriode = Periode

export interface PeriodeMedForsikring extends ForsikringPeriode {
  arbeidsgiver: ArbeidsgiverWithAdresse
  // this is just to accommodate ArbeidsperiodeFraAA conversion as PeriodeMedForsikring, just for internal use while showing ForsikringPeriodeBox
  extra ?: {
    fraInntektsregisteret?: string
    fraArbeidsgiverregisteret?: string
    fraSed: string
  }
}

export interface PeriodeUtenForsikring extends PeriodeMedForsikring {
  inntektOgTimer: Array<InntektOgTime>
  inntektOgTimerInfo: string
}

export interface PeriodeAnnenForsikring extends ForsikringPeriode {
  annenTypeForsikringsperiode: string
}

export interface PeriodeFerieForsikring extends ForsikringPeriode {
  beloep: string
  valuta: string
}

export interface UenighetKonklusjon {
  vedtakFraDato: string
  kommentarTilVedtak: string
  tasTilAdministrativKommisjon: JaNei
  grunnTilUenighet: string
}

export interface FSed extends BaseReplySed {
  bruker: PersonTypeF001
  anmodningsperioder: Array<Periode>
  formaal: Array<string>
  ytterligereInfo?: string
}

export interface F001Sed extends FSed {
  annenPerson?: PersonTypeF001
  barn?: Array<Barn>
  ektefelle?: PersonTypeF001
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
  uenighetKonklusjon?: Array<UenighetKonklusjon>
  vedtak?: Vedtak
}

export interface F002Sed extends F001Sed {
  uenighet?: ProsedyreVedUenighet
}

export interface F003Sed extends BaseReplySed {
  bruker: PersonTypeBrukerF003
  ektefelle?: PersonTypeEktefelleF003
  annenPerson?: PersonTypeAnnenPersonF003
  barn?: Array<PersonBarn>
  familie?: {
    ytelser?: Array<Ytelse>
  }
  krav: {
    kravMottattDato: string
    kravType: string
  }
  vedtak?: VedtakF003
}

export interface F026Sed extends BaseReplySed {
  bruker: PersonTypeBrukerF026
  ytterligereInfo?: string
  anmodningOmMerInformasjon?: AnmodningOmMerInformasjon
}

export interface F027Sed extends BaseReplySed {
  bruker: PersonTypeBrukerF027
  ytterligereInfo?: string
  krav: {
    kravMottattDato: string
  }
  erKravEllerSvarPaaKrav: string
  anmodningOmMerInformasjon?: {
    svar?: {
      adopsjon?: SvarAdopsjon
      inntekt?: SvarInntekt
      ytelseTilForeldreloese?: SvarYtelseTilForeldreloese_V42 | SvarYtelseTilForeldreloese_V43
      annenInformasjonBarnet?: AnnenInformasjonBarnet_V42 | AnnenInformasjonBarnet_V43
      utdanning?: Utdanning
      utdanningsinstitusjon?: UtdanningInstitusjon
      deltakelsePaaUtdanning: Array<Periode>
    }
  }
}

export interface AnmodningOmMerInformasjon {
  adopsjon?: EtterspurtInformasjon
  inntekt?: EtterspurtInformasjon
  ytelseTilForeldreLoese?: EtterspurtInformasjon
  annenInformasjonOmBarnet?: EtterspurtInformasjon
  utdanning?: Utdanning
  utdanningsinstitusjon?: UtdanningInstitusjon
}

export interface EtterspurtInformasjon {
  ytterligereInformasjon?: string
  etterspurtInformasjonType?: {
    typer?: Array<string>
  }
}

export interface Utdanning {
  timerPr?: 'dag' | 'uke' | 'maaned',
  ytterligereInformasjon?: string
  typeDeltakelse?: 'heltid' | 'deltid'
  timer?: string
  type?: UtdanningType
}

export interface UtdanningInstitusjon {
  adresse?: Adresse
  ytterligereInformasjon?: string
  navn?: string
  identifikator?: Array<UtdanningsInstitusjonsIndentifikator>
}

export interface UtdanningsInstitusjonsIndentifikator {
  type?: string
  id?: string
}

export interface SvarAdopsjon {
  dokumentasjonAdopsjonErLovlig?: string
  adoptivforeldreOmsorgFradato?: string
  bevillingRegistreringsdato?: string
  ytterligereInformasjon?: string
}

export interface SvarInntekt {
  periode?: Periode
  aarlig?: BaseInntekt
  annenkilde?: string
  inntektskilde?: string
  ytterligereInformasjon?: string
}

export interface SvarYtelseTilForeldreloese_V42 {
  barnet?: {
    skole?: string
    ytelser?: string
    aktivitet?: string
    arbeidsledighet?: string
    ufoerhet?: string
    opplaering?: string
    inntektfritekst?: string
    relasjontilavdoedefritekst?: string
    bostedfritekst?: string
    identifiseringFritekst?: string
  },
  annenPerson?: {
    relasjontilavdoedefritekst?: string
    identifiseringFritekst?: string
  }
  avdoede?:{
    identifiseringFritekst?: string
  }
}

export interface SvarYtelseTilForeldreloese_V43 {
  barnet?: {
    personInfo?: PersonInfo
    adresse?: Adresse
    skole?: string
    ytelser?: string
    aktivitet?: string
    arbeidsledighet?: string
    ufoerhet?: string
    opplaering?: string
    inntekt?: BaseInntekt
    relasjoner?: Array<RelasjonBarn>
  },
  annenPerson?: {
    personInfo?: PersonInfo
    relasjoner?: Array<RelasjonAnnenPerson>
  },
  avdoede?:{
    personInfo?: PersonInfo
  }
}

export interface AnnenInformasjonBarnet_V42 {
  foreldreansvar?: string
  informasjonombarnehagefritekst?: string
  datoEndredeForhold?: string
  dagligOmsorg?: string
  eradoptertfritekst?: string
  forsoergesavdetoffentligefritekst?: string
  sivilstandfritekst?: string
  ytterligereInformasjon?: string
}

export interface AnnenInformasjonBarnet_V43 {
  foreldreansvar?: string
  barnehage?: {
    timer?: string
    mottarOffentligStoette?: string
    timerPr?: string
    gaarIBarnehage?: string
  },
  datoEndredeForhold?: string
  dagligOmsorg?: string
  erAdoptert?: string
  forsoergesAvDetOffentlige?: string
  sivilstand?: string
  ytterligereInformasjon?: string
}

export interface RelasjonBarn {
  borISammeHusstandSomKravstiller?: string
  periode?: Periode
  typeRelasjon?: string
  relasjonTilPerson?: string
  borISammeHusstandSomEktefelle?: string
  borPaaInstitusjon?: string
  borISammeHusstandSomAnnenPerson?: string
  fellesOmsorg?: string
}

export interface RelasjonAnnenPerson {
  varKravstillerISammeHushold?: string
  personnavn?: string
  familierelasjonstype?: string
  annenRelasjon?: string
  periode?: Periode
  relasjonsstartdato?: string
  annenPerson?: string
}


export interface USed extends BaseReplySed {
  bruker: PersonTypeU
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
  perioderKompensertFerie?: Array<PeriodeFerieForsikring>
  perioderAnnenForsikring?: Array<PeriodeAnnenForsikring>
  dagpengeperioder?:Array<PeriodeDagpenger>
  sisteAnsettelseInfo?: SisteAnsettelseInfo
}

export interface U004Sed extends USed {
  loennsopplysninger?: Array<Loennsopplysning>
}

export interface U017Sed extends U002Sed {
  rettTilYtelse?: RettTilYtelse
}

export interface HSed extends BaseReplySed {
  bruker: PersonTypeH
  ytterligereInfo?: string
}

export interface H001Sed extends HSed {
  anmodning?: H001Svar
  ytterligereInfoType?: YtterligereInfoType
}

export interface H002Sed extends HSed {
  vedlagteDokumenttyper: {
    dokumenttyper: Array<string>
    andreDokumenttyper: Array<string>
  }
  positivtSvar?: H002Svar
  negativtSvar?: H002Svar
}

export interface S040Sed extends BaseReplySed {
  bruker: PersonTypeS
  sykdom: {
    forespoerselomperiode: Periode
    ytelse: {
      type: string,
      kontantellernatural: string
    }
  }
  ytterligereInfo?: string
}

export interface S046Sed extends BaseReplySed {
  bruker: PersonTypeS
  sykdom: {
    "informasjonOmUtbetaling": {
      forespoerselomperiode: Periode
      ytelse: {
        type: string,
      }
      vedtak: {
        type: string
      }
    }
  }
  ytterligereInfo?: string
}


export interface XSed extends BaseReplySed {
  bruker: PersonLight
  sedType: string
  sedVersjon: string
}

export type AvslutningsType = 'manuell' | 'automatisk'

export interface X001Sed extends XSed {
  avslutningDato: string
  avslutningType: AvslutningsType
  begrunnelseType: string
  begrunnelseAnnen?: string
}

export interface X008Sed extends XSed {
  utstedelsesdato: string
  begrunnelseType: string
  begrunnelseAnnen?: string
  kansellerSedId: string
  kansellerSedtype?: string
}

export interface X011Sed extends XSed {
  avvisSedId?: string
  avvisSedtype?: string
  utstedelsesdato?: string
  begrunnelseType: string
  begrunnelseAnnen?: string
}

export interface Purring {
  gjelder: string
  beskrivelse: string
}

export interface X009Sed extends XSed {
  purringer?: Array<Purring>
}

export interface BesvarelseKommer extends Purring {
  innenDato?: string
}

export interface BesvarelseUmulig extends Purring {
  begrunnelseType: string
  begrunnelseAnnen?: string
}

export interface X010Sed extends XSed {
  besvarelseKommer: Array<BesvarelseKommer>
  besvarelseUmulig: Array<BesvarelseUmulig>
  besvarSedId?: string
}

export interface KlargjoerInfoItem {
  del: string
  punkt: string
  begrunnelseType: string
  begrunnelseAnnen: string
}
export interface X012Sed extends XSed {
  klargjoerInfo: Array<KlargjoerInfoItem>
  avklarInnholdISedId?: string
}
