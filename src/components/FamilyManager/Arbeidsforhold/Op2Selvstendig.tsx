import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import { Periode } from 'declarations/sed'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput, HighContrastTextArea,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const AlignEndRow = styled(Row)`
  align-items: flex-end;
`
const TextAreaDiv = styled.div`
  textarea {
    width: 100%;
  }
`

const Op2Selvstendig = ({
  personID, validation
}: any) => {
  const { t } = useTranslation()
  const [_perioder, setPerioder] = useState<Array<Periode>>([])
  const [_currentStartDato, setCurrentStartDato] = useState<string>('')
  const [_currentSluttDato, setCurrentSluttDato] = useState<string>('')
  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)
  const [_comment, setComment] = useState<string>('')

  const setStartDato = (e: string, i: number) => {
    if (i < 0) {
      setCurrentStartDato(e)
    } else {
      const newPerioder = _.cloneDeep(_perioder)
      newPerioder[i].startdato = e
      setPerioder(newPerioder)
      // onValueChanged(`${personID}.XXX`, newPerioder)
      setCurrentStartDato('')
    }
  }

  const setSluttDato = (e: string, i: number) => {
    if (i < 0) {
      setCurrentSluttDato(e)
    } else {
      const newPerioder = _.cloneDeep(_perioder)
      newPerioder[i].sluttdato = e
      setPerioder(newPerioder)
      // onValueChanged(`${personID}.XXX`, newPerioder)
      setCurrentSluttDato('')
    }
  }

  const onRemove = (i: number) => {
    const newPerioder: Array<Periode> = _.cloneDeep(_perioder)
    newPerioder.splice(i, 1)
    setPerioder(newPerioder)
  }

  const onAdd = () => {
    let newPerioder: Array<Periode> = _.cloneDeep(_perioder)
    if (_.isNil(newPerioder)) {
      newPerioder = []
    }
    const newPeriode = {
      startdato: _currentStartDato
    } as Periode
    if (_currentSluttDato) {
      newPeriode.sluttdato = _currentSluttDato
    } else {
      newPeriode.aapenPeriodeType = 'åpen_sluttdato'
    }

    newPerioder = newPerioder.concat(newPeriode)
    setPerioder(newPerioder)
    setSeeNewForm(!_seeNewForm)
  }

  const renderRow = (p: Periode | undefined, i: number) => (
    <AlignEndRow>
      <Column>
        <HighContrastInput
          data-test-id={'c-familymanager-' + personID + '-personensstatus-selvstendig-' + i + '-startdato-input'}
          feil={validation['person-' + personID + '-personensstatus-selvstendig-' + i + '-startdato']
            ? validation['person-' + personID + '-personensstatus-selvstendig-' + i + '-startdato']!.feilmelding
            : undefined}
          id={'c-familymanager-' + personID + '-personensstatus-selvstendig-' + i + '-startdato-input'}
          onChange={(e: any) => setStartDato(e.target.value, i)}
          value={i < 0 ? _currentStartDato : p?.startdato}
          label={t('label:startDate')}
          placeholder={t('elements:placeholder-date-default')}
        />
      </Column>
      <Column>
        <HighContrastInput
          data-test-id={'c-familymanager-' + personID + '-personensstatus-selvstendig-' + i + '-sluttdato-input'}
          feil={validation['person-' + personID + '-personensstatus-selvstendig-' + i + '-sluttdato']
            ? validation['person-' + personID + '-personensstatus-selvstendig-' + i + '-sluttdato']!.feilmelding
            : undefined}
          id={'c-familymanager-' + personID + '-personensstatus-selvstendig-' + i + '-sluttdato-input'}
          onChange={(e: any) => setSluttDato(e.target.value, i)}
          value={i < 0 ? _currentSluttDato : p?.sluttdato}
          label={t('label:endDate')}
          placeholder={t('elements:placeholder-date-default')}
        />
      </Column>
      <Column>
        <HighContrastFlatknapp
          mini
          kompakt
          onClick={() => i < 0 ? onAdd() : onRemove(i)}
        >
          {i < 0 ? <Tilsette /> : <Trashcan />}
          <HorizontalSeparatorDiv data-size='0.5' />
          {i < 0 ? t('label:add') : t('label:remove')}
        </HighContrastFlatknapp>
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
            <Tilsette />
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
          placeholder={t('elements:placeholder-texttosed')}
          label={t('label:additional-information')}
          onChange={(e: any) => setComment(e.target.value)}
          value={_comment}
          feil={undefined}
        />
      </TextAreaDiv>
    </>
  )
}

export default Op2Selvstendig
