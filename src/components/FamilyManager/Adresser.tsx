import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import { Adresse, ReplySed } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import CountrySelect from 'landvelger'
import _ from 'lodash'
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

interface AdresseProps {
  highContrast: boolean
  landkoderList: Array<Kodeverk>
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}
const AdresseDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`
const AlignStartRow = styled(Row)`
  align-items: flex-start;
`

const Adresser: React.FC<AdresseProps> = ({
  landkoderList,
  onValueChanged,
  personID,
  replySed,
  validation
}:AdresseProps): JSX.Element => {
  const [_currentType, setCurrentType] = useState<string | undefined>(undefined)
  const [_currentGate, setCurrentGate] = useState<string>('')
  const [_currentPostnummer, setCurrentPostnummer] = useState<string>('')
  const [_currentBy, setCurrentBy] = useState<string>('')
  const [_currentBygning, setCurrentBygning] = useState<string>('')
  const [_currentRegion, setCurrentRegion] = useState<string>('')
  const [_currentLand, setCurrentLand] = useState<string>('')
  const [_seeNewAdresseForm, setSeeNewAdresseForm] = useState<boolean>(false)
  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { t } = useTranslation()
  const adresses: Array<Adresse> = _.get(replySed, `${personID}.adresser`)

  const onAdresseRemove = (i: number) => {
    const newAdresses = _.cloneDeep(adresses)
    newAdresses.splice(i, 1)
    setIsDirty(true)
    onValueChanged(`${personID}.adresser`, newAdresses)
  }

  const onAdresseAdd = () => {
    const newAdresses = _.cloneDeep(adresses)
    newAdresses.push({
      type: _currentType,
      gate: _currentGate,
      postnummer: _currentPostnummer,
      by: _currentBy,
      land: _currentLand,
      bygning: _currentBygning,
      region: _currentRegion
    })
    setIsDirty(true)
    setCurrentType(undefined)
    setCurrentGate('')
    setCurrentPostnummer('')
    setCurrentBy('')
    setCurrentBygning('')
    setCurrentRegion('')
    setCurrentLand('')
    onValueChanged(`${personID}.adresser`, newAdresses)
  }

  const onTypeChanged = (e: string, i: number) => {
    if (i < 0) {
      setCurrentType(e)
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[i].type = e
      setIsDirty(true)
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const onGateChanged = (e: string, i: number) => {
    if (i < 0) {
      setCurrentGate(e)
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[i].gate = e
      setIsDirty(true)
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const onPostnummerChanged = (e: string, i: number) => {
    if (i < 0) {
      setCurrentPostnummer(e)
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[i].postnummer = e
      setIsDirty(true)
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const onByChanged = (e: string, i: number) => {
    if (i < 0) {
      setCurrentBy(e)
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[i].by = e
      setIsDirty(true)
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const onBygningChanged = (e: string, i: number) => {
    if (i < 0) {
      setCurrentBygning(e)
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[i].bygning = e
      setIsDirty(true)
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const onRegionChanged = (e: string, i: number) => {
    if (i < 0) {
      setCurrentRegion(e)
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[i].region = e
      setIsDirty(true)
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const onLandChanged = (e: string, i: number) => {
    if (i < 0) {
      setCurrentLand(e)
    } else {
      const newAdresses = _.cloneDeep(adresses)
      newAdresses[i].land = e
      setIsDirty(true)
      onValueChanged(`${personID}.adresser`, newAdresses)
    }
  }

  const renderRow = (a: Adresse | null, i: number) => (
    <>
      <AlignStartRow>
        <Column>
          <HighContrastRadioPanelGroup
            checked={i < 0 ? _currentType : a!.type}
            data-test-id={'c-familymanager-' + personID + '-adresser-' + i + '-type-radiogroup'}
            id={'c-familymanager-' + personID + '-adresser-' + i + '-type-radiogroup'}
            feil={validation['person-' + personID + '-adresser-' + i + '-type-radiogroup']
              ? validation['person-' + personID + '-adresser-' + i + '-typetype']!.feilmelding
              : undefined}
            legend={t('ui:label-adresse')}
            name={'c-familymanager-' + personID + '-adresser-radiogroup'}
            radios={[
              { label: t('ui:label-bostedsland'), value: 'bosted' },
              { label: t('ui:label-oppholdsland'), value: 'opphold' },
              { label: t('ui:label-kontaktadresse'), value: 'kontakt' }
            ]}
            onChange={(e: any) => onTypeChanged(e.target.value, i)}
          />
        </Column>
      </AlignStartRow>
      <HorizontalSeparatorDiv />
      <AlignStartRow>
        <Column data-flex='2'>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-adresser-' + i + '-gate-input'}
            feil={validation['person-' + personID + '-adresser-' + i + '-gate']
              ? validation['person-' + personID + '-adresser-' + i + '-gate']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-adresser-' + i + '-gate-input'}
            onChange={(e: any) => onGateChanged(e.target.value, i)}
            value={i < 0 ? _currentGate : a?.gate}
            label={t('ui:label-gateadresse')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-adresser-' + i + '-bygning-input'}
            feil={validation['person-' + personID + '-adresser-' + i + '-bygning']
              ? validation['person-' + personID + '-adresser-' + i + '-bygning']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-adresser-' + i + '-bygning-input'}
            onChange={(e: any) => onBygningChanged(e.target.value, i)}
            value={i < 0 ? _currentBygning : a?.bygning}
            label={t('ui:label-bygning')}
          />
        </Column>
      </AlignStartRow>
      <HorizontalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-adresser-' + i + '-postnummer-input'}
            feil={validation['person-' + personID + '-adresser-' + i + '-gate']
              ? validation['person-' + personID + '-adresser-' + i + '-gate']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-adresser-' + i + '-postnummer-input'}
            onChange={(e: any) => onPostnummerChanged(e.target.value, i)}
            value={i < 0 ? _currentPostnummer : a?.postnummer}
            label={t('ui:label-postnummer')}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-adresser-' + i + '-by-input'}
            feil={validation['person-' + personID + '-adresser-' + i + '-by']
              ? validation['person-' + personID + '-adresser-' + i + '-by']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-adresser-' + i + '-by-input'}
            onChange={(e: any) => onByChanged(e.target.value, i)}
            value={i < 0 ? _currentBy : a?.by}
            label={t('ui:label-by')}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <HorizontalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-adresser-' + i + '-region-input'}
            feil={validation['person-' + personID + '-adresser-' + i + '-region']
              ? validation['person-' + personID + '-adresser-' + i + '-region']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-adresser-' + i + '-region-input'}
            onChange={(e: any) => onRegionChanged(e.target.value, i)}
            value={i < 0 ? _currentRegion : a?.region}
            label={t('ui:label-region')}
          />
        </Column>
        <Column>
          <CountrySelect
            data-test-id={'c-familymanager-' + personID + '-adresser-' + i + '-land-countryselect'}
            error={validation['person-' + personID + '-adresser-' + i + '-land']
              ? validation['person-' + personID + '-adresser-' + i + '-land']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-adresser-' + i + '-land-countryselect'}
            label={t('ui:label-landkode')}
            menuPortalTarget={document.body}
            includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
            onOptionSelected={(e: any) => onLandChanged(e.value, i)}
            placeholder={t('ui:label-choose')}
            values={i < 0 ? _currentLand : a?.land}
          />
        </Column>
        <Column style={{ alignSelf: 'flex-end' }}>
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => i < 0 ? onAdresseAdd() : onAdresseRemove(i)}
          >
            {i < 0 ? <Tilsette /> : <Trashcan />}
            <HorizontalSeparatorDiv data-size='0.5' />
            {i < 0 ? t('ui:label-add') : t('ui:label-remove')}
          </HighContrastFlatknapp>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv data-size='3' />
    </>
  )

  return (
    <AdresseDiv>
      {adresses?.map((a, i) => (renderRow(a, i)))}
      <hr />
      {_seeNewAdresseForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setSeeNewAdresseForm(true)}
              >
                <Tilsette />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('ui:label-add-new-adresse')}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      {_isDirty && '*'}
    </AdresseDiv>
  )
}

export default Adresser
