import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { State } from 'declarations/reducers'
import { Periode } from 'declarations/sed'
import _ from 'lodash'
import { Heading } from '@navikt/ds-react'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const Referanseperiode: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}:TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    validation
  } = useSelector<State, TwoLevelFormSelector>(mapState)
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
      <AlignStartRow>
        <PeriodeInput
          namespace={namespace}
          error={{
            startdato: validation[namespace + '-startdato']?.feilmelding,
            sluttdato: validation[namespace + '-sluttdato']?.feilmelding
          }}
          periodeType='simple'
          setPeriode={setPeriode}
          value={anmodningsperiode}
        />
        <Column />
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default Referanseperiode