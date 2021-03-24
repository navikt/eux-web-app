import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import { AlignEndRow } from 'components/StyledComponents'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
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
import styled from 'styled-components'

const TextAreaDiv = styled.div`
  textarea {
    width: 100%;
  }
`
const NotAnsatt = ({
  personID, validation
}: any) => {
  const { t } = useTranslation()
  const [_perioder, setPerioder] = useState<Array<Periode>>([])
  const [_newStartDato, setNewStartDato] = useState<string>('')
  const [_newSluttDato, setNewSluttDato] = useState<string>('')
  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)
  const [_comment, setComment] = useState<string>('')
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
        skjemaelementId: 'c-' + namespace + '-startdato-input',
        feilmelding: t('message:validation-noDate')
      } as FeiloppsummeringFeil
    }
    if (_newStartDato && !_newStartDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
      validation[namespace + '-startdato'] = {
        skjemaelementId: 'c-' + namespace + '-startdato-input',
        feilmelding: t('message:validation-invalidDate')
      } as FeiloppsummeringFeil
    }
    if (_newSluttDato && !_newSluttDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
      validation[namespace + '-sluttdato'] = {
        skjemaelementId: 'c-' + namespace + '-sluttdato-input',
        feilmelding: t('message:validation-invalidDate')
      } as FeiloppsummeringFeil
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const setStartDato = (e: string, i: number) => {
    if (i < 0) {
      setNewStartDato(e)
      resetValidation( namespace + '-startdato')
    } else {
      const newPerioder = _.cloneDeep(_perioder)
      newPerioder[i].startdato = e
      setPerioder(newPerioder)
      // onValueChanged(`${personID}.XXX`, newPerioder)
      setNewStartDato('')
    }
  }

  const setSluttDato = (e: string, i: number) => {
    if (i < 0) {
      setNewSluttDato(e)
      resetValidation( namespace + '-sluttdato')
    } else {
      const newPerioder = _.cloneDeep(_perioder)
      newPerioder[i].sluttdato = e
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

  const onRemove = (i: number) => {
    const newPerioder: Array<Periode> = _.cloneDeep(_perioder)
    newPerioder.splice(i, 1)
    setPerioder(newPerioder)
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
      setSeeNewForm(!_seeNewForm)
    }
  }

  const renderRow = (p: Periode | undefined, i: number) => (
    <AlignEndRow>
      <Column>
        <HighContrastInput
          data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-startdato-input'}
          feil={i < 0 ?
            _validation[namespace + '-startdato']?.feilmelding :
            validation[namespace + '[' + i + ']-startdato']?.feilmelding}
          id={'c-' + namespace + '[' + i + ']-startdato-input'}
          label={t('label:start-date')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDato(e.target.value, i)}
          placeholder={t('el:placeholder-date-default')}
          value={i < 0 ? _newStartDato : p?.startdato}
        />
      </Column>
      <Column>
        <HighContrastInput
          data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-sluttdato-input'}
          feil={i < 0 ?
            _validation[namespace + '-sluttdato']?.feilmelding :
            validation[namespace + '[' + i + ']-sluttdato']?.feilmelding}
          id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-sluttdato-input'}
          label={t('label:end-date')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSluttDato(e.target.value, i)}
          placeholder={t('el:placeholder-date-default')}
          value={i < 0 ? _newSluttDato : p?.sluttdato}
        />

      </Column>
      <Column>
        <div>
          <HighContrastFlatknapp
          mini
          kompakt
          onClick={() => i < 0 ? onAdd() : onRemove(i)}
        >
          {i < 0 ? <Add /> : <Trashcan />}
          <HorizontalSeparatorDiv data-size='0.5' />
          {i < 0 ? t('label:add') : t('label:remove')}
        </HighContrastFlatknapp>
          {_seeNewForm && i < 0 && (
            <>
              <HorizontalSeparatorDiv/>
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
      </Column>
    </AlignEndRow>
  )

  return (
    <>
      <Undertittel>
        {t('label:ansettelsesperioder')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {_perioder.map(renderRow)}
      <hr />
      {_seeNewForm && renderRow(undefined, -1)}
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => setSeeNewForm(!_seeNewForm)}
          >
            <Add />
            <HorizontalSeparatorDiv data-size='0.5' />
            {t('label:add-new-periode')}
          </HighContrastFlatknapp>
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <TextAreaDiv>
        <HighContrastTextArea
          data-test-id={'c-familymanager-' + personID + '-personensstatus-selvstendig-info-textarea'}
          id={'c-familymanager-' + personID + '-personensstatus-selvstendig-info-textarea'}
          className={classNames({
            'skjemaelement__input--harFeil':
              validation['c-familymanager-' + personID + '-personensstatus-selvstendig-info-textarea']
          })}
          placeholder={t('el:placeholder-texttosed')}
          label={t('label:additional-information')}
          onChange={(e: any) => setComment(e.target.value)}
          value={_comment}
          feil={undefined}
        />
      </TextAreaDiv>
    </>
  )
}

export default NotAnsatt
