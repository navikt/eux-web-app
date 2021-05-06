import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import useAddRemove from 'hooks/useAddRemove'
import Period from 'components/Period/Period'
import { AlignStartRow } from 'components/StyledComponents'
import useValidation from 'hooks/useValidation'
import { Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastFlatknapp, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { validateNotAnsatte, ValidationNotAnsattProps } from './notAnsattValidation'

export interface NotAnsattProps {
  parentNamespace: string
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const NotAnsatt: React.FC<NotAnsattProps> = ({
  parentNamespace,
  personID,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}: NotAnsattProps): JSX.Element => {
  const { t } = useTranslation()
  const target: string = `${personID}.perioderSomSelvstendig`
  const perioderSomSelvstendig: Array<Periode> = _.get(replySed, target)
  const namespace = `${parentNamespace}-notansatt`

  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((p: Periode): string => {
    return p?.startdato // assume startdato is unique
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationNotAnsattProps>({}, validateNotAnsatte)

  const setStartDato = (newDato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(newDato.trim())
      _resetValidation(namespace + '-startdato')
    } else {
      updateReplySed(`${target}[${index}].startdato`, newDato.trim())
      if (validation[namespace + getIdx(index) + '-startdato']) {
        resetValidation(namespace + getIdx(index) + '-startdato')
      }
    }
  }

  const setSluttDato = (sluttdato: string, index: number) => {
    if (index < 0) {
      _setNewSluttDato(sluttdato.trim())
      _resetValidation(namespace + '-sluttdato')
    } else {
      const newPerioder: Array<Periode> = _.cloneDeep(perioderSomSelvstendig)
      if (sluttdato === '') {
        delete newPerioder[index].sluttdato
        newPerioder[index].aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[index].aapenPeriodeType
        newPerioder[index].sluttdato = sluttdato.trim()
      }
      updateReplySed(target, newPerioder)
      if (validation[namespace + getIdx(index) + '-sluttdato']) {
        resetValidation(namespace + getIdx(index) + '-sluttdato')
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

  const onRemove = (index: number) => {
    const newPerioder: Array<Periode> = _.cloneDeep(perioderSomSelvstendig)
    const deletedPeriods: Array<Periode> = newPerioder.splice(index, 1)
    if (deletedPeriods && deletedPeriods.length > 0) {
      removeFromDeletion(deletedPeriods[0])
    }
    updateReplySed(target, newPerioder)
  }

  const onAdd = () => {
    const newPeriode: Periode = {
      startdato: _newStartDato?.trim()
    }
    if (_newSluttDato) {
      newPeriode.sluttdato = _newSluttDato?.trim()
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
      updateReplySed(target, newPerioder)
      resetForm()
    }
  }

  const renderRow = (periode: Periode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | null | undefined => {
      return index < 0
        ? _validation[namespace + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    }
    const startdato = index < 0 ? _newStartDato : periode?.startdato
    const sluttdato = index < 0 ? _newSluttDato : periode?.sluttdato
    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.1) + 's' }}
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
              onBeginRemove={() => addToDeletion(periode)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periode)}
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
        {t('label:ansettelsesperioder')}
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
      <VerticalSeparatorDiv />
    </>
  )
}

export default NotAnsatt
