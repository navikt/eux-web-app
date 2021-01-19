import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import { State } from 'declarations/reducers'
import { Kodeverk, Person } from 'declarations/types'
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
import { useSelector } from 'react-redux'
import styled from 'styled-components'

interface AdresseProps {
  person: Person,
  highContrast: boolean
}
const AdresseDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`
const AlignEndRow = styled(Row)`
  align-items: flex-end;
`

interface PersonOpplysningerSelector {
  landkoderList: any
}

const mapState = (state: State): PersonOpplysningerSelector => ({
  landkoderList: state.app.landkoder
})

interface Adresse {
  type: string
  gateadresse: string
  postnummer: string
  by: string
  region: string
  land: string
}

const Adresser: React.FC<AdresseProps> = ({
  // person
}:AdresseProps): JSX.Element => {
  const [_adresses, setAdresses] = useState<Array<Adresse>>([])
  const [_currentType, setCurrentType] = useState<string | undefined>(undefined)
  const [_currentGateadresse, setCurrentGateadresse] = useState<string>('')
  const [_currentPostnummer, setCurrentPostnummer] = useState<string>('')
  const [_currentBy, setCurrentBy] = useState<string>('')
  const [_currentRegion, setCurrentRegion] = useState<string>('')
  const [_currentLand, setCurrentLand] = useState<string>('')
  const [_seeNewAdresseForm, setSeeNewAdresseForm] = useState<boolean>(false)
  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { landkoderList }: PersonOpplysningerSelector = useSelector<State, PersonOpplysningerSelector>(mapState)
  const { t } = useTranslation()

  const onAdresseRemove = (i: number) => {
    const newAdresses = _.cloneDeep(_adresses)
    newAdresses.splice(i, 1)
    setIsDirty(true)
    setAdresses(newAdresses)
  }

  const onAdresseAdd = (_a: Adresse) => {
    const newAdresses = _adresses.concat(_a)
    setIsDirty(true)
    setAdresses(newAdresses)
    setCurrentType(undefined)
    setCurrentGateadresse('')
    setCurrentPostnummer('')
    setCurrentBy('')
    setCurrentRegion('')
    setCurrentLand('')
  }

  const onTypeChanged = (e: string, i: number) => {
    setIsDirty(true)
    if (i < 0) {
      setCurrentType(e)
    } else {
      const newAdresses = _.cloneDeep(_adresses)
      newAdresses[i].type = e
      setAdresses(newAdresses)
    }
  }

  const onGateadresseChanged = (e: string, i: number) => {
    setIsDirty(true)
    if (i < 0) {
      setCurrentType(e)
    } else {
      const newAdresses = _.cloneDeep(_adresses)
      newAdresses[i].gateadresse = e
      setAdresses(newAdresses)
    }
  }

  const onPostnummerChanged = (e: string, i: number) => {
    setIsDirty(true)
    if (i < 0) {
      setCurrentPostnummer(e)
    } else {
      const newAdresses = _.cloneDeep(_adresses)
      newAdresses[i].postnummer = e
      setAdresses(newAdresses)
    }
  }

  const onByChanged = (e: string, i: number) => {
    setIsDirty(true)
    if (i < 0) {
      setCurrentBy(e)
    } else {
      const newAdresses = _.cloneDeep(_adresses)
      newAdresses[i].by = e
      setAdresses(newAdresses)
    }
  }

  const onRegionChanged = (e: string, i: number) => {
    setIsDirty(true)
    if (i < 0) {
      setCurrentBy(e)
    } else {
      const newAdresses = _.cloneDeep(_adresses)
      newAdresses[i].region = e
      setAdresses(newAdresses)
    }
  }

  const onLandChanged = (e: string, i: number) => {
    setIsDirty(true)
    if (i < 0) {
      setCurrentBy(e)
    } else {
      const newAdresses = _.cloneDeep(_adresses)
      newAdresses[i].land = e
      setAdresses(newAdresses)
    }
  }

  const renderRow = (a: Adresse, i: number) => (
    <>
      <Row>
        <Column data-flex='6'>
          <AlignEndRow>
            <Column>
              <HighContrastRadioPanelGroup
                checked={a.type}
                data-test-id={'c-familymanager-adresser-' + i + '-type-radiogroup'}
                id={'c-familymanager-adresser-' + i + '-type-radiogroup'}
                feil={undefined}
                legend={t('ui:label-adresse')}
                name='c-familymanager-adresser-radiogroup'
                radios={[
                  { label: t('ui:label-bostedsland'), value: 'bostedsland' },
                  { label: t('ui:label-oppholdsland'), value: 'oppholdsland' },
                  { label: t('ui:label-kontaktadresse'), value: 'kontaktadresse' }
                ]}
                onChange={(e: any) => onTypeChanged(e.target.value, i)}
              />
            </Column>
          </AlignEndRow>
          <HorizontalSeparatorDiv />
          <AlignEndRow>
            <Column>
              <HighContrastInput
                data-test-id={'c-familymanager-adresser-' + i + '-gateadresse-input'}
                id={'c-familymanager-adresser-' + i + '-gateadresse-input'}
                onChange={(e: any) => onGateadresseChanged(e.target.value, i)}
                value={a.gateadresse}
                label={t('ui:label-gateadresse')}
              />
            </Column>
          </AlignEndRow>
          <HorizontalSeparatorDiv />
          <AlignEndRow>
            <Column>
              <HighContrastInput
                data-test-id={'c-familymanager-adresser-' + i + '-postnummer-input'}
                id={'c-familymanager-adresser-' + i + '-postnummer-input'}
                onChange={(e: any) => onPostnummerChanged(e.target.value, i)}
                value={a.postnummer}
                label={t('ui:label-postnummer')}
              />
            </Column>
            <Column dat-flex='2'>
              <HighContrastInput
                data-test-id={'c-familymanager-adresser-' + i + '-by-input'}
                id={'c-familymanager-adresser-' + i + '-by-input'}
                onChange={(e: any) => onByChanged(e.target.value, i)}
                value={a.by}
                label={t('ui:label-by')}
              />
            </Column>
          </AlignEndRow>
          <HorizontalSeparatorDiv />
          <AlignEndRow>
            <Column>
              <HighContrastInput
                data-test-id={'c-familymanager-adresser-' + i + '-region-input'}
                id={'c-familymanager-adresser-' + i + '-region-input'}
                onChange={(e: any) => onRegionChanged(e.target.value, i)}
                value={a.region}
                label={t('ui:label-region')}
              />
            </Column>
            <Column dat-flex='2'>
              <CountrySelect
                data-test-id={'c-familymanager-adresser-land-' + i + '-countryselect'}
                id={'c-familymanager-adresser-' + i + '-land'}
                label={t('ui:label-landkode')}
                menuPortalTarget={document.body}
                includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
                onOptionSelected={(e: any) => onLandChanged(e.value, i)}
                placeholder={t('ui:label-choose')}
                values={a.land}
              />
            </Column>
          </AlignEndRow>
        </Column>
        <Column style={{ alignSelf: 'flex-end' }}>
          {i < 0
            ? (
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => onAdresseAdd(a)}
              >
                <Tilsette />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('ui:label-add')}
              </HighContrastFlatknapp>
              ) : (
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => onAdresseRemove(i)}
                >
                  <Trashcan />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('ui:label-remove')}
                </HighContrastFlatknapp>
              )}
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <hr />
      <VerticalSeparatorDiv />
    </>
  )

  return (
    <AdresseDiv>
      {_adresses.map((a, i) => (renderRow(a, i)))}
      {_seeNewAdresseForm
        ? (
            renderRow({
              type: _currentType,
              gateadresse: _currentGateadresse,
              postnummer: _currentPostnummer,
              by: _currentBy,
              region: _currentRegion,
              land: _currentLand
            } as Adresse, -1)
          ) : (
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
