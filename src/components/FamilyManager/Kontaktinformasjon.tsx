import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import Select from 'components/Select/Select'
import { Epost, ReplySed, Telefon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { UndertekstBold } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface KontaktinformasjonProps {
  highContrast: boolean
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}
const KontaktinformasjonDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`
const Kontaktinformasjon: React.FC<KontaktinformasjonProps> = ({
  highContrast,
  onValueChanged,
  personID,
  replySed,
  validation
}:KontaktinformasjonProps): JSX.Element => {
  const [_currentNummer, setCurrentNummer] = useState<string>('')
  const [_currentType, setCurrentType] = useState<string>('')
  const [_currentEpost, setCurrentEpost] = useState<string>('')
  const [_seeNewTelefonForm, setSeeNewTelefonForm] = useState<boolean>(false)
  const [_seeNewEpostForm, setSeeNewEpostForm] = useState<boolean>(false)
  const { t } = useTranslation()
  const telefoner: Array<Telefon> = _.get(replySed, `${personID}.telefon`)
  const eposter: Array<Epost> = _.get(replySed, `${personID}.epost`)

  const onTelefonRemoved = (i: number) => {
    const newTelefoner = _.cloneDeep(telefoner)
    newTelefoner.splice(i, 1)
    onValueChanged(`${personID}.telefon`, newTelefoner)
  }

  const onEpostRemoved = (i: number) => {
    const newEposter = _.cloneDeep(eposter)
    newEposter.splice(i, 1)
    onValueChanged(`${personID}.epost`, newEposter)
  }

  const onTelefonAdd = () => {
    const newTelefoner = _.cloneDeep(telefoner)
    newTelefoner.push({
      type: _currentType,
      nummer: _currentNummer
    })
    setCurrentType('')
    setCurrentNummer('')
    onValueChanged(`${personID}.telefon`, newTelefoner)
  }

  const onEpostAdd = () => {
    const newEposter = _.cloneDeep(eposter)
    newEposter.push({
      adresse: _currentEpost
    })
    setCurrentEpost('')
    onValueChanged(`${personID}.epost`, newEposter)
  }

  const onTypeChanged = (e: string, i: number) => {
    if (i < 0) {
      setCurrentType(e)
    } else {
      const newTelefoner = _.cloneDeep(telefoner)
      newTelefoner[i].type = e
      onValueChanged(`${personID}.telefon`, newTelefoner)
    }
  }

  const onNummerChanged = (e: string, i: number) => {
    if (i < 0) {
      setCurrentNummer(e)
    } else {
      const newTelefoner = _.cloneDeep(telefoner)
      newTelefoner[i].nummer = e
      onValueChanged(`${personID}.telefon`, newTelefoner)
    }
  }

  const onEpostChanged = (e: string, i: number) => {
    if (i < 0) {
      setCurrentEpost(e)
    } else {
      const newEposter = _.cloneDeep(eposter)
      newEposter[i].adresse = e
      onValueChanged(`${personID}.epost`, newEposter)
    }
  }

  const renderTelefon = (_t: Telefon | null, i: number) => (
    <>
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-kontaktinformasjon-' + i + '-nummer-input'}
            feil={validation['person-' + personID + '-kontaktinformasjon-' + i + '-nummer']
              ? validation['person-' + personID + '-kontaktinformasjon-' + i + '-nummer']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-kontaktinformasjon-' + i + '-nummer-input'}
            onChange={(e: any) => onNummerChanged(e.target.value, i)}
            value={i < 0 ? _currentNummer : _t?.nummer}
            placeholder={t('el:placeholder-input-default')}
          />
        </Column>
        <Column>
          <Select
            data-test-id={'c-familymanager-' + personID + '-kontaktinformasjon-' + i + '-type-select'}
            error={validation['person-' + personID + '-kontaktinformasjon-' + i + '-type']
              ? validation['person-' + personID + '-kontaktinformasjon-' + i + '-type']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-kontaktinformasjon-' + i + '-type-select'}
            highContrast={highContrast}
            onChange={(e) => onTypeChanged(e.value, i)}
            options={[{
              label: t('el:option-work'), value: 'Arbeid'
            }, {
              label: t('el:option-home'), value: 'Hjem'
            }, {
              label: t('el:option-mobile'), value: 'Mobil'
            }]}
            placeholder={t('el:placeholder-select-default')}
            value={i < 0 ? _currentType : _t?.type}
          />
        </Column>
        <Column style={{ alignSelf: 'flex-end' }}>
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => i < 0 ? onTelefonAdd() : onTelefonRemoved(i)}
          >
            {i < 0 ? <Add /> : <Trashcan />}
            <HorizontalSeparatorDiv data-size='0.5' />
            {i < 0 ? t('label:add') : t('label:remove')}
          </HighContrastFlatknapp>
        </Column>
      </Row>
      <VerticalSeparatorDiv />
    </>
  )

  const renderEpost = (e: Epost | null, i: number) => (
    <>
      <Row>
        <Column data-flex='2'>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-kontaktinformasjon-' + i + '-epost-input'}
            id={'c-familymanager-' + personID + '-kontaktinformasjon-' + i + '-epost-input'}
            onChange={(e: any) => onEpostChanged(e.target.value, i)}
            value={i < 0 ? _currentEpost : e?.adresse}
            placeholder={t('el:placeholder-input-default')}
          />
        </Column>
        <Column style={{ alignSelf: 'flex-end' }}>
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => i < 0 ? onEpostAdd() : onEpostRemoved(i)}
          >
            {i < 0 ? <Add /> : <Trashcan />}
            <HorizontalSeparatorDiv data-size='0.5' />
            {i < 0 ? t('label:add') : t('label:remove')}
          </HighContrastFlatknapp>
        </Column>
      </Row>
      <VerticalSeparatorDiv />
    </>
  )

  return (
    <KontaktinformasjonDiv>
      <Row>
        <Column>
          <UndertekstBold>
            {t('label:telefonnummer')}
          </UndertekstBold>
        </Column>
        <Column>
          <UndertekstBold>
            {t('label:type')}
          </UndertekstBold>
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      {telefoner?.map((t, i) => (renderTelefon(t, i)))}
      <hr />
      {_seeNewTelefonForm
        ? renderTelefon(null, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setSeeNewTelefonForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('label:add-new-telefon')}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv data-size='3' />
      <Row>
        <Column>
          <UndertekstBold>
            {t('label:epost')}
          </UndertekstBold>
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      {eposter?.map((e, i) => (renderEpost(e, i)))}
      <hr />
      {_seeNewEpostForm
        ? renderEpost(null, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setSeeNewEpostForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('label:add-new-epost')}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </KontaktinformasjonDiv>
  )
}

export default Kontaktinformasjon
