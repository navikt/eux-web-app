import {PersonTypeF001} from "../../../declarations/sed";
import {Validation} from "../../../declarations/types";

export interface ValidateAktivitetOgTrygdeperioderProps {
  person: PersonTypeF001
  personName ?: string
}

export const validateAktivitetOgTrygdeperioder = (
  v: Validation,
  namespace: string,
  {
    person,
    personName
  } : ValidateAktivitetOgTrygdeperioderProps
): boolean => {
  const hasErrors: Array<boolean> = []


/*
  const perioderSomAnsatt: Array<Periode> | undefined = _.get(person, 'perioderSomAnsatt')
  hasErrors.push(validateAnsattPerioder(v, `${namespace}-ansatt`, {
    perioder: perioderSomAnsatt, personName
  }))
  const perioderSomSelvstendig: Array<Periode> | undefined = _.get(person, 'perioderSomSelvstendig')
  hasErrors.push(validateNotAnsattPerioder(v, `${namespace}-notansatt-perioderSomSelvstendig`, {
    perioder: perioderSomSelvstendig, personName
  }))
  const perioderSomSykMedLoenn: Array<Periode> | undefined = _.get(person, 'perioderSomSykMedLoenn')
  hasErrors.push(validateNotAnsattPerioder(v, `${namespace}-notansatt-perioderSomSykMedLoenn`, {
    perioder: perioderSomSykMedLoenn, personName
  }))
  const perioderSomPermittertMedLoenn: Array<Periode> | undefined = _.get(person, 'perioderSomPermittertMedLoenn')
  hasErrors.push(validateNotAnsattPerioder(v, `${namespace}-notansatt-perioderSomPermittertMedLoenn`, {
    perioder: perioderSomPermittertMedLoenn, personName
  }))
  const perioderSomPermittertUtenLoenn: Array<Periode> | undefined = _.get(person, 'perioderSomPermittertUtenLoenn')
  hasErrors.push(validateNotAnsattPerioder(v, `${namespace}-notansatt-perioderSomPermittertUtenLoenn`, {
    perioder: perioderSomPermittertUtenLoenn, personName
  }))
  const perioderMedTrygd: Array<Periode> | undefined = _.get(person, 'perioderMedTrygd')
  hasErrors.push(validateAvsenderlandetPerioder(v, `${namespace}-avsenderlandet`, {
    perioder: perioderMedTrygd, personName
  }))
  const flyttegrunn: Flyttegrunn | undefined = _.get(person, 'flyttegrunn')
  hasErrors.push(validateGrunnlagForBosetting(v, `${namespace}-grunnlagforbosetting`, {
    flyttegrunn, personName
  }))
  const perioderMedPensjon: Array<PensjonPeriode> | undefined = _.get(person, 'perioderMedPensjon')
  hasErrors.push(validateWithSubsidiesPerioder(v, `${namespace}-withsubsidies`, {
    perioder: perioderMedPensjon, personName
  }))
*/



  return hasErrors.find(value => value) !== undefined
}
