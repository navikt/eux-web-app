import { searchPerson } from 'actions/svarpased'
import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import { Pin, ReplySed } from 'declarations/sed'
import { Kodeverk, Person, Validation } from 'declarations/types'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

interface PersonOpplysningerProps {
  landkoderList: Array<Kodeverk>
  highContrast: boolean
  personID: string | undefined
  replySed: ReplySed
  searchingPerson: boolean
  searchedPerson: Person | undefined
  validation: Validation
  onValueChanged: (needle: string, value: any) => void
}
const PersonOpplysningerDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`
const FlexDiv = styled.div`
  display: flex;
  align-items: flex-end;
`

const PersonOpplysninger: React.FC<PersonOpplysningerProps> = ({
  // highContrast,
  landkoderList,
  onValueChanged,
  personID,
  replySed,
  searchedPerson,
  searchingPerson,
  validation
}:PersonOpplysningerProps): JSX.Element => {
  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onFornavnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    onValueChanged(`${personID}.personInfo.fornavn`, e.target.value)
  }

  const onEtternavnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    onValueChanged(`${personID}.personInfo.etternavn`, e.target.value)
  }

  const onFodselsdatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    onValueChanged(`${personID}.personInfo.foedselsdato`, e.target.value)
  }

  const onKjoennChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    onValueChanged(`${personID}.personInfo.kjoenn`, e.target.value)
  }

  const onUtenlandskPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    const pin: Array<Pin> = _.get(replySed, `${personID}.personInfo.pin`)
    const utendanskPinIndex = _.findIndex(pin, p => p.land !== 'NO')
    if (utendanskPinIndex >= 0) {
      pin[utendanskPinIndex].identifikator = e.target.value
    } else {
      pin.push({
        identifikator: e.target.value
      })
    }
    onValueChanged(`${personID}.personInfo.pin`, pin)
  }

  const onUtenlandskLandChange = (land: string) => {
    setIsDirty(true)
    const pin: Array<Pin> = _.get(replySed, `${personID}.personInfo.pin`)
    const utendanskPinIndex = _.findIndex(pin, p => p.land !== 'NO')
    if (utendanskPinIndex >= 0) {
      pin[utendanskPinIndex].land = land
    } else {
      pin.push({
        land: land
      })
    }
    onValueChanged(`${personID}.personInfo.pin`, pin)
  }

  const onNorwegianPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    const pin: Array<Pin> = _.get(replySed, `${personID}.personInfo.pin`)
    const norwegianPinIndex = _.findIndex(pin, p => p.land === 'NO')
    if (norwegianPinIndex >= 0) {
      pin[norwegianPinIndex].identifikator = e.target.value
    } else {
      pin.push({
        identifikator: e.target.value
      })
    }
    onValueChanged(`${personID}.personInfo.pin`, pin)
  }

  const onFoedestedByChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    onValueChanged(`${personID}.personInfo.pinMangler.foedested.by`, e.target.value)
  }

  const onFoedestedRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    onValueChanged(`${personID}.personInfo.pinMangler.foedested.region`, e.target.value)
  }

  const onFoedestedLandChange = (land: string) => {
    setIsDirty(true)
    onValueChanged(`${personID}.personInfo.pinMangler.foedested.land`, land)
    return true
  }

  const onSetAddBirthPlace = (value: boolean) => {
    onValueChanged(`toDelete.${personID}.foedested.visible`, value)
  }

  const onSearchUser = () => {
    setIsDirty(true)
    const pin: Array<Pin> = _.get(replySed, `${personID}.personInfo.pin`)
    const norwegianPin = _.find(pin, p => p.land === 'NO')
    if (norwegianPin) {
      dispatch(searchPerson(norwegianPin.identifikator))
    }
  }

  return (
    <PersonOpplysningerDiv key={personID}>
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-personopplysninger-fornavn-input'}
            feil={validation['person-' + personID + '-personopplysninger-fornavn']
              ? validation['person-' + personID + '-personopplysninger-fornavn']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-personopplysninger-fornavn-input'}
            onChange={onFornavnChange}
            value={_.get(replySed, `${personID}.personInfo.fornavn`)}
            label={t('ui:label-firstname') + ' *'}
          />
        </Column>
        <HorizontalSeparatorDiv />
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-personopplysninger-etternavn-input'}
            feil={validation['person-' + personID + '-personopplysninger-etternavn']
              ? validation['person-' + personID + '-personopplysninger-etternavn']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-personopplysninger-etternavn-input'}
            onChange={onEtternavnChange}
            value={_.get(replySed, `${personID}.personInfo.etternavn`)}
            label={t('ui:label-lastname') + ' *'}
          />
        </Column>
        <HorizontalSeparatorDiv />
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-personopplysninger-foedselsdato-input'}
            feil={validation['person-' + personID + '-personopplysninger-foedselsdato']
              ? validation['person-' + personID + '-personopplysninger-foedselsdato']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-personopplysninger-foedselsdato-input'}
            onChange={onFodselsdatoChange}
            value={_.get(replySed, `${personID}.personInfo.foedselsdato`)}
            placeholder={t('ui:placeholder-birthDate')}
            label={t('ui:label-birthDate') + ' *'}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_.get(replySed, `${personID}.personInfo.kjoenn`)}
            data-multiple-line='false'
            data-test-id={'c-familymanager-' + personID + '-personopplysninger-kjoenn-radiogroup'}
            feil={validation['person-' + personID + '-personopplysninger-kjoenn']
              ? validation['person-' + personID + '-personopplysninger-kjoenn']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-personopplysninger-kjoenn-radiogroup'}
            legend={t('ui:label-gender') + ' *'}
            name={'c-familymanager-' + personID + '-personopplysninger-kjoenn-radiogroup'}
            onChange={onKjoennChange}
            radios={[
              { label: t(personID?.startsWith('barn') ? 'ui:label-girl' : 'ui:label-woman'), value: 'K' },
              { label: t(personID?.startsWith('barn') ? 'ui:label-boy' : 'ui:label-man'), value: 'M' },
              { label: t('ui:label-unknown'), value: 'U' }
            ]}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-personopplysninger-utenlandskPin-input'}
            feil={validation['person-' + personID + '-personopplysninger-utenlandskPin']
              ? validation['person-' + personID + '-personopplysninger-utenlandskPin']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-personopplysninger-utenlandskPin-input'}
            label={t('ui:label-utenlandskPin')}
            onChange={onUtenlandskPinChange}
            value={_.find(_.get(replySed, `${personID}.personInfo.pin`), p => p.land !== 'NO')?.identifikator}
          />
        </Column>
        <Column data-flex='2'>
          <CountrySelect
            data-test-id={'c-familymanager-' + personID + '-personopplysninger-land-countryselect'}
            error={validation['person-' + personID + '-personopplysninger-land']
              ? validation['person-' + personID + '-personopplysninger-land']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-personopplysninger-land-countryselect'}
            includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
            label={t('ui:label-landkode')}
            menuPortalTarget={document.body}
            onChange={onUtenlandskLandChange}
            onOptionSelected={(e: any) => {
              onUtenlandskLandChange(e.value)
            }}
            placeholder={t('ui:label-choose')}
            values={_.find(_.get(replySed, `${personID}.personInfo.pin`), p => p.land !== 'NO')?.land}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <FlexDiv>
            <HighContrastInput
              bredde='XL'
              data-test-id={'c-familymanager-' + personID + '-personopplysninger-norwegianpin-input'}
              feil={validation['person-' + personID + '-personopplysninger-norwegianpin']
                ? validation['person-' + personID + '-personopplysninger-norwegianpin']!.feilmelding
                : undefined}
              id={'c-familymanager-' + personID + '-personopplysninger-norwegianpin-input'}
              label={t('ui:label-norwegian-fnr')}
              onChange={onNorwegianPinChange}
              value={_.find(_.get(replySed, `${personID}.personInfo.pin`), p => p.land === 'NO')?.identifikator}
            />
            <HorizontalSeparatorDiv />
            <HighContrastKnapp
              disabled={searchingPerson}
              spinner={searchingPerson}
              onClick={onSearchUser}
            >
              {searchingPerson ? t('ui:label-searching') : t('ui:label-searchUser')}
            </HighContrastKnapp>
          </FlexDiv>
          <VerticalSeparatorDiv data-size='0.5' />
          <div>
            {searchedPerson ? (
              <Normaltekst>
                {_.get(replySed, `${personID}.personInfo.fornavn`) + ' ' +
                 _.get(replySed, `${personID}.personInfo.etternavn`) + ' (' +
                 _.get(replySed, `${personID}.personInfo.kjoenn`) + ')'}
              </Normaltekst>
            ) : (
              <Normaltekst>
                {t('ui:label-norwegian-fnr-description')}
              </Normaltekst>
            )}
          </div>
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      {_.get(replySed, `toDelete.${personID}.foedested.visible`)
        ? (
          <>
            <Row>
              <Column>
                <HighContrastInput
                  data-test-id={'c-familymanager-' + personID + '-personopplysninger-foedestedby-input'}
                  feil={validation['person-' + personID + '-personopplysninger-foedested-by']
                    ? validation['person-' + personID + '-personopplysninger-foedested-by']!.feilmelding
                    : undefined}
                  id={'c-familymanager-' + personID + '-personopplysninger-foedestedby-input'}
                  label={t('ui:label-by')}
                  onChange={onFoedestedByChange}
                  value={_.get(replySed, `${personID}.personInfo.pinMangler.foedested.by`)}
                />
              </Column>
              <HorizontalSeparatorDiv />
              <Column>
                <HighContrastInput
                  data-test-id={'c-familymanager-' + personID + '-personopplysninger-foedested-region-input'}
                  feil={validation['person-' + personID + '-personopplysninger-foedested-region']
                    ? validation['person-' + personID + '-personopplysninger-foedested-region']!.feilmelding
                    : undefined}
                  id={'c-familymanager-' + personID + '-personopplysninger-foedested-region-input'}
                  label={t('ui:label-region')}
                  onChange={onFoedestedRegionChange}
                  value={_.get(replySed, `${personID}.personInfo.pinMangler.foedested.region`)}
                />
              </Column>
              <HorizontalSeparatorDiv />
              <Column>
                <CountrySelect
                  data-test-id={'c-familymanager-' + personID + '-personopplysninger-foedested-land-countryselect'}
                  error={validation['person-' + personID + '-personopplysninger-foedested-land']
                    ? validation['person-' + personID + '-personopplysninger-foedested-land']!.feilmelding
                    : undefined}
                  id={'c-familymanager-' + personID + '-personopplysninger-foedested-land-countryselect'}
                  includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
                  label={t('ui:label-landkode')}
                  menuPortalTarget={document.body}
                  onOptionSelected={onFoedestedLandChange}
                  placeholder={t('ui:label-choose')}
                  values={_.get(replySed, `${personID}.personInfo.pinMangler.foedested.land`)}
                />
              </Column>
            </Row>
            <VerticalSeparatorDiv />
            <Row>
              <Column>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => onSetAddBirthPlace(false)}
                >
                  <Trashcan />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('ui:label-remove-birthplace')}
                </HighContrastFlatknapp>
              </Column>
            </Row>
          </>
          )
        : (
          <Row>
            <Column>
              <Undertittel>
                {t('ui:label-birthPlace')}
              </Undertittel>
              <VerticalSeparatorDiv data-size='0.5' />
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => onSetAddBirthPlace(true)}
              >
                <Tilsette />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('ui:label-add-birthplace')}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      {_isDirty && '*'}
    </PersonOpplysningerDiv>
  )
}

export default PersonOpplysninger
