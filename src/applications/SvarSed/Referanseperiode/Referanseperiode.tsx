import { Heading } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import {
  validateReferanseperiode,
  ValidationReferanseperiodeProps
} from 'applications/SvarSed/Referanseperiode/validation'
import PeriodeInput from 'components/Forms/PeriodeInput'
import { State } from 'declarations/reducers'
import { Periode } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import { AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Referanseperiode: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = 'anmodningsperiode'
  const anmodningsperiode: Periode | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-referanseperiode`

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationReferanseperiodeProps>(
      clonedValidation, namespace, validateReferanseperiode, {
        anmodningsperiode,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

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
        {label}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <PeriodeInput
          namespace={namespace}
          error={{
            startdato: validation[namespace + '-startdato']?.feilmelding,
            sluttdato: validation[namespace + '-sluttdato']?.feilmelding
          }}
          hideLabel={false}
          setPeriode={setPeriode}
          value={anmodningsperiode}
        />
        <Column />
      </AlignStartRow>
    </PaddedDiv>
  )
}

export default Referanseperiode
