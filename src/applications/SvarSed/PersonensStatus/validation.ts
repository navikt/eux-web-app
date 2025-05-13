import { validateAnsattPerioder } from './Ansatt/validation'
import { validateGrunnlagForBosetting } from 'applications/SvarSed/GrunnlagForBosetting/validation'
import { validateAvsenderlandetPerioder } from 'applications/SvarSed/PersonensStatus/Avsenderlandet/validation'
import { validateNotAnsattPerioder } from 'applications/SvarSed/PersonensStatus/NotAnsatt/validation'
import { validateWithSubsidiesPerioder } from 'applications/SvarSed/PersonensStatus/WithSubsidies/validation'
import { Flyttegrunn, PensjonPeriode, Periode, PersonTypeF001 } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'

export interface ValidationPersonensStatusProps {
  person: PersonTypeF001
  personName ?: string
}
export const validatePersonensStatusPerioder = (
  v: Validation,
  namespace: string,
  {
    person,
    personName
  }: ValidationPersonensStatusProps
): boolean => {
  const hasErrors: Array<boolean> = []

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
  return hasErrors.find(value => value) !== undefined
}
