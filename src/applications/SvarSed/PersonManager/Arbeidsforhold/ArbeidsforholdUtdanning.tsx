import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Period from 'components/Period/Period'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Periode, PeriodeUtdanning, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import {
  AlignStartRow,
  Column,
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validatePeriodeUtdanning, ValidationPeriodeUtdanningProps } from './validationPeriodeUtdanning'

export interface ArbeidsforholdUtdanningSelector extends PersonManagerFormSelector {
  replySed: ReplySed | undefined
  validation: Validation
}

export interface ArbeidsforholdUtdanningProps {
  parentNamespace: string
  target: string
  typeTrygdeforhold: string
}

const mapState = (state: State): ArbeidsforholdUtdanningSelector => ({
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const ArbeidsforholdUtdanning: React.FC<ArbeidsforholdUtdanningProps> = ({
  parentNamespace,
  target,
  typeTrygdeforhold
}: ArbeidsforholdUtdanningProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    replySed,
    validation
  } = useSelector<State, ArbeidsforholdUtdanningSelector>(mapState)
  const dispatch = useDispatch()
  const perioder: Array<PeriodeUtdanning> | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${target}`

  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<PeriodeUtdanning>((periode: PeriodeUtdanning) => periode.periode.startdato)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] =
    useValidation<ValidationPeriodeUtdanningProps>({}, validatePeriodeUtdanning)

  const setStartDato = (startdato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(startdato.trim())
      _resetValidation(namespace + '-startdato')
    } else {
      dispatch(updateReplySed(`${target}[${index}].periode.startdato`, startdato.trim()))
      if (validation[namespace + getIdx(index) + '-startdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-startdato'))
      }
    }
  }

  const setSluttDato = (sluttdato: string, index: number) => {
    if (index < 0) {
      _setNewSluttDato(sluttdato.trim())
      _resetValidation(namespace + '-sluttdato')
    } else {
      const newPerioder: Array<PeriodeUtdanning> = _.cloneDeep(perioder) as Array<PeriodeUtdanning>
      if (sluttdato === '') {
        delete newPerioder[index].periode.sluttdato
        newPerioder[index].periode.aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[index].periode.aapenPeriodeType
        newPerioder[index].periode.sluttdato = sluttdato.trim()
      }
      dispatch(updateReplySed(target, newPerioder))
      if (validation[namespace + getIdx(index) + '-sluttdato']) {
        dispatch(resetValidation(namespace + getIdx(index) + '-sluttdato'))
      }
    }
  }

  const resetForm = () => {
    _setNewSluttDato('')
    _setNewStartDato('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<PeriodeUtdanning> = _.cloneDeep(perioder) as Array<PeriodeUtdanning>
    const deletedPerioder: Array<PeriodeUtdanning> = newPerioder.splice(index, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
    }
    dispatch(updateReplySed(target, newPerioder))
  }

  const onAdd = () => {
    const newPeriode: Periode = {
      startdato: _newStartDato
    }
    if (_newSluttDato) {
      newPeriode.sluttdato = _newSluttDato
    } else {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }

    const newPeriodeUtdanning: PeriodeUtdanning = {
      periode: newPeriode,
      typeTrygdeforhold: typeTrygdeforhold
    }

    const valid: boolean = performValidation({
      periodeUtdanning: newPeriodeUtdanning,
      perioderUtdanning: perioder ?? [],
      namespace: namespace
    })
    if (valid) {
      let newPerioderUtdanning: Array<PeriodeUtdanning> | undefined = _.cloneDeep(perioder)
      if (_.isNil(newPerioderUtdanning)) {
        newPerioderUtdanning = []
      }
      newPerioderUtdanning = newPerioderUtdanning.concat(newPeriodeUtdanning)
      dispatch(updateReplySed(target, newPerioderUtdanning))
      resetForm()
    }
  }

  const renderRow = (periodeUtdanning: PeriodeUtdanning | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periodeUtdanning)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
    const startdato = index < 0 ? _newStartDato : periodeUtdanning?.periode?.startdato
    const sluttdato = index < 0 ? _newSluttDato : periodeUtdanning?.periode?.sluttdato

    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <Period
            key={'' + startdato + sluttdato}
            namespace={namespace}
            errorStartDato={getErrorFor(index, 'startdato')}
            errorSluttDato={getErrorFor(index, 'sluttdato')}
            setStartDato={(dato: string) => setStartDato(dato, index)}
            setSluttDato={(dato: string) => setSluttDato(dato, index)}
            valueStartDato={startdato}
            valueSluttDato={sluttdato}
          />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(periodeUtdanning)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periodeUtdanning)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </>
    )
  }

  return (
    <PaddedDiv>
      {perioder?.map(renderRow)}
      <VerticalSeparatorDiv size='2' />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv size='2' />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default ArbeidsforholdUtdanning
