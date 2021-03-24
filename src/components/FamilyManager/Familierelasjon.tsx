import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import Select from 'components/Select/Select'
import { PaddedDiv } from 'components/StyledComponents'
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

interface FamilierelasjonProps {
  familierelasjonKodeverk: Array<Kodeverk>
  highContrast: boolean
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const Familierelasjon: React.FC<FamilierelasjonProps> = ({
  familierelasjonKodeverk,
  highContrast,
  onValueChanged,
  personID,
  replySed,
  validation
}:FamilierelasjonProps): JSX.Element => {
  const [_newRelasjonType, setNewRelasjonType] = useState<string>('')
  const [_newSluttDato, setNewSluttDato] = useState<string>('')
  const [_newStartDato, setNewStartDato] = useState<string>('')
  const [_newAnnenRelasjonType, setNewAnnenRelasjonType] = useState<string>('')
  const [_newAnnenRelasjonPersonNavn, setNewAnnenRelasjonPersonNavn] = useState<string>('')
  const [_newAnnenRelasjonDato, setNewAnnenRelasjonDato] = useState<string>('')
  const [_newBorSammen, setNewBorSammen] = useState<string>('')
  const [_seeNewFamilierelasjon, setSeeNewFamilieRelasjon] = useState<boolean>(false)

  const { t } = useTranslation()
  const familierelasjoner: Array<FamilieRelasjon2> = _.get(replySed, `${personID}.familierelasjoner`)

  const onFamilieRelasjonRemove = (i: number) => {
    const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
    newFamilieRelasjoner.splice(i, 1)
    onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
  }

  const onFamilieRelasjonAdd = () => {
    const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
    const periode: Periode = {
      startdato: _newStartDato
    }
    if (_newSluttDato) {
      periode.sluttdato = _newSluttDato
    } else {
      periode.aapenPeriodeType = 'åpen_sluttdato'
    }
    newFamilieRelasjoner.push({
      relasjonType: _newRelasjonType,
      relasjonInfo: '',
      periode: periode,
      borSammen: _newBorSammen,
      annenRelasjonType: _newAnnenRelasjonType,
      annenRelasjonPersonNavn: _newAnnenRelasjonPersonNavn,
      annenRelasjonDato: _newAnnenRelasjonDato
    })
    onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)

    setNewRelasjonType('')
    setNewSluttDato('')
    setNewStartDato('')
    setNewAnnenRelasjonType('')
    setNewAnnenRelasjonPersonNavn('')
    setNewAnnenRelasjonDato('')
    setNewBorSammen('')
  }

  const setRelasjonType = (e: string, i: number) => {
    if (i < 0) {
      setNewRelasjonType(e)
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].relasjonType = e
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setSluttDato = (e: string, i: number) => {
    if (i < 0) {
      setNewSluttDato(e)
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].periode.sluttdato = e
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setStartDato = (e: string, i: number) => {
    if (i < 0) {
      setNewStartDato(e)
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].periode.startdato = e
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setAnnenRelasjonType = (e: string, i: number) => {
    if (i < 0) {
      setNewAnnenRelasjonType(e)
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].annenRelasjonType = e
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setAnnenRelasjonPersonNavn = (e: string, i: number) => {
    if (i < 0) {
      setNewAnnenRelasjonPersonNavn(e)
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].annenRelasjonPersonNavn = e
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setAnnenRelasjonDato = (e: string, i: number) => {
    if (i < 0) {
      setNewAnnenRelasjonDato(e)
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].annenRelasjonDato = e
      onValueChanged(`${personID}.familierelasjoner`, newFamilieRelasjoner)
    }
  }

  const setBorSammen = (e: string, i: number) => {
    if (i < 0) {
      setNewBorSammen(e)
    } else {
      const newFamilieRelasjoner = _.cloneDeep(familierelasjoner)
      newFamilieRelasjoner[i].borSammen = e
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
            label={t('label:type')}
            onChange={(e) => setRelasjonType(e.value, i)}
            options={familierelasjonKodeverk.map((f: Kodeverk) => ({
              label: f.term, value: f.kode
            })).concat({
              label: `${t('label:other')} (${t('label:freetext')})`,
              value: 'other'
            })}
            placeholder={t('el:placeholder-select-default')}
            selectedValue={i < 0 ? _newRelasjonType : s!.relasjonType}
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
            value={i < 0 ? _newStartDato : s?.periode.startdato}
            label={t('label:start-date')}
            placeholder={t('el:placeholder-date-default')}
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
            value={i < 0 ? _newSluttDato : s?.periode.sluttdato}
            label={t('label:end-date')}
            placeholder={t('el:placeholder-date-default')}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      {(i < 0 ? _newRelasjonType === 'other' : s?.relasjonType === 'other') && (
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
                value={i < 0 ? _newAnnenRelasjonType : s?.annenRelasjonType}
                label={t('label:other-relation')}
                placeholder={t('el:placeholder-date-default')}
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
                value={i < 0 ? _newAnnenRelasjonPersonNavn : s?.annenRelasjonPersonNavn}
                label={t('label:person-name')}
                placeholder={t('el:placeholder-date-default')}
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
                value={i < 0 ? _newAnnenRelasjonDato : s?.annenRelasjonDato}
                label={t('label:date-relation')}
                placeholder={t('el:placeholder-date-default')}
              />
            </Column>
          </Row>
          <HorizontalSeparatorDiv />
          <Row>
            <Column data-flex='2'>
              <HighContrastRadioPanelGroup
                checked={i < 0 ? _newBorSammen : s?.borSammen}
                data-test-id={'c-familymanager' + personID + '-familierelasjon-' + i + '-borsammen-radiogroup'}
                id={'c-familymanager' + personID + '-familierelasjon-' + i + '-borsammen-radiogroup'}
                feil={validation['person-' + personID + '-familierelasjon-' + i + '-borsammen']
                  ? validation['person-' + personID + '-familierelasjon-' + i + '-borsammen']!.feilmelding
                  : undefined}
                legend={t('label:live-together')}
                name={'c-familymanager' + personID + '-familierelasjon-' + i + '-borsammen'}
                radios={[
                  { label: t('label:yes'), value: 'ja' },
                  { label: t('label:no'), value: 'nei' }
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
            {i < 0 ? <Add /> : <Trashcan />}
            <HorizontalSeparatorDiv data-size='0.5' />
            {i < 0 ? t('label:add') : t('label:remove')}
          </HighContrastFlatknapp>
        </Column>
      </Row>
    </>
  )

  return (
    <PaddedDiv>
      <Undertittel>
        {t('label:familierelasjon-title')}
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
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('label:add-new-relationship')}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Familierelasjon
