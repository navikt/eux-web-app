import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
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
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const GrunnlagforBosetting: React.FC<GrunnlagForBosettingProps> = ({
  onValueChanged,
  personID,
  replySed,
  validation
}:GrunnlagForBosettingProps): JSX.Element => {
  const { t } = useTranslation()

  const [_newSluttDato, _setNewSluttDato] = useState<string>('')
  const [_newStartDato, _setNewStartDato] = useState<string>('')

  const [_confirmDelete, _setConfirmDelete] = useState<Array<string>>([])
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, resetValidation, performValidation] = useValidation<ValidationGrunnlagForBosettingProps>({}, validateGrunnlagForBosetting)

  const target = `${personID}.flyttegrunn`
  const flyttegrunn: Flyttegrunn = _.get(replySed, target)
  const namespace = `familymanager-${personID}-grunnlagforbosetting`

  const onAddNewClicked = () => _setSeeNewForm(true)

  const addCandidateForDeletion = (key: string) => {
    _setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    _setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const setAvsenderDato = (dato: string) => {
    resetValidation(namespace + '-avsenderdato')
    onValueChanged(`${target}.datoFlyttetTilAvsenderlandet`, dato)
  }

  const setMottakerDato = (dato: string) => {
    resetValidation(namespace + '-mottakerdato')
    onValueChanged(`${target}.datoFlyttetTilMottakerlandet`, dato)
  }

  const setStartDato = (dato: string, i: number) => {
    if (i < 0) {
      _setNewStartDato(dato)
      resetValidation(namespace + '-startdato')
    } else {
      const newPerioder: Array<Periode> = _.cloneDeep(flyttegrunn.perioder)
      newPerioder[i].startdato = dato
      onValueChanged(`${target}.perioder`, newPerioder)
    }
  }

  const setSluttDato = (dato: string, i: number) => {
    if (i < 0) {
      _setNewSluttDato(dato)
      resetValidation(namespace + '-sluttdato')
    } else {
      const newPerioder: Array<Periode> = _.cloneDeep(flyttegrunn.perioder)
      if (dato === '') {
        delete newPerioder[i].sluttdato
        newPerioder[i].aapenPeriodeType = 'åpen_sluttdato'
      } else {
        delete newPerioder[i].aapenPeriodeType
        newPerioder[i].sluttdato = dato
      }
      onValueChanged(`${target}.perioder`, newPerioder)
    }
  }

  const setElementsOfPersonalSituation = (e: string) => {
    resetValidation(namespace + '-elementer')
    onValueChanged(`${target}.personligSituasjon`, e)
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
    const newPerioder: Array<Periode> = _.cloneDeep(flyttegrunn.perioder)
    const deletedPeriods: Array<Periode> = newPerioder.splice(index, 1)
    if (deletedPeriods && deletedPeriods.length > 0) {
      removeCandidateForDeletion(getKey(deletedPeriods[0]))
    }
    onValueChanged(`${target}.perioder`, newPerioder)
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
      onValueChanged(`${target}.perioder`, newPerioder)
    }
  }

  const getErrorFor = (index: number, el: string): string | null | undefined => {
    return index < 0 ? _validation[namespace + '-' + el]?.feilmelding : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (periode: Periode | undefined, i: number) => {
    const key = periode ? getKey(periode) : 'new'
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
            valueStartDato={i < 0 ? _newStartDato : periode?.startdato}
            valueSluttDato={i < 0 ? _newSluttDato : periode?.sluttdato}
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
                onClick={onAddNewClicked}
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
