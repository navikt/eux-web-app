import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import Period from 'components/Period/Period'
import { AlignStartRow } from 'components/StyledComponents'
import { Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import moment from 'moment'
import { UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import { Column, HighContrastFlatknapp, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { validateAvsenderlandet, ValidationAvsenderlandetProps } from './avsenderlandetValidation'

export interface AvsenderlandetProps {
  updateReplySed: (needle: string, value: any) => void
  parentNamespace: string
  personID: string
  resetValidation: (key?: string) => void
  replySed: ReplySed
  validation: Validation
}

const Avsenderlandet: React.FC<AvsenderlandetProps> = ({
  parentNamespace,
  personID,
  resetValidation,
  replySed,
  updateReplySed,
  validation
}: AvsenderlandetProps) => {
  const { t } = useTranslation()
  const target: string = `${personID}.perioderMedTrygd`
  const perioderMedTrygd: Array<Periode> = _.get(replySed, target)
  const namespace = `${parentNamespace}-avsenderlandet`

  const [_newStartDato, _setNewStartDato] = useState<string>('')
  const [_newSluttDato, _setNewSluttDato] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((p: Periode): string => {
    return p?.startdato // assume startdato is unique
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationAvsenderlandetProps>({}, validateAvsenderlandet)

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
      const newPerioder = _.cloneDeep(perioderMedTrygd)
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
    const newPerioder: Array<Periode> = _.cloneDeep(perioderMedTrygd)
    const deletedPeriods: Array<Periode> = newPerioder.splice(index, 1)
    if (deletedPeriods && deletedPeriods.length > 0) {
      removeFromDeletion(deletedPeriods[0])
    }
    updateReplySed(target, newPerioder)
  }

  const onAdd = () => {
    const newPeriode: Periode = {
      startdato: _newStartDato.trim()
    }
    if (_newSluttDato) {
      newPeriode.sluttdato = _newSluttDato.trim()
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
        {t('label:periods-in-sender-country')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <UndertekstBold>
        {t('label:medlemsperiode')}
      </UndertekstBold>
      <VerticalSeparatorDiv />
      {perioderMedTrygd
        ?.sort((a, b) =>
          moment(a.startdato, 'YYYY-MM-DD').isSameOrBefore(moment(b.startdato, 'YYYY-MM-DD'))
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
