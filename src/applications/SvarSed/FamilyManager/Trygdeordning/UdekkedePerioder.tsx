import {
  validateUdekkedePeriode,
  ValidationUdekkedePeriodeProps
} from 'applications/SvarSed/FamilyManager/Trygdeordning/validation'
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
import { Ingress } from 'nav-frontend-typografi'
import { Column, HighContrastFlatknapp, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface UdekkedePerioderProps {
  highContrast: boolean
  updateReplySed: (needle: string, value: any) => void
  personID: string
  personName: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  validation: Validation
}

const UdekkedePerioder: React.FC<UdekkedePerioderProps> = ({
  updateReplySed,
  personID,
  personName,
  replySed,
  resetValidation,
  validation
}: UdekkedePerioderProps): JSX.Element => {
  const { t } = useTranslation()
  const target = `${personID}.perioderUtenforTrygdeordning`
  const perioderUtenforTrygdeordning: Array<Periode> = _.get(replySed, target)
  const namespace = `familymanager-${personID}-trygdeordninger`

  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newStartDato, _setNewStartDato] = useState<string>('')

  const [addCandidateForDeletion, removeCandidateForDeletion, hasKey] = useAddRemove()
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationUdekkedePeriodeProps>({}, validateUdekkedePeriode)

  const setStartDato = (dato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(dato)
      _resetValidation(namespace + '-udekkede-startdato')
    } else {
      const newPerioder: Array<Periode> = _.cloneDeep(perioderUtenforTrygdeordning)
      newPerioder[index].startdato = dato
      updateReplySed(target, newPerioder)
      if (validation[namespace + '-udekkede-startdato']) {
        resetValidation(namespace + '-udekkede-startdato')
      }
    }
  }

  const setSluttDato = (dato: string, index: number) => {
    if (index < 0) {
      _setNewSluttDato(dato)
      _resetValidation(namespace + '-udekkede-sluttdato')
    } else {
      const newPerioder: Array<Periode> = _.cloneDeep(perioderUtenforTrygdeordning)
      if (dato === '') {
        delete newPerioder[index].sluttdato
        newPerioder[index].aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[index].aapenPeriodeType
        newPerioder[index].sluttdato = dato
      }
      updateReplySed(target, newPerioder)
      if (validation[namespace + '-udekkede-sluttdato']) {
        resetValidation(namespace + '-udekkede-sluttdato')
      }
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
    return p.startdato
  }

  const onRemove = (i: number) => {
    const newPerioder: Array<Periode> = _.cloneDeep(perioderUtenforTrygdeordning)
    const deletedPerioder: Array<Periode> = newPerioder.splice(i, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeCandidateForDeletion(getKey(deletedPerioder[0]))
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
      periode: newPeriode,
      index: -1,
      namespace,
      personName
    })

    if (valid) {
      let newPerioder: Array<Periode> = _.cloneDeep(perioderUtenforTrygdeordning)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat(newPeriode)
      resetForm()
      updateReplySed(target, newPerioder)
    }
  }

  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0
      ? _validation[namespace + '-udekkede-' + el]?.feilmelding
      : validation[namespace + '-udekkede[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (periode: Periode | undefined, index: number) => {
    const key = periode ? getKey(periode) : 'new'
    const candidateForDeletion = index < 0 ? false : !!key && hasKey(key)
    const idx = (index >= 0 ? '-perioderUtenforTrygdeordning[' + index + ']' : '-udekkede')

    const startdato = index < 0 ? _newStartDato : periode?.startdato
    const sluttdato = index < 0 ? _newSluttDato : periode?.sluttdato
    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <Period
            key={'' + startdato + sluttdato}
            labels={false}
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
              marginTop={false}
              onBeginRemove={() => addCandidateForDeletion(key!)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeCandidateForDeletion(key!)}
              onAddNew={() => onAdd()}
              onCancelNew={() => onCancel()}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </>
    )
  }

  return (
    <>
      <Ingress>
        {t('el:title-trygdeordningen-udekkede')}
      </Ingress>
      <VerticalSeparatorDiv />
      {perioderUtenforTrygdeordning?.length > 0 && (
        <Row className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
          <Column>
            <label className='skjemaelement__label'>
              {t('label:startdato') + ' *'}
            </label>
          </Column>
          <Column>
            <label className='skjemaelement__label'>
              {t('label:sluttdato')}
            </label>
          </Column>
          <Column />
        </Row>
      )}
      <VerticalSeparatorDiv />
      {perioderUtenforTrygdeordning?.map(renderRow)}
      <hr />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(undefined, -1)
        : (
          <Row className='slideInFromLeft'>
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
    </>
  )
}

export default UdekkedePerioder
