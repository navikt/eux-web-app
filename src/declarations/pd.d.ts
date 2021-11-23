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
  grunntilopphor?: GrunnTilOpphør// 3
  // 4 ?
  // 5 ?
  rettTilYtelse?: RettTilYtelse // 6
  // 7 ?
  ytterligereInfo?: string
}

export interface PayloadPdu1 {
  "saksnummer" ?: string
  "topmostSubform[0].Page1[0].PIN[0]": string
  "topmostSubform[0].Page1[0].Sex[0]" : '1' | '2'
  "topmostSubform[0].Page1[0].Surname[0]" : string
  "topmostSubform[0].Page1[0].Forenames[0]" : string
  "topmostSubform[0].Page1[0].Surname_at_birth[0]"? : string
  "topmostSubform[0].Page1[0].Date_of_birth[0]" : string
  "topmostSubform[0].Page1[0].Nationality[0]": string
  "topmostSubform[0].Page1[0].Place_of_birth[0]" : string
  "topmostSubform[0].Page1[0].Street_N[0]" : string
  "topmostSubform[0].Page1[0].Town[0]" : string
  "topmostSubform[0].Page1[0].Post_code[0]": string
  "topmostSubform[0].Page1[0].Country_code[0]": string
  "topmostSubform[0].Page1[0].From[0]"?: string
  "topmostSubform[0].Page1[0].To[0]"?: string
  "topmostSubform[0].Page1[0].From[1]"?: string
  "topmostSubform[0].Page1[0].To[1]"?: string
  "topmostSubform[0].Page1[0].From[2]"?: string
  "topmostSubform[0].Page1[0].To[2]"?: string
  "topmostSubform[0].Page1[0].From[3]"?: string
  "topmostSubform[0].Page1[0].To[3]"?: string
  "topmostSubform[0].Page1[0].From[4]"?: string
  "topmostSubform[0].Page1[0].To[4]"?: string
  "topmostSubform[0].Page1[0].From[5]"?: string
  "topmostSubform[0].Page1[0].To[5]"?: string
  "topmostSubform[0].Page1[0].From[6]"?: string
  "topmostSubform[0].Page1[0].To[6]"?: string
  "topmostSubform[0].Page1[0].From[7]"?: string
  "topmostSubform[0].Page1[0].To[7]"?: string
  "topmostSubform[0].Page1[0].From[8]"?: string
  "topmostSubform[0].Page1[0].To[8]"?: string
  "topmostSubform[0].Page1[0].From[9]"?: string
  "topmostSubform[0].Page1[0].To[9]"?: string
  "topmostSubform[0].Page1[0].From[10]"?: string
  "topmostSubform[0].Page1[0].To[10]"?: string
  "topmostSubform[0].Page1[0].From[11]"?: string
  "topmostSubform[0].Page1[0].To[11]"?: string
  "topmostSubform[0].Page1[0].From[12]"?: string
  "topmostSubform[0].Page1[0].To[12]"?: string
  "topmostSubform[0].Page1[0].From[13]"?: string
  "topmostSubform[0].Page1[0].To[13]"?: string
  "topmostSubform[0].Page2[0].From[0]"?: string
  "topmostSubform[0].Page2[0].To[0]"?: string
  "topmostSubform[0].Page2[0].Type[0]"?: string
  "topmostSubform[0].Page2[0].From[1]"?: string
  "topmostSubform[0].Page2[0].To[1]"?: string
  "topmostSubform[0].Page2[0].Type[1]"?: string
  "topmostSubform[0].Page2[0].From[2]"?: string
  "topmostSubform[0].Page2[0].To[2]"?: string
  "topmostSubform[0].Page2[0].Type[2]"?: string
  "topmostSubform[0].Page2[0].From[3]"?: string
  "topmostSubform[0].Page2[0].To[3]"?: string
  "topmostSubform[0].Page2[0].Reason[0]"?: string
  "topmostSubform[0].Page2[0].From[4]"?: string
  "topmostSubform[0].Page2[0].To[4]"?: string
  "topmostSubform[0].Page2[0].Reason[1]"?: string
  "topmostSubform[0].Page2[0].From[5]"?: string
  "topmostSubform[0].Page2[0].To[5]"?: string
  "topmostSubform[0].Page2[0].Reason[2]"?: string
  "topmostSubform[0].Page2[0].From[6]"?: string
  "topmostSubform[0].Page2[0].To[6]"?: string
  "topmostSubform[0].Page2[0].Activity[0]"?: string
  "topmostSubform[0].Page2[0].From[7]"?: string
  "topmostSubform[0].Page2[0].To[7]"?: string
  "topmostSubform[0].Page2[0].Activity[1]"?: string
  "topmostSubform[0].Page2[0].From[8]"?: string
  "topmostSubform[0].Page2[0].To[8]"?: string
  "topmostSubform[0].Page2[0].Activity[2]"?: string
  "topmostSubform[0].Page2[0].From[9]"?: string
  "topmostSubform[0].Page2[0].To[9]"?: string
  "topmostSubform[0].Page2[0].Activity[3]"?: string
  "topmostSubform[0].Page2[0].From[10]"?: string
  "topmostSubform[0].Page2[0].To[10]"?: string
  "topmostSubform[0].Page2[0].Activity[4]"?: string
  "topmostSubform[0].Page2[0].From[11]"?: string
  "topmostSubform[0].Page2[0].To[11]"?: string
  "topmostSubform[0].Page2[0].Activity[5]"?: string
  "topmostSubform[0].Page2[0].From[12]"?: string
  "topmostSubform[0].Page2[0].To[12]"?: string
  "topmostSubform[0].Page2[0].Wage[0]"?: string
  "topmostSubform[0].Page2[0].From[13]"?: string
  "topmostSubform[0].Page2[0].To[13]"?: string
  "topmostSubform[0].Page2[0].Wage[1]"?: string
  "topmostSubform[0].Page2[0].From[14]"?: string
  "topmostSubform[0].Page2[0].To[14]"?: string
  "topmostSubform[0].Page2[0].Wage[2]"?: string
  "topmostSubform[0].Page2[0].From[15]"?: string
  "topmostSubform[0].Page2[0].To[15]"?: string
  "topmostSubform[0].Page2[0].Earnings[0]"?: string
  "topmostSubform[0].Page2[0].From[16]"?: string
  "topmostSubform[0].Page2[0].To[16]"?: string
  "topmostSubform[0].Page2[0].Earnings[1]"?: string
  "topmostSubform[0].Page2[0].From[17]"?: string
  "topmostSubform[0].Page2[0].To[17]"?: string
  "topmostSubform[0].Page2[0].Earnings[2]"?: string
  "topmostSubform[0].Page2[0].Reason_end_employment[0]"?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
  "topmostSubform[0].Page2[0].Other_employment[0]"?: string
  "topmostSubform[0].Page2[0].Other_self_employment[0]"?: string
  "topmostSubform[0].Page3[0].CheckBox4\\.1[0]"?: '1' | undefined
  "topmostSubform[0].Page3[0].To[0]"?: string
  "topmostSubform[0].Page3[0].CheckBox4\\.2[0]"?: '1' | undefined
  "topmostSubform[0].Page3[0].To[1]"?: string
  "topmostSubform[0].Page3[0].CheckBox4\\.3[0]"?: '1' | undefined
  "topmostSubform[0].Page3[0].For[0]"?: string
  "topmostSubform[0].Page3[0].To[2]"?: string
  "topmostSubform[0].Page3[0].CheckBox4\\.4[0]"?: '1' | undefined
  "topmostSubform[0].Page3[0].Reason[0]"?: string
  "topmostSubform[0].Page3[0].CheckBox4\\.5[0]"?: '1' | undefined
  "topmostSubform[0].Page3[0].Other_benefits[0]"?: string
  "topmostSubform[0].Page3[0].From[0]"?: string
  "topmostSubform[0].Page3[0].To[3]"?: string
  "topmostSubform[0].Page3[0].From[1]"?: string
  "topmostSubform[0].Page3[0].To[4]"?: string
  "topmostSubform[0].Page3[0].From[2]"?: string
  "topmostSubform[0].Page3[0].To[5]"?: string
  "topmostSubform[0].Page3[0].Last_employment[0]"?: string
  "topmostSubform[0].Page3[0].Identification_N[0]"?: string
  "topmostSubform[0].Page3[0].Name[0]?": string
  "topmostSubform[0].Page3[0].Street_N[0]"?: string
  "topmostSubform[0].Page3[0].Town[0]"?: string
  "topmostSubform[0].Page3[0].Post_code[0]"?: string
  "topmostSubform[0].Page3[0].Country_code[0]"?: string
  "topmostSubform[0].Page3[0].CheckBox6\\.1[0]"?: '1' | undefined
  "topmostSubform[0].Page3[0].CheckBox6\\.2[0]"?: '1' | undefined
  "topmostSubform[0].Page3[0].CheckBox64[0]"?: '1' | undefined
  "topmostSubform[0].Page3[0].CheckBox65[0]"?: '1' | undefined
  "topmostSubform[0].Page3[0].From[3]"?: string
  "topmostSubform[0].Page3[0].To[6]"?: string
  "topmostSubform[0].Page3[0].Not_entitled[0]"?: '1' | '2' | undefined
  "topmostSubform[0].Page4[0].Name[0]"?: string
  "topmostSubform[0].Page4[0].Street_N[0]"?: string
  "topmostSubform[0].Page4[0].Town[0]"?: string
  "topmostSubform[0].Page4[0].Post_code[0]"?: string
  "topmostSubform[0].Page4[0].Country_code[0]"?: string
  "topmostSubform[0].Page4[0].Institution_ID[0]"?: string
  "topmostSubform[0].Page4[0].Office_fax_N[0]"?: string
  "topmostSubform[0].Page4[0].Office_phone_N[0]"?: string
  "topmostSubform[0].Page4[0].E-mail[0]"?: string
  "topmostSubform[0].Page4[0].Date[0]"?: string
  "topmostSubform[0].Page4[0].Signature[0]"?: string
}
