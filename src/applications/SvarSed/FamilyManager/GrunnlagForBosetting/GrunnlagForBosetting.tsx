import Add from 'assets/icons/Add'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { AlignStartRow, TextAreaDiv } from 'components/StyledComponents'
import { Flyttegrunn, Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastTextArea,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])
  const [_newSluttDato, setNewSluttDato] = useState<string>('')
  const [_newStartDato, setNewStartDato] = useState<string>('')
  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)
  const [_validation, setValidation] = useState<Validation>({})

  const { t } = useTranslation()

  const target = `${personID}.flyttegrunn`
  const flyttegrunn: Flyttegrunn = _.get(replySed, target)
  const namespace = `familymanager-${personID}-grunnlagforbosetting`

  const resetValidation = (key: string): void => {
    setValidation({
      ..._validation,
      [key]: undefined
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const validation: Validation = {}
    if (!_newStartDato) {
      validation[namespace + '-startdato'] = {
        skjemaelementId: 'c-' + namespace + '-startdato-date',
        feilmelding: t('message:validation-noDate')
      } as FeiloppsummeringFeil
    }
    if (_newStartDato && !_newStartDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
      validation[namespace + '-startdato'] = {
        skjemaelementId: 'c-' + namespace + '-startdato-date',
        feilmelding: t('message:validation-invalidDate')
      } as FeiloppsummeringFeil
    }
    if (_.find(flyttegrunn.perioder, p => p.startdato === _newStartDato)) {
      validation[namespace + '-startdato'] = {
        skjemaelementId: 'c-' + namespace + '-startdato-date',
        feilmelding: t('message:validation-duplicateStartDate')
      } as FeiloppsummeringFeil
    }
    if (_newSluttDato && !_newSluttDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
      validation[namespace + '-sluttdato'] = {
        skjemaelementId: 'c-' + namespace + '-sluttdato-date',
        feilmelding: t('message:validation-invalidDate')
      } as FeiloppsummeringFeil
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const onAddNewClicked = () => setSeeNewForm(true)

  const addCandidateForDeletion = (key: string) => {
    setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const setAvsenderDato = (e: string) => {
    resetValidation(namespace + '-avsenderdato')
    onValueChanged(`${target}.datoFlyttetTilAvsenderlandet`, e)
  }

  const setMottakerDato = (e: string) => {
    resetValidation(namespace + '-mottakerdato')
    onValueChanged(`${target}.datoFlyttetTilMottakerlandet`, e)
  }

  const setStartDato = (dato: string, i: number) => {
    if (i < 0) {
      setNewStartDato(dato)
      resetValidation(namespace + '-startdato')
    } else {
      const newPerioder = _.cloneDeep(flyttegrunn.perioder)
      newPerioder[i].startdato = dato
      onValueChanged(`${target}.perioder`, newPerioder)
      setNewStartDato('')
    }
  }

  const setSluttDato = (dato: string, i: number) => {
    if (i < 0) {
      setNewSluttDato(dato)
      resetValidation(namespace + '-sluttdato')
    } else {
      const newPerioder = _.cloneDeep(flyttegrunn.perioder)
      newPerioder[i].sluttdato = dato
      onValueChanged(`${target}.perioder`, newPerioder)
      setNewSluttDato('')
    }
  }

  const setElementsOfPersonalSituation = (e: string) => {
    resetValidation(namespace + '-elementer')
    onValueChanged(`${target}.personligSituasjon`, e)
  }

  const resetForm = () => {
    setNewStartDato('')
    setNewSluttDato('')
    setValidation({})
  }

  const onCancel = () => {
    setSeeNewForm(false)
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
    if (performValidation()) {
      let newPerioder: Array<Periode> = _.cloneDeep(flyttegrunn.perioder)
      if (_.isNil(newPerioder)) {
        newPerioder = []
      }
      const newPeriode = {
        startdato: _newStartDato
      } as Periode
      if (_newSluttDato) {
        newPeriode.sluttdato = _newSluttDato
      } else {
        newPeriode.aapenPeriodeType = 'åpen_sluttdato'
      }

      newPerioder = newPerioder.concat(newPeriode)
      resetForm()
      onValueChanged(`${target}.perioder`, newPerioder)
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
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-startdato-date'}
              feil={getErrorFor(i, 'startdato')}
              id={'c-' + namespace + '[' + i + ']-startdato-date'}
              label={t('label:start-date')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDato(e.target.value, i)}
              placeholder={t('el:placeholder-date-default')}
              value={i < 0 ? _newStartDato : p?.startdato}
            />
          </Column>
          <Column>
            <HighContrastInput
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-sluttdato-date'}
              feil={getErrorFor(i, 'sluttdato')}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-sluttdato-date'}
              label={t('label:end-date')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSluttDato(e.target.value, i)}
              placeholder={t('el:placeholder-date-default')}
              value={i < 0 ? _newSluttDato : p?.sluttdato}
            />
          </Column>
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
          moment(a.startdato).isSameOrAfter(moment(b.startdato)) ? -1 : 1
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
          <HighContrastInput
            data-test-id={'c-' + namespace + '-avsenderdato-text'}
            feil={validation[namespace + '-avsenderdato']?.feilmelding}
            id={'c-' + namespace + '-avsenderdato-text'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvsenderDato(e.target.value)}
            value={flyttegrunn.datoFlyttetTilAvsenderlandet}
            label={t('label:moving-date-sender')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-mottakerdato-text'}
            feil={validation[namespace + '-mottakerdato']?.feilmelding}
            id={'c-' + namespace + '-mottakerdato-text'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMottakerDato(e.target.value)}
            value={flyttegrunn.datoFlyttetTilMottakerlandet}
            label={t('label:moving-date-receiver')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
        <Column>
          <TextAreaDiv>
            <HighContrastTextArea
              className={classNames({ 'skjemaelement__input--harFeil': validation[+namespace + '-elementer'] })}
              data-test-id={'c-' + namespace + '-elementer-text'}
              feil={validation[+namespace + '-elementer']}
              id={'c-' + namespace + '-elementer-text'}
              label={t('label:elements-of-personal-situation')}
              maxLength={500}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setElementsOfPersonalSituation(e.target.value)}
              placeholder={t('el:placeholder-input-default')}
              value={flyttegrunn.personligSituasjon}
            />
          </TextAreaDiv>
        </Column>
      </AlignStartRow>
    </>
  )
}

export default GrunnlagforBosetting
