import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import Select from 'components/Select/Select'
import { FamilieRelasjon2, Periode, ReplySed } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import _ from 'lodash'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface FamilierelasjonProps {
  familierelasjonKodeverk: Array<Kodeverk>
  highContrast: boolean
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}
const FamilierelasjonDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`
const Familierelasjon: React.FC<FamilierelasjonProps> = ({
  familierelasjonKodeverk,
  highContrast,
  onValueChanged,
  personID,
  replySed,
  validation
}:FamilierelasjonProps): JSX.Element => {
  const [_currentRelasjonType, setCurrentRelasjonType] = useState<string>('')
  const [_currentSluttDato, setCurrentSluttDato] = useState<string>('')
  const [_currentStartDato, setCurrentStartDato] = useState<string>('')
  const [_currentAnnenRelasjonType, setCurrentAnnenRelasjonType] = useState<string>('')
  const [_currentAnnenRelasjonPersonNavn, setCurrentAnnenRelasjonPersonNavn] = useState<string>('')
  const [_currentAnnenRelasjonDato, setCurrentAnnenRelasjonDato] = useState<string>('')
  const [_currentBorSammen, setCurrentBorSammen] = useState<string>('')
  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const [_seeNewFamilierelasjon, setSeeNewFamilieRelasjon] = useState<boolean>(false)
  const { t } = useTranslation()
  const familierelasjoner: Array<FamilieRelasjon2> = _.get(replySed, `${personID}.familierelasjoner`)

  const onFamilieRelasjonRemove = (i: number) => {
    const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
    newFamilieRelasjoner.splice(i, 1)
    setIsDirty(true)
    onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
  }

  const onFamilieRelasjonAdd = () => {
    const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
    const periode: Periode = {
      startdato: _currentStartDato
    }
    if (_currentSluttDato) {
      periode.sluttdato = _currentSluttDato
    } else {
      periode.aapenPeriodeType = 'åpen_sluttdato'
    }
    newFamilieRelasjoner.push({
      relasjonType: _currentRelasjonType,
      relasjonInfo: '',
      periode: periode,
      borSammen: _currentBorSammen,
      annenRelasjonType: _currentAnnenRelasjonType,
      annenRelasjonPersonNavn: _currentAnnenRelasjonPersonNavn,
      annenRelasjonDato: _currentAnnenRelasjonDato
    })
    setIsDirty(true)
    onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)

    setCurrentRelasjonType('')
    setCurrentSluttDato('')
    setCurrentStartDato('')
    setCurrentAnnenRelasjonType('')
    setCurrentAnnenRelasjonPersonNavn('')
    setCurrentAnnenRelasjonDato('')
    setCurrentBorSammen('')
  }

  const setRelasjonType = (e: string, i: number) => {
    if (i < 0) {
      setCurrentRelasjonType(e)
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].relasjonType = e
      setIsDirty(true)
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setSluttDato = (e: string, i: number) => {
    if (i < 0) {
      setCurrentSluttDato(e)
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].periode.sluttdato = e
      setIsDirty(true)
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setStartDato = (e: string, i: number) => {
    if (i < 0) {
      setCurrentStartDato(e)
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].periode.startdato = e
      setIsDirty(true)
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setAnnenRelasjonType = (e: string, i: number) => {
    if (i < 0) {
      setCurrentAnnenRelasjonType(e)
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].annenRelasjonType = e
      setIsDirty(true)
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setAnnenRelasjonPersonNavn = (e: string, i: number) => {
    if (i < 0) {
      setCurrentAnnenRelasjonPersonNavn(e)
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].annenRelasjonPersonNavn = e
      setIsDirty(true)
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setAnnenRelasjonDato = (e: string, i: number) => {
    if (i < 0) {
      setCurrentAnnenRelasjonDato(e)
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].annenRelasjonDato = e
      setIsDirty(true)
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setBorSammen = (e: string, i: number) => {
    if (i < 0) {
      setCurrentBorSammen(e)
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].borSammen = e
      setIsDirty(true)
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const renderRow = (s: FamilieRelasjon2 | null, i: number) => (
    <>
      <Row>
        <Column data-flex='2'>
          <Select
            data-test-id={'c-familymanager-' + personID + '-familierelasjon-' + i + '-relasjontype-select'}
            feil={validation['person-' + personID + '-familierelasjon-' + i + '-relasjontype']
              ? validation['person-' + personID + '-familierelasjon-' + i + '-relasjontype']!.feilmelding
              : undefined}
            highContrast={highContrast}
            id={'c-familymanager-' + personID + '-familierelasjon-' + i + '-relasjontype-select'}
            label={t('ui:label-type')}
            onChange={(e) => setRelasjonType(e.value, i)}
            options={familierelasjonKodeverk.map((f: Kodeverk) => ({
              label: f.term, value: f.kode
            })).concat({
              label: `${t('ui:label-other')} (${t('ui:label-freetext')})`,
              value: 'other'
            })}
            placeholder={t('ui:placeholder-select-default')}
            selectedValue={i < 0 ? _currentRelasjonType : s!.relasjonType}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-familierelasjon-' + i + '-startdato-input'}
            feil={validation['person-' + personID + '-familierelasjon-' + i + '-startdato']
              ? validation['person-' + personID + '-familierelasjon-' + i + '-startdato']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-familierelasjon-' + i + '-startdato-input'}
            onChange={(e: any) => setStartDato(e.target.value, i)}
            value={i < 0 ? _currentStartDato : s?.periode.startdato}
            label={t('ui:label-startDate')}
            placeholder={t('ui:placeholder-date-default')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-familierelasjon-' + i + '-sluttdato-input'}
            feil={validation['person-' + personID + '-familierelasjon-' + i + '-sluttdato']
              ? validation['person-' + personID + '-familierelasjon-' + i + '-sluttdato']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-familierelasjon-' + i + '-sluttdato-input'}
            onChange={(e: any) => setSluttDato(e.target.value, i)}
            value={i < 0 ? _currentSluttDato : s?.periode.sluttdato}
            label={t('ui:label-endDate')}
            placeholder={t('ui:placeholder-date-default')}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      {(i < 0 ? _currentRelasjonType === 'other' : s?.relasjonType === 'other') && (
        <>
          <Row>
            <Column>
              <HighContrastInput
                data-test-id={'c-familymanager-' + personID + '-familierelasjon-' + i + '-annenrelasjontype-input'}
                feil={validation['person-' + personID + '-familierelasjon-' + i + '-annenrelasjontype']
                  ? validation['person-' + personID + '-familierelasjon-' + i + '-annenrelasjontype']!.feilmelding
                  : undefined}
                id={'c-familymanager-' + personID + '-familierelasjon-' + i + '-annenrelasjontype-input'}
                onChange={(e: any) => setAnnenRelasjonType(e.target.value, i)}
                value={i < 0 ? _currentAnnenRelasjonType : s?.annenRelasjonType}
                label={t('ui:label-other-relation')}
                placeholder={t('ui:placeholder-date-default')}
              />
            </Column>
            <Column />
          </Row>
          <HorizontalSeparatorDiv />
          <Row>
            <Column data-flex='2'>
              <HighContrastInput
                data-test-id={'c-familymanager-' + personID + '-familierelasjon-' + i + '-annenrelasjonpersonnavn-input'}
                feil={validation['person-' + personID + '-familierelasjon-' + i + '-annenrelasjonpersonnavn']
                  ? validation['person-' + personID + '-familierelasjon-' + i + '-annenrelasjonpersonnavn']!.feilmelding
                  : undefined}
                id={'c-familymanager-' + personID + '-familierelasjon-' + i + '-annenrelasjonpersonnavn-input'}
                onChange={(e: any) => setAnnenRelasjonPersonNavn(e.target.value, i)}
                value={i < 0 ? _currentAnnenRelasjonPersonNavn : s?.annenRelasjonPersonNavn}
                label={t('ui:label-person-name')}
                placeholder={t('ui:placeholder-date-default')}
              />
            </Column>
            <Column>
              <HighContrastInput
                data-test-id={'c-familymanager-' + personID + '-familierelasjon-' + i + '-annenrelasjondato-input'}
                feil={validation['person-' + personID + '-familierelasjon-' + i + '-annenrelasjondato']
                  ? validation['person-' + personID + '-familierelasjon-' + i + '-annenrelasjondato']!.feilmelding
                  : undefined}
                id={'c-familymanager-' + personID + '-familierelasjon-' + i + '-annenrelasjondato-input'}
                onChange={(e: any) => setAnnenRelasjonDato(e.target.value, i)}
                value={i < 0 ? _currentAnnenRelasjonDato : s?.annenRelasjonDato}
                label={t('ui:label-date-relation')}
                placeholder={t('ui:placeholder-date-default')}
              />
            </Column>
          </Row>
          <HorizontalSeparatorDiv />
          <Row>
            <Column data-flex='2'>
              <HighContrastRadioPanelGroup
                checked={i < 0 ? _currentBorSammen : s?.borSammen}
                data-test-id={'c-familymanager' + personID + '-familierelasjon-' + i + '-borsammen-radiogroup'}
                id={'c-familymanager' + personID + '-familierelasjon-' + i + '-borsammen-radiogroup'}
                feil={validation['person-' + personID + '-familierelasjon-' + i + '-borsammen']
                  ? validation['person-' + personID + '-familierelasjon-' + i + '-borsammen']!.feilmelding
                  : undefined}
                legend={t('ui:label-live-together')}
                name={'c-familymanager' + personID + '-familierelasjon-' + i + '-borsammen'}
                radios={[
                  { label: t('ui:label-yes'), value: 'ja' },
                  { label: t('ui:label-no'), value: 'nei' }
                ]}
                onChange={(e: any) => setBorSammen(e.target.value, i)}
              />
            </Column>
          </Row>
        </>
      )}
      <Row>
        <Column>
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => (i < 0 ? onFamilieRelasjonAdd() : onFamilieRelasjonRemove(i))}
          >
            {i < 0 ? <Tilsette /> : <Trashcan />}
            <HorizontalSeparatorDiv data-size='0.5' />
            {i < 0 ? t('ui:label-add') : t('ui:label-remove')}
          </HighContrastFlatknapp>
        </Column>
      </Row>
    </>
  )

  return (
    <FamilierelasjonDiv>
      <Undertittel>
        {t('ui:label-familierelasjon-title')}
      </Undertittel>
      <VerticalSeparatorDiv />
      {familierelasjoner.map(renderRow)}
      <hr />
      {_seeNewFamilierelasjon
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setSeeNewFamilieRelasjon(true)}
              >
                <Tilsette />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('ui:label-add-new-relationship')}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      {_isDirty && '*'}
    </FamilierelasjonDiv>
  )
}

export default Familierelasjon
