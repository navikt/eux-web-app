import { PayloadPdu1, ReplyPdu1 } from 'declarations/pd'
import { PeriodeAnnenForsikring } from 'declarations/sed'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import { getFnr } from 'utils/fnr'

export const convertToPayloadPdu1 = (replyPdu1: ReplyPdu1): PayloadPdu1 => {
  const result: PayloadPdu1 = {} as PayloadPdu1

  const countryData = CountryData.getCountryInstance('nb')

  // Person: 1.1 - 1.7
  _.set(result, 'topmostSubform[0].Page1[0].PIN[0]', getFnr(replyPdu1, 'bruker') ?? '')
  if (replyPdu1.bruker.personInfo.kjoenn === 'K') {
    _.set(result, 'topmostSubform[0].Page1[0].Sex[0]', '1')
  }
  if (replyPdu1.bruker.personInfo.kjoenn === 'M') {
    _.set(result, 'topmostSubform[0].Page1[0].Sex[0]', '2')
  }
  _.set(result, 'topmostSubform[0].Page1[0].Surname[0]', replyPdu1.bruker.personInfo.etternavn)
  _.set(result, 'topmostSubform[0].Page1[0].Forenames[0]', replyPdu1.bruker.personInfo.fornavn)
  _.set(result, 'topmostSubform[0].Page1[0].Surname_at_birth[0]', replyPdu1.bruker.personInfo.pinMangler?.etternavnVedFoedsel)
  _.set(result, 'topmostSubform[0].Page1[0].Date_of_birth[0]', replyPdu1.bruker.personInfo.foedselsdato)
  _.set(result, 'topmostSubform[0].Page1[0].Nationality[0]', replyPdu1.bruker.personInfo.statsborgerskap.map(s => countryData.findByValue(s?.land)?.label ?? s?.land).join(', '))
  _.set(result, 'topmostSubform[0].Page1[0].Place_of_birth[0]',
    replyPdu1.bruker.personInfo.pinMangler?.foedested.by
      ? replyPdu1.bruker.personInfo.pinMangler?.foedested.by + ' - ' + replyPdu1.bruker.personInfo.pinMangler?.foedested.land
      : '')
  // Adresse: 1.8
  if (replyPdu1.bruker.adresser?.length === 1) {
    _.set(result, 'topmostSubform[0].Page1[0].Street_N[0]', replyPdu1.bruker.adresser[0].gate ?? '')
    _.set(result, 'topmostSubform[0].Page1[0].Town[0]', replyPdu1.bruker.adresser[0].by ?? '')
    _.set(result, 'topmostSubform[0].Page1[0].Post_code[0]', replyPdu1.bruker.adresser[0].postnummer ?? '')
    _.set(result, 'topmostSubform[0].Page1[0].Country_code[0]', replyPdu1.bruker.adresser[0].land ?? '')
  }

  // perioderAnsattMedForsikring: 2.1.1
  replyPdu1.perioderAnsattMedForsikring?.forEach((p, i) => {
    if (i < 7) {
      _.set(result, 'topmostSubform[0].Page1[0].From[' + i + ']', p.startdato)
      if (p.sluttdato) {
        _.set(result, 'topmostSubform[0].Page1[0].To[' + i + ']', p.sluttdato)
      }
    }
  })

  // perioderSelvstendigMedForsikring: 2.1.2
  replyPdu1.perioderSelvstendigMedForsikring?.forEach((p, i) => {
    if (i < 7) {
      _.set(result, 'topmostSubform[0].Page1[0].From[' + (i + 7) + ']', p.startdato)
      if (p.sluttdato) {
        _.set(result, 'topmostSubform[0].Page1[0].To[' + (i + 7) + ']', p.sluttdato)
      }
    }
  })

  // perioderAnnenForsikring: 2.1.3
  replyPdu1.perioderAnnenForsikring?.forEach((p, i) => {
    if (i < 3) {
      _.set(result, 'topmostSubform[0].Page2[0].From[' + i + ']', p.startdato)
      if (p.sluttdato) {
        _.set(result, 'topmostSubform[0].Page2[0].To[' + i + ']', p.sluttdato)
      }
      _.set(result, 'topmostSubform[0].Page2[0].Type[' + i + ']', (p as PeriodeAnnenForsikring).annenTypeForsikringsperiode)
    }
  })

  // TODO 2.1.4 ??
  /*
  replyPdu1.???????.forEach((p, i) => {
    if (i < 3) {
      _.set(result, "topmostSubform[0].Page2[0].From[" + (i + 3) + "]", p.startdato)
      if (p.sluttdato) {
        _.set(result, "topmostSubform[0].Page2[0].To[" + (i + 3) + "]", p.sluttdato)
      }
       // TODO result["topmostSubform[0].Page2[0].Reason[0]
      //_.set(result, "topmostSubform[0].Page2[0].Reason[" + i + "]", p.reason)
    }
  })
  */

  // perioderAnsattUtenForsikring: 2.2.1
  replyPdu1.perioderAnsattUtenForsikring?.forEach((p, i) => {
    if (i < 3) {
      _.set(result, 'topmostSubform[0].Page2[0].From[' + (i + 6) + ']', p.startdato)
      if (p.sluttdato) {
        _.set(result, 'topmostSubform[0].Page2[0].To[' + (i + 6) + ']', p.sluttdato)
      }
      // TODO result["topmostSubform[0].Page2[0].Activity[0]
      // _.set(result, "topmostSubform[0].Page2[0].Activity[" + i + "]", p.reason)
    }
  })

  // perioderSelvstendigUtenForsikring: 2.2.2
  replyPdu1.perioderSelvstendigUtenForsikring?.forEach((p, i) => {
    if (i < 3) {
      _.set(result, 'topmostSubform[0].Page2[0].From[' + (i + 9) + ']', p.startdato)
      if (p.sluttdato) {
        _.set(result, 'topmostSubform[0].Page2[0].To[' + (i + 9) + ']', p.sluttdato)
      }
      // TODO result["topmostSubform[0].Page2[0].Activity[3]
      // _.set(result, "topmostSubform[0].Page2[0].Activity[" + (i + 3) + "]", p.reason)
    }
  })

  // inntektAnsettelsesforhold: 2.3.1
  replyPdu1.inntektAnsettelsesforhold?.forEach((si, i) => {
    if (i < 3) {
      _.set(result, 'topmostSubform[0].Page2[0].From[' + (i + 12) + ']', si.periode.startdato)
      if (si.periode.sluttdato) {
        _.set(result, 'topmostSubform[0].Page2[0].To[' + (i + 12) + ']', si.periode.sluttdato)
      }
      _.set(result, 'topmostSubform[0].Page2[0].Wage[' + i + ']', si.beloep + ' ' + si.valuta)
    }
  })

  // inntektAnsettelsesforhold: 2.3.2
  replyPdu1.inntektSelvstendig?.forEach((si, i) => {
    if (i < 3) {
      _.set(result, 'topmostSubform[0].Page2[0].From[' + (i + 15) + ']', si.periode.startdato)
      if (si.periode.sluttdato) {
        _.set(result, 'topmostSubform[0].Page2[0].To[' + (i + 15) + ']', si.periode.sluttdato)
      }
      _.set(result, 'topmostSubform[0].Page2[0].Earninga[' + i + ']', si.beloep + ' ' + si.valuta)
    }
  })

  // Grunn til Opphør: 3
  if (replyPdu1.grunntilopphor) {
    if (replyPdu1.grunntilopphor.typeGrunnOpphoerAnsatt === '01') {
      _.set(result, 'topmostSubform[0].Page2[0].Reason_end_employment[0]', '1')
    }
    if (replyPdu1.grunntilopphor.typeGrunnOpphoerAnsatt === '02') {
      _.set(result, 'topmostSubform[0].Page2[0].Reason_end_employment[0]', '4')
    }
    if (replyPdu1.grunntilopphor.typeGrunnOpphoerAnsatt === '03') {
      _.set(result, 'topmostSubform[0].Page2[0].Reason_end_employment[0]', '5')
    }
    if (replyPdu1.grunntilopphor.typeGrunnOpphoerAnsatt === '04') {
      _.set(result, 'topmostSubform[0].Page2[0].Reason_end_employment[0]', '2')
    }
    if (replyPdu1.grunntilopphor.typeGrunnOpphoerAnsatt === '05') {
      _.set(result, 'topmostSubform[0].Page2[0].Reason_end_employment[0]', '3')
    }
    if (replyPdu1.grunntilopphor.typeGrunnOpphoerAnsatt === '06') {
      _.set(result, 'topmostSubform[0].Page2[0].Reason_end_employment[0]', '6')
    }
    if (replyPdu1.grunntilopphor.typeGrunnOpphoerAnsatt === '99') {
      if (!_.isEmpty(replyPdu1.grunntilopphor.annenGrunnOpphoerAnsatt)) {
        _.set(result, 'topmostSubform[0].Page2[0].Reason_end_employment[0]', '6')
        _.set(result, 'topmostSubform[0].Page2[0].Other_employment[0]', replyPdu1.grunntilopphor.annenGrunnOpphoerAnsatt)
      }
      if (!_.isEmpty(replyPdu1.grunntilopphor.grunnOpphoerSelvstendig)) {
        _.set(result, 'topmostSubform[0].Page2[0].Reason_end_employment[0]', '6')
        _.set(result, 'topmostSubform[0].Page2[0].Other_self_employment[0]', replyPdu1.grunntilopphor.grunnOpphoerSelvstendig)
      }
    }
  }

  /*
  // 4 ? don't know
  result["topmostSubform[0].Page3[0].CheckBox4\\.1[0]"?: '1' | undefined
  result["topmostSubform[0].Page3[0].To[0]"?: string
  result["topmostSubform[0].Page3[0].CheckBox4\\.2[0]"?: '1' | undefined
  result["topmostSubform[0].Page3[0].To[1]"?: string
  result["topmostSubform[0].Page3[0].CheckBox4\\.3[0]"?: '1' | undefined
  result["topmostSubform[0].Page3[0].For[0]"?: string
  result["topmostSubform[0].Page3[0].To[2]"?: string
  result["topmostSubform[0].Page3[0].CheckBox4\\.4[0]"?: '1' | undefined
  result["topmostSubform[0].Page3[0].Reason[0]"?: string
  result["topmostSubform[0].Page3[0].CheckBox4\\.5[0]"?: '1' | undefined
  result["topmostSubform[0].Page3[0].Other_benefits[0]"?: string
 */

  // 5 PeriodeForDagpenger
  /*
  result["topmostSubform[0].Page3[0].From[0]"?: string
  result["topmostSubform[0].Page3[0].To[3]"?: string
  result["topmostSubform[0].Page3[0].From[1]"?: string
  result["topmostSubform[0].Page3[0].To[4]"?: string
  result["topmostSubform[0].Page3[0].From[2]"?: string
  result["topmostSubform[0].Page3[0].To[5]"?: string
  result["topmostSubform[0].Page3[0].Last_employment[0]"?: string
  result["topmostSubform[0].Page3[0].Identification_N[0]"?: string
  result["topmostSubform[0].Page3[0].Name[0]?": string
  result["topmostSubform[0].Page3[0].Street_N[0]"?: string
  result["topmostSubform[0].Page3[0].Town[0]"?: string
  result["topmostSubform[0].Page3[0].Post_code[0]"?: string
  result["topmostSubform[0].Page3[0].Country_code[0]"?: string
  */

  if (replyPdu1.rettTilYtelse) {
    if (!_.isEmpty(replyPdu1.rettTilYtelse.avvisningsgrunn)) {
      _.set(result, 'topmostSubform[0].Page3[0].CheckBox6\\.1[0]', '1')
      if (replyPdu1.rettTilYtelse.avvisningsgrunn === 'artikkel_64_i_forordningen_EF_nr._883/2004') {
        _.set(result, 'topmostSubform[0].Page3[0].CheckBox64[0]', '1')
      }
      if (replyPdu1.rettTilYtelse.avvisningsgrunn === 'artikkel_65_1_i_forordningen_EF_nr._883/2004') {
        _.set(result, 'topmostSubform[0].Page3[0].CheckBox65[0]', '1')
      }
    }

    if (!_.isEmpty(replyPdu1.rettTilYtelse.bekreftelsesgrunn)) {
      _.set(result, 'topmostSubform[0].Page3[0].CheckBox6\\.2[0]', '1')
      if (replyPdu1.rettTilYtelse.bekreftelsesgrunn === 'ingen_rett_til_stønad_i_henhold_til_lovgivningen_til_institusjonen_som_utsteder_denne_meldingen') {
        _.set(result, 'topmostSubform[0].Page3[0].Not_entitled[0]', '1')
      }
      if (replyPdu1.rettTilYtelse.bekreftelsesgrunn === 'personen_søkte_ikke_om_eksport_av_stønad_på_riktig_måte') {
        _.set(result, 'topmostSubform[0].Page3[0].Not_entitled[0]', '2')
      }
    }

    _.set(result, 'topmostSubform[0].Page3[0].From[3]', replyPdu1.rettTilYtelse.periode.startdato)
    _.set(result, 'topmostSubform[0].Page3[0].To[6]', replyPdu1.rettTilYtelse.periode.sluttdato)
  }

  // 7
  /*
  result["topmostSubform[0].Page4[0].Name[0]"?: string
  result["topmostSubform[0].Page4[0].Street_N[0]"?: string
  result["topmostSubform[0].Page4[0].Town[0]"?: string
  result["topmostSubform[0].Page4[0].Post_code[0]"?: string
  result["topmostSubform[0].Page4[0].Country_code[0]"?: string
  result["topmostSubform[0].Page4[0].Institution_ID[0]"?: string
  result["topmostSubform[0].Page4[0].Office_fax_N[0]"?: string
  result["topmostSubform[0].Page4[0].Office_phone_N[0]"?: string
  result["topmostSubform[0].Page4[0].E-mail[0]"?: string
  result["topmostSubform[0].Page4[0].Date[0]"?: string
  result["topmostSubform[0].Page4[0].Signature[0]"?: string
  */

  return result
}
