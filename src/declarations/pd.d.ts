import {
  GrunnTilOpphør,
  Periode,
  PeriodeAnnenForsikring,
  PeriodeMedForsikring,
  PeriodeUtenForsikring,
  Person, RettTilYtelse
} from 'declarations/sed'

export interface SimpleInntekt {
  periode: Periode
  beloep: string
  valuta: string
}

export interface ReplyPdu1 {
  bruker: Person
  type: string
  perioderAnsattMedForsikring?: Array<PeriodeMedForsikring> // 2.1.1
  perioderSelvstendigMedForsikring?: Array<PeriodeMedForsikring> // 2.1.2
  perioderAnnenForsikring?: Array<PeriodeAnnenForsikring> // 2.1.3
  // 2.1.4 ?
  perioderAnsattUtenForsikring?: Array<PeriodeUtenForsikring> // 2.2.1
  perioderSelvstendigUtenForsikring?: Array<PeriodeUtenForsikring> // 2.2.2
  inntektAnsettelsesforhold: Array<SimpleInntekt>
  inntektSelvstendig: Array<SimpleInntekt>
  grunntilopphor: GrunnTilOpphør// 3
  // 4 ?
  // 5 ?
  rettTilYtelse: RettTilYtelse // 6
  // 7 ?
  ytterligereInfo: string

}
