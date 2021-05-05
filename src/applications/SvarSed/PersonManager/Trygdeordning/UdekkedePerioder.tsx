import {
  validateUdekkedePeriode,
  ValidationUdekkedePeriodeProps
} from 'applications/SvarSed/PersonManager/Trygdeordning/validation'
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
import { Ingress } from 'nav-frontend-typografi'
import { Column, HighContrastFlatknapp, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getIdx } from 'utils/namespace'

interface UdekkedePerioderProps {
  highContrast: boolean
  updateReplySed: (needle: string, value: any) => void
  parentNamespace: string,
  personID: string
  personName: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  validation: Validation
}

const UdekkedePerioder: React.FC<UdekkedePerioderProps> = ({
  updateReplySed,
  parentNamespace,
  personID,
  personName,
  replySed,
  resetValidation,
  validation
}: UdekkedePerioderProps): JSX.Element => {
  const { t } = useTranslation()
  const target = `${personID}.perioderUtenforTrygdeordning`
  const perioderUtenforTrygdeordning: Array<Periode> = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-trygdeordninger`

  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newStartDato, _setNewStartDato] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Periode>((p: Periode): string => {
    return p?.startdato // assume startdato is unique
  })
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationUdekkedePeriodeProps>({}, validateUdekkedePeriode)

  const setStartDato = (startdato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(startdato.trim())
      _resetValidation(namespace + '-udekkede-startdato')
    } else {
      updateReplySed(`{target}[${index}].startdato`, startdato.trim())
      if (validation[namespace + '-perioderUtenforTrygdeordning' + getIdx(index) + '-startdato']) {
        resetValidation(namespace + '-perioderUtenforTrygdeordning' + getIdx(index) + '-startdato')
      }
    }
  }

  const setSluttDato = (sluttdato: string, index: number) => {
    if (index < 0) {
      _setNewSluttDato(sluttdato.trim())
      _resetValidation(namespace + '-udekkede-sluttdato')
    } else {
      const newPerioder: Array<Periode> = _.cloneDeep(perioderUtenforTrygdeordning)
      if (sluttdato === '') {
        delete newPerioder[index].sluttdato
        newPerioder[index].aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[index].aapenPeriodeType
        newPerioder[index].sluttdato = sluttdato.trim()
      }
      updateReplySed(target, newPerioder)
      if (namespace + '-perioderUtenforTrygdeordning' + getIdx(index) + '-sluttdato') {
        resetValidation(namespace + '-perioderUtenforTrygdeordning' + getIdx(index) + '-sluttdato')
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

  const onRemove = (i: number) => {
    const newPerioder: Array<Periode> = _.cloneDeep(perioderUtenforTrygdeordning)
    const deletedPerioder: Array<Periode> = newPerioder.splice(i, 1)
    if (deletedPerioder && deletedPerioder.length > 0) {
      removeFromDeletion(deletedPerioder[0])
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
      updateReplySed(target, newPerioder)
      resetForm()
    }
  }

  const renderRow = (periode: Periode | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(periode)
    const idx = (index >= 0 ? '-perioderUtenforTrygdeordning[' + index + ']' : '-udekkede')
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + idx + '-' + el]?.feilmelding
        : validation[namespace + idx + '-' + el]?.feilmelding
    )
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
              onBeginRemove={() => addToDeletion(periode)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(periode)}
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
        {t('label:trygdeordningen-udekkede')}
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
        ? renderRow(null, -1)
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
