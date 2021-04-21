import { Validation } from 'declarations/types'
import {
  validateAvsenderlandet,
  ValidationAvsenderlandetProps
} from './avsenderlandetValidation'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Period from 'components/Period/Period'
import { AlignStartRow } from 'components/StyledComponents'
import useValidation from 'components/Validation/useValidation'
import { Periode, ReplySed } from 'declarations/sed'
import _ from 'lodash'
import moment from 'moment'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastFlatknapp, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface AvsenderlandetProps {
  updateReplySed: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const Avsenderlandet: React.FC<AvsenderlandetProps> = ({
  updateReplySed,
  personID,
  replySed,
  validation
}: AvsenderlandetProps) => {
  const { t } = useTranslation()

  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')

  const [_confirmDelete, _setConfirmDelete] = useState<Array<string>>([])
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, resetValidation, performValidation] = useValidation<ValidationAvsenderlandetProps>({}, validateAvsenderlandet)

  const target: string = `${personID}.perioderMedTrygd`
  const perioderMedTrygd: Array<Periode> = _.get(replySed, target)
  const namespace: string = `familymanager-${personID}-personensstatus-avsenderlandet`

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
      const newPerioder: Array<Periode> = _.cloneDeep(perioderMedTrygd)
      newPerioder[i].startdato = dato
      updateReplySed(target, newPerioder)
    }
  }

  const setSluttDato = (dato: string, i: number) => {
    if (i < 0) {
      _setNewSluttDato(dato)
      resetValidation(namespace + '-sluttdato')
    } else {
      const newPerioder = _.cloneDeep(perioderMedTrygd)
      if (dato === '') {
        delete newPerioder[i].sluttdato
        newPerioder[i].aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[i].aapenPeriodeType
        newPerioder[i].sluttdato = dato
      }
      updateReplySed(target, newPerioder)
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
    const newPerioder: Array<Periode> = _.cloneDeep(perioderMedTrygd)
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
      otherPeriods: perioderMedTrygd,
      index: -1,
      namespace
    })

    if (valid) {
      let newPerioder: Array<Periode> = _.cloneDeep(perioderMedTrygd)
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
        {t('el:title-periods-in-sender-country')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {perioderMedTrygd
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
                {t('el:button-add-new-x', { x: t('label:trygdeperiode-i-avsenderlandet').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
        )}
      <VerticalSeparatorDiv />
    </>
  )
}

export default Avsenderlandet
