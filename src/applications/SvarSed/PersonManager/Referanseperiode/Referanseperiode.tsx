import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { State } from 'declarations/reducers'
import { Periode } from 'declarations/sed'
import _ from 'lodash'
import { Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const Referanseperiode: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    validation
  } = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = 'anmodningsperiode'
  const anmodningsperiode: Periode = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-referanseperiode`

  const setPeriode = (periode: Periode, id: string) => {
    dispatch(updateReplySed(`${target}`, periode))
    if (id === 'startdato' && validation[namespace + '-startdato']) {
      dispatch(resetValidation(namespace + '-startdato'))
    }
    if (id === 'sluttdato' && validation[namespace + '-sluttdato']) {
      dispatch(resetValidation(namespace + '-sluttdato'))
    }
  }

  return (
    <PaddedDiv>
      <Heading size='small'>
        {t('label:referanseperiode')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <PeriodeInput
          namespace={namespace}
          error={{
            startdato: validation[namespace + '-startdato']?.feilmelding,
            sluttdato: validation[namespace + '-sluttdato']?.feilmelding
          }}
          setPeriode={setPeriode}
          value={anmodningsperiode}
        />
        <Column />
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default Referanseperiode
