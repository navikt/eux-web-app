import { JoarkBrowserItems } from 'declarations/attachments'
import { Sak, Sed } from 'declarations/types'
import Identifikator from "../applications/SvarSed/Identifikator/Identifikator";

export type AapenPeriodeType = 'ukjent_sluttdato' | 'åpen_sluttdato'

export type AdresseType = 'bosted' | 'opphold' | 'kontakt' | 'annet'

export type BarnRelasjon = '01' | '02' | '03' | '04'

export type BarnRelasjonType = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08'

export type RelasjonType = 'gift' |'samboer' | 'registrert_partnerskap' | 'skilt' | 'aleneforelder' | 'annet'
export type ForelderType = 'gift' | 'aleneforelder' | 'annet'

export type Kjoenn = 'K' | 'M' | 'U'

export type TelefonType = 'arbeid' | 'hjem' | 'mobil'

export type ReplySed = F001Sed | F002Sed | F003Sed | U002Sed | U004Sed | U017Sed | H001Sed | H002Sed | X008Sed | X009Sed | X010Sed | X011Sed | X012Sed

export type SedTypes = 'F001' | 'F002' | 'F003' | 'U002' | 'U004' | 'U017' | 'H001' | 'H002' | 'X008' | 'X009' | 'X010' | 'X011' | 'X012'

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
  sektor ?: string
  identifikator ?: string
  institusjonsid ?: string
  institusjonsnavn ?: string
}

export interface Statsborgerskap {
  land: string,
}

export interface Foedested {
  by?: string
  region?: string
  land?: string
}

export interface PersonInfo {
  fornavn: string
  etternavn: string
  kjoenn: Kjoenn
  foedselsdato: string
  statsborgerskap: Array<Statsborgerskap>
  adressebeskyttelse?: string
  pin: Array<Pin>
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

export interface FillOutInfoPayload {
  bruker: {
    adresser: Array<Adresse>
    personInfo: PersonInfo
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

export interface PersonBruker {
  personInfo?: PersonInfo
  adresser?: Array<Adresse>
  telefon?: Array<Telefon>
  epost?: Array<Epost>
  ikkeRettTilYtelser?: {
    typeGrunn?: string
    typeGrunnForVedtak?: string
    typeGrunnAnnen?: string
  } | null
  perioderMedYtelser?: Array<Periode> | null
  perioderMedITrygdeordning?: Array<Periode> | null
  perioderUtenforTrygdeordning?: Array<Periode> | null
}

export interface PersonEktefelle {
  personInfo?: PersonInfo
  adresser?: Array<Adresse>
  telefon?: Array<Telefon>
  epost?: Array<Epost>
  ytterligereInfo?: string
}

export interface PersonAnnenPerson {
  personInfo?: PersonInfo
  adresser?: Array<Adresse>
  telefon?: Array<Telefon>
  epost?: Array<Epost>
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

export interface Inntekt {
  type: string
  typeAnnen?: string
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
  bruker: Person
  anmodningsperioder: Array<Periode>
  formaal: Array<string>
  ytterligereInfo?: string
}

export interface F001Sed extends FSed {
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
  uenighetKonklusjon?: Array<UenighetKonklusjon>
  vedtak?: Vedtak
}

export interface F002Sed extends F001Sed {
  uenighet?: ProsedyreVedUenighet
}

export interface F003Sed extends BaseReplySed {
  bruker: PersonBruker
  ektefelle?: PersonEktefelle
  annenPerson?: PersonAnnenPerson
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
  bruker: PersonBruker
  ytterligereInfo?: string
  anmodningOmMerInformasjon?: AnmodningOmMerInformasjon
}

export interface F027Sed extends BaseReplySed {
  bruker: PersonBruker
  ytterligereInfo?: string
  krav: {
    kravMottattDato: string
  }
  erKravEllerSvarPaaKrav: string
  anmodningOmMerInformasjon?: {
    svar?: {
      adopsjon?: SvarAdopsjon
      inntekt?: {
        periode: string
        aarlig: {
          beloep: string
          valuta: string
        }
        kilde: string
        inntektkilde: string
        ytterligereInformasjon: string
      }
      ytelseTilForeldreloese?: {}
      annenInformasjonBarnet?: {}
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

export interface USed extends BaseReplySed {
  bruker: Person
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
  bruker: Person
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
}

export interface X011Sed extends XSed {
  avvisSedId: string
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
}

export interface KlargjoerInfoItem {
  del: string
  punkt: string
  begrunnelseType: string
  begrunnelseAnnen: string
}
export interface X012Sed extends XSed {
  klargjoerInfo: Array<KlargjoerInfoItem>
}
