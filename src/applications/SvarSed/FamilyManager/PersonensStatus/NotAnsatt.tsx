import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import useAddRemove from 'components/AddRemovePanel/useAddRemove'
import Period from 'components/Period/Period'
import { AlignStartRow } from 'components/StyledComponents'
import useValidation from 'components/Validation/useValidation'
import { Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastFlatknapp, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateNotAnsatte, ValidationNotAnsattProps } from './notAnsattValidation'

export interface NotAnsattProps {
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const NotAnsatt: React.FC<NotAnsattProps> = ({
  personID,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}: NotAnsattProps): JSX.Element => {
  const { t } = useTranslation()
  const target: string = `${personID}.perioderSomSelvstendig`
  const perioderSomSelvstendig: Array<Periode> = _.get(replySed, target)
  const namespace = `familymanager-${personID}-personensstatus-notansatt`

  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')

  const [addCandidateForDeletion, removeCandidateForDeletion, hasKey] = useAddRemove()
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationNotAnsattProps>({}, validateNotAnsatte)

  const setStartDato = (dato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(dato)
      _resetValidation(namespace + '-startdato')
    } else {
      const newPerioder: Array<Periode> = _.cloneDeep(perioderSomSelvstendig)
      newPerioder[index].startdato = dato
      updateReplySed(target, newPerioder)
      if (validation[namespace + '-startdato']) {
        resetValidation(namespace + '-startdato')
      }
    }
  }

  const setSluttDato = (dato: string, indx: number) => {
    if (indx < 0) {
      _setNewSluttDato(dato)
      _resetValidation(namespace + '-sluttdato')
    } else {
      const newPerioder: Array<Periode> = _.cloneDeep(perioderSomSelvstendig)
      if (dato === '') {
        delete newPerioder[indx].sluttdato
        newPerioder[indx].aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[indx].aapenPeriodeType
        newPerioder[indx].sluttdato = dato
      }
      updateReplySed(target, newPerioder)
      if (validation[namespace + '-sluttdato']) {
        resetValidation(namespace + '-sluttdato')
      }
    }
  }

  const resetForm = () => {
    _setNewStartDato('')
    _setNewSluttDato('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const getKey = (p: Periode): string => {
    return p?.startdato // assume startdato is unique
  }

  const onRemove = (index: number) => {
    const newPerioder: Array<Periode> = _.cloneDeep(perioderSomSelvstendig)
    const deletedPeriods: Array<Periode> = newPerioder.splice(index, 1)
    if (deletedPeriods && deletedPeriods.length > 0) {
      removeCandidateForDeletion(getKey(deletedPeriods[0]))
    }
    updateReplySed(target, newPerioder)
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

    const valid: boolean = performValidation({
      period: newPeriode,
      otherPeriods: perioderSomSelvstendig,
      index: -1,
      namespace
    })

    if (valid) {
      let newPerioder: Array<Periode> = _.cloneDeep(perioderSomSelvstendig)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat(newPeriode)
      resetForm()
      updateReplySed(target, newPerioder)
    }
  }

  const getErrorFor = (index: number, el: string): string | null | undefined => {
    return index < 0 ? _validation[namespace + '-' + el]?.feilmelding : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (p: Periode | undefined, index: number) => {
    const key = p ? getKey(p) : 'new'
    const candidateForDeletion = index < 0 ? false : !!key && hasKey(key)
    const idx = (index >= 0 ? '[' + index + ']' : '')
    const startdato = index < 0 ? _newStartDato : p?.startdato
    const sluttdato = index < 0 ? _newSluttDato : p?.sluttdato
    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
        >
          <Period
            key={'' + startdato + sluttdato}
            namespace={namespace + idx}
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
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeCandidateForDeletion(key!)}
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
    <>
      <Undertittel>
        {t('el:title-ansettelsesperioder')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {perioderSomSelvstendig
        ?.sort((a, b) =>
          moment(a.startdato, 'YYYY-MM-DD')
            .isSameOrBefore(moment(b.startdato, 'YYYY-MM-DD'))
            ? -1
            : 1
        )
        ?.map(renderRow)}
      <hr />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(undefined, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('el:button-add-new-x', { x: t('label:periode').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv />
    </>
  )
}

export default NotAnsatt
