import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import { AlignStartRow, FlexCenterDiv, TextAreaDiv } from 'components/StyledComponents'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
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

export interface NotAnsattProps {
  personID: string
  validation: Validation
}

const NotAnsatt: React.FC<NotAnsattProps> = ({
  personID, validation
}: NotAnsattProps): JSX.Element => {
  const { t } = useTranslation()
  const [_perioder, setPerioder] = useState<Array<Periode>>([])
  const [_comment, setComment] = useState<string>('')
  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])
  const [_newStartDato, setNewStartDato] = useState<string>('')
  const [_newSluttDato, setNewSluttDato] = useState<string>('')
  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)
  const [_validation, setValidation] = useState<Validation>({})

  const namespace = 'familymanager-' + personID + '-personensstatus-notansatt'

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
    if (_.find(_perioder, p => p.startdato === _newStartDato)) {
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

  const setStartDato = (dato: string, i: number) => {
    if (i < 0) {
      setNewStartDato(dato)
      resetValidation(namespace + '-startdato')
    } else {
      const newPerioder = _.cloneDeep(_perioder)
      newPerioder[i].startdato = dato
      setPerioder(newPerioder)
      // onValueChanged(`${personID}.XXX`, newPerioder)
      setNewStartDato('')
    }
  }

  const setSluttDato = (dato: string, i: number) => {
    if (i < 0) {
      setNewSluttDato(dato)
      resetValidation(namespace + '-sluttdato')
    } else {
      const newPerioder = _.cloneDeep(_perioder)
      newPerioder[i].sluttdato = dato
      setPerioder(newPerioder)
      // onValueChanged(`${personID}.XXX`, newPerioder)
      setNewSluttDato('')
    }
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
    const newPerioder: Array<Periode> = _.cloneDeep(_perioder)
    const deletedPeriods: Array<Periode> = newPerioder.splice(index, 1)
    setPerioder(newPerioder)
    if (deletedPeriods && deletedPeriods.length > 0) {
      removeCandidateForDeletion(getKey(deletedPeriods[0]))
    }
    // onValueChanged(`${personID}.XXX`, newPerioder)
  }

  const onAdd = () => {
    if (performValidation()) {
      let newPerioder: Array<Periode> = _.cloneDeep(_perioder)
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
      setPerioder(newPerioder)
      resetForm()
      // onValueChanged(`${personID}.XXX`, newPerioder)
    }
  }

  const getErrorFor = (index: number, el: string): string | null | undefined => {
    return index < 0 ? _validation[namespace + '-' + el]?.feilmelding : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (p: Periode | undefined, i: number) => {
    const key = p ? getKey(p) : 'new'
    const candidateForDeletion = i < 0 ? false : key && _confirmDelete.indexOf(key) >= 0

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
            {candidateForDeletion
              ? (
                <FlexCenterDiv className={classNames('nolabel', 'slideInFromRight')}>
                  <Normaltekst>
                    {t('label:are-you-sure')}
                  </Normaltekst>
                  <HorizontalSeparatorDiv data-size='0.5' />
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => onRemove(i)}
                  >
                    {t('label:yes')}
                  </HighContrastFlatknapp>
                  <HorizontalSeparatorDiv data-size='0.5' />
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => removeCandidateForDeletion(key!)}
                  >
                    {t('label:no')}
                  </HighContrastFlatknapp>
                </FlexCenterDiv>
                )
              : (
                <div className={classNames('nolabel')}>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => i < 0 ? onAdd() : addCandidateForDeletion(key!)}
                  >
                    {i < 0 ? <Add /> : <Trashcan />}
                    <HorizontalSeparatorDiv data-size='0.5' />
                    {i < 0 ? t('el:button-add') : t('el:button-remove')}
                  </HighContrastFlatknapp>
                  {_seeNewForm && i < 0 && (
                    <>
                      <HorizontalSeparatorDiv />
                      <HighContrastFlatknapp
                        mini
                        kompakt
                        onClick={onCancel}
                      >
                        {t('el:button-cancel')}
                      </HighContrastFlatknapp>
                    </>
                  )}
                </div>
                )}
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
      {_perioder
        .sort((a, b) =>
          moment(a.startdato).isSameOrAfter(moment(b.startdato)) ? -1 : 1
        )
        .map(renderRow)}
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
      <TextAreaDiv>
        <HighContrastTextArea
          className={classNames({
            'skjemaelement__input--harFeil': validation[namespace + '-comment']?.feilmelding
          })}
          data-test-id={'c-' + namespace + '-comment-text'}
          feil={validation[namespace + '-comment']?.feilmelding}
          id={'c-' + namespace + '-comment-text'}
          label={t('label:additional-information')}
          placeholder={t('el:placeholder-text-to-sed')}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          value={_comment}
        />
      </TextAreaDiv>
    </>
  )
}

export default NotAnsatt
