import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import useAddRemove from 'components/AddRemovePanel/useAddRemove'
import DateInput from 'components/DateInput/DateInput'
import Period from 'components/Period/Period'
import { AlignStartRow, TextAreaDiv } from 'components/StyledComponents'
import useValidation from 'components/Validation/useValidation'
import { Flyttegrunn, Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastTextArea,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateGrunnlagForBosetting, ValidationGrunnlagForBosettingProps } from './validation'

interface GrunnlagForBosettingProps {
  updateReplySed: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  validation: Validation
}

const GrunnlagforBosetting: React.FC<GrunnlagForBosettingProps> = ({
  updateReplySed,
  personID,
  replySed,
  resetValidation,
  validation
}:GrunnlagForBosettingProps): JSX.Element => {
  const { t } = useTranslation()
  const target = `${personID}.flyttegrunn`
  const flyttegrunn: Flyttegrunn = _.get(replySed, target)
  const namespace = `familymanager-${personID}-grunnlagforbosetting`

  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newStartDato, _setNewStartDato] = useState<string>('')

  const [addCandidateForDeletion, removeCandidateForDeletion, hasKey] = useAddRemove()
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationGrunnlagForBosettingProps>({}, validateGrunnlagForBosetting)

  const setAvsenderDato = (dato: string) => {
    _resetValidation(namespace + '-avsenderdato')
    updateReplySed(`${target}.datoFlyttetTilAvsenderlandet`, dato)
    if (validation[namespace + '-avsenderdato']) {
      resetValidation(namespace + '-avsenderdato')
    }
  }

  const setMottakerDato = (dato: string) => {
    _resetValidation(namespace + '-mottakerdato')
    updateReplySed(`${target}.datoFlyttetTilMottakerlandet`, dato)
    if (validation[namespace + '-mottakerdato']) {
      resetValidation(namespace + '-mottakerdato')
    }
  }

  const setStartDato = (dato: string, index: number) => {
    if (index < 0) {
      _setNewStartDato(dato)
      _resetValidation(namespace + '-startdato')
    } else {
      const newPerioder: Array<Periode> = _.cloneDeep(flyttegrunn.perioder)
      newPerioder[index].startdato = dato
      updateReplySed(`${target}.perioder`, newPerioder)
      if (validation[namespace + '-startdato']) {
        resetValidation(namespace + '-startdato')
      }
    }
  }

  const setSluttDato = (dato: string, index: number) => {
    if (index < 0) {
      _setNewSluttDato(dato)
      _resetValidation(namespace + '-sluttdato')
    } else {
      const newPerioder: Array<Periode> = _.cloneDeep(flyttegrunn.perioder)
      if (dato === '') {
        delete newPerioder[index].sluttdato
        newPerioder[index].aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[index].aapenPeriodeType
        newPerioder[index].sluttdato = dato
      }
      updateReplySed(`${target}.perioder`, newPerioder)
      if (validation[namespace + '-sluttdato']) {
        resetValidation(namespace + '-sluttdato')
      }
    }
  }

  const setElementsOfPersonalSituation = (element: string) => {
    _resetValidation(namespace + '-elementer')
    updateReplySed(`${target}.personligSituasjon`, element)
    if (validation[namespace + '-elementer']) {
      resetValidation(namespace + '-elementer')
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
    const newPerioder: Array<Periode> = _.cloneDeep(flyttegrunn.perioder)
    const deletedPeriods: Array<Periode> = newPerioder.splice(index, 1)
    if (deletedPeriods && deletedPeriods.length > 0) {
      removeCandidateForDeletion(getKey(deletedPeriods[0]))
    }
    updateReplySed(`${target}.perioder`, newPerioder)
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
      otherPeriods: flyttegrunn.perioder,
      index: -1,
      namespace
    })

    if (valid) {
      let newPerioder: Array<Periode> = _.cloneDeep(flyttegrunn.perioder)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      newPerioder = newPerioder.concat(newPeriode)
      resetForm()
      updateReplySed(`${target}.perioder`, newPerioder)
    }
  }

  const getErrorFor = (index: number, el: string): string | null | undefined => {
    return index < 0 ?
      _validation[namespace + '-' + el]?.feilmelding :
      validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (periode: Periode | undefined, index: number) => {
    const key = periode ? getKey(periode) : 'new'
    const candidateForDeletion = index < 0 ? false : !!key && hasKey(key)
    return (
      <>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
        >
          <Period
            index={index}
            key={_newStartDato + _newSluttDato}
            namespace={namespace}
            errorStartDato={getErrorFor(index, 'startdato')}
            errorSluttDato={getErrorFor(index, 'sluttdato')}
            setStartDato={setStartDato}
            setSluttDato={setSluttDato}
            valueStartDato={index < 0 ? _newStartDato : periode?.startdato}
            valueSluttDato={index < 0 ? _newSluttDato : periode?.sluttdato}
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
        {t('el:title-duration-stay')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {flyttegrunn.perioder
        .sort((a, b) =>
          moment(a.startdato).isSameOrBefore(moment(b.startdato)) ? -1 : 1
        )
        .map(renderRow)}
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
                {t('el:button-add-new-x', { x: t('label:period').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
        )}
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <DateInput
            error={validation[namespace + '-avsenderdato']?.feilmelding}
            namespace={namespace + '-avsenderdato'}
            index={-1}
            key={flyttegrunn.datoFlyttetTilAvsenderlandet}
            label={t('label:flyttedato-til-avsenderlandet')}
            setDato={setAvsenderDato}
            value={flyttegrunn.datoFlyttetTilAvsenderlandet}
          />
        </Column>
        <Column>
          <DateInput
            error={validation[namespace + '-mottakerdato']?.feilmelding}
            namespace={namespace + '-mottakerdato'}
            index={-1}
            key={flyttegrunn.datoFlyttetTilMottakerlandet}
            label={t('label:flyttedato-til-mottakerslandet')}
            setDato={setMottakerDato}
            value={flyttegrunn.datoFlyttetTilMottakerlandet}
          />
        </Column>
        <Column/>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        <Column data-flex='2'>
          <TextAreaDiv>
            <HighContrastTextArea
              className={classNames({ 'skjemaelement__input--harFeil': validation[+namespace + '-elementer'] })}
              data-test-id={'c-' + namespace + '-elementer-text'}
              feil={validation[namespace + '-elementer']}
              id={'c-' + namespace + '-elementer-text'}
              label={t('label:elementter-i-personlig-situasjon')}
              maxLength={500}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setElementsOfPersonalSituation(e.target.value)}
              placeholder={t('el:placeholder-input-default')}
              value={flyttegrunn.personligSituasjon}
            />
          </TextAreaDiv>
        </Column>
        <Column/>
      </AlignStartRow>
    </>
  )
}

export default GrunnlagforBosetting
