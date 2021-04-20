import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
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
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const NotAnsatt: React.FC<NotAnsattProps> = ({
   onValueChanged,
   personID,
   replySed,
   validation
}: NotAnsattProps): JSX.Element => {
  const { t } = useTranslation()

  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')

  const [_confirmDelete, _setConfirmDelete] = useState<Array<string>>([])
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, resetValidation, performValidation] = useValidation<ValidationNotAnsattProps>({}, validateNotAnsatte)

  const target: string = `${personID}.perioderSomSelvstendig`
  let perioderSomSelvstendig: Array<Periode> = _.get(replySed, target)
  const namespace = `familymanager-${personID}-personensstatus-notansatt`

  const onAddNewClicked = () => _setSeeNewForm(true)

  const addCandidateForDeletion = (key: string) => {
    _setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    _setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const setStartDato = (dato: string, i: number) => {
    if (i < 0) {
      _setNewStartDato(dato)
      resetValidation(namespace + '-startdato')
    } else {
      const newPerioder: Array<Periode> = _.cloneDeep(perioderSomSelvstendig)
      newPerioder[i].startdato = dato
      onValueChanged(target, newPerioder)
    }
  }

  const setSluttDato = (dato: string, i: number) => {
    if (i < 0) {
      _setNewSluttDato(dato)
      resetValidation(namespace + '-sluttdato')
    } else {
      const newPerioder: Array<Periode> = _.cloneDeep(perioderSomSelvstendig)
      if (dato === '') {
        delete newPerioder[i].sluttdato
        newPerioder[i].aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[i].aapenPeriodeType
        newPerioder[i].sluttdato = dato
      }
      onValueChanged(target, newPerioder)
    }
  }

  const resetForm = () => {
    _setNewStartDato('')
    _setNewSluttDato('')
    resetValidation()
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
    onValueChanged(target, newPerioder)
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
      onValueChanged(target, newPerioder)
    }
  }

  const getErrorFor = (index: number, el: string): string | null | undefined => {
    return index < 0 ? _validation[namespace + '-' + el]?.feilmelding : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (p: Periode | undefined, i: number) => {
    const key = p ? getKey(p) : 'new'
    const candidateForDeletion = i < 0 ? false : !!key && _confirmDelete.indexOf(key) >= 0

    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
        >
          <Period
            index={i}
            key={_newStartDato + _newSluttDato}
            namespace={namespace}
            errorStartDato={getErrorFor(i, 'startdato')}
            errorSluttDato={getErrorFor(i, 'sluttdato')}
            setStartDato={setStartDato}
            setSluttDato={setSluttDato}
            valueStartDato={i < 0 ? _newStartDato : p?.startdato}
            valueSluttDato={i < 0 ? _newSluttDato : p?.sluttdato}
          />
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(i >= 0)}
              marginTop
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onRemove(i)}
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
            .isSameOrBefore(moment(b.startdato, 'YYYY-MM-DD')) ? -1 : 1
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
                onClick={onAddNewClicked}
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
