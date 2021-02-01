import { searchPerson } from 'actions/svarpased'
import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import { Kodeverk, Person, Validation } from 'declarations/types'
import CountrySelect from 'landvelger'
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
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

interface PersonOpplysningerProps {
  person: Person
  landkoderList: Array<Kodeverk>
  highContrast: boolean
  searchingPerson: boolean
  searchedPerson: Person | undefined
  validation: Validation
  onValueChanged: (fnr:string, category: string, key: string, value: any) => void
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
  person,
  validation,
  searchedPerson,
  searchingPerson,
  onValueChanged
}:PersonOpplysningerProps): JSX.Element => {
  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onFornavnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    onValueChanged(person!.fnr!, 'personopplysninger', 'fornavn', e.target.value)
  }

  const onEtternavnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    onValueChanged(person!.fnr!, 'personopplysninger', 'etternavn', e.target.value)
  }

  const onFodselsdatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    onValueChanged(person!.fnr!, 'personopplysninger', 'foedselsdato', e.target.value)
  }

  const onKjoennChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    onValueChanged(person!.fnr!, 'personopplysninger', 'kjoenn', e.target.value)
  }

  const onUtenlandskPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    onValueChanged(person!.fnr!, 'personopplysninger', 'utenlandskPin', e.target.value)
  }

  const onLandChange = (e: string) => {
    setIsDirty(true)
    onValueChanged(person!.fnr!, 'personopplysninger', 'land', e)
  }

  const onNorwegianPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    onValueChanged(person!.fnr!, 'personopplysninger', 'norwegianPin', e.target.value)
  }

  const onFodestedByChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    onValueChanged(person!.fnr!, 'personopplysninger', 'fodestedBy', e.target.value)
  }

  const onFodestedRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    onValueChanged(person!.fnr!, 'personopplysninger', 'fodestedRegion', e.target.value)
  }

  const onFodestedLandChange = (e: any) => {
    setIsDirty(true)
    onValueChanged(person!.fnr!, 'personopplysninger', 'fodestedLand', e.target.value)
    return true
  }

  const onSetAddBirthPlace = (value: boolean) => {
    setIsDirty(true)
    onValueChanged(person!.fnr!, 'personopplysninger', 'fodested', value)
  }

  const onSearchUser = () => {
    dispatch(searchPerson(person.personopplysninger?.norskpersonnummer))
  }

  useEffect(() => {
    // prefill personopplysning with the raw data
    if (person?.personopplysninger?.fornavn === undefined) {
      onValueChanged(person!.fnr!, 'personopplysninger', 'fornavn', person?.fornavn)
    }
    if (person?.personopplysninger?.etternavn === undefined) {
      onValueChanged(person!.fnr!, 'personopplysninger', 'etternavn', person?.etternavn)
    }
    if (person?.personopplysninger?.foedselsdato === undefined) {
      onValueChanged(person!.fnr!, 'personopplysninger', 'etternavn', person?.fdato)
    }
    if (person?.personopplysninger?.kjoenn === undefined) {
      onValueChanged(person!.fnr!, 'personopplysninger', 'kjoenn', person?.kjoenn)
    }
  }, [person])

  return (
    <PersonOpplysningerDiv key={person.fnr}>
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-fornavn-input'}
            feil={validation['person-' + person.fnr + '-personopplysninger-fornavn']
              ? validation['person-' + person.fnr + '-personopplysninger-fornavn']!.feilmelding
              : undefined}
            id={'c-familymanager-personopplysninger-' + person.fnr + '-fornavn-input'}
            onChange={onFornavnChange}
            value={person?.personopplysninger?.fornavn}
            label={t('ui:label-firstname') + ' *'}
          />
        </Column>
        <HorizontalSeparatorDiv />
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-etternavn-input'}
            feil={validation['person-' + person.fnr + '-personopplysninger-etternavn']
              ? validation['person-' + person.fnr + '-personopplysninger-etternavn']!.feilmelding
              : undefined}
            id={'c-familymanager-personopplysninger-' + person.fnr + '-etternavn-input'}
            onChange={onEtternavnChange}
            value={person?.personopplysninger?.etternavn}
            label={t('ui:label-lastname') + ' *'}
          />
        </Column>
        <HorizontalSeparatorDiv />
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-foedselsdato-input'}
            feil={validation['person-' + person.fnr + '-personopplysninger-foedselsdato']
              ? validation['person-' + person.fnr + '-personopplysninger-foedselsdato']!.feilmelding
              : undefined}
            id={'c-familymanager-personopplysninger-' + person.fnr + '-foedselsdato-input'}
            onChange={onFodselsdatoChange}
            value={person?.personopplysninger?.foedselsdato}
            placeholder={t('ui:placeholder-birthDate')}
            label={t('ui:label-birthDate') + ' *'}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastRadioPanelGroup
            checked={person?.personopplysninger?.kjoenn}
            data-multiple-line='false'
            data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-kjoenn-radiogroup'}
            feil={validation['person-' + person.fnr + '-personopplysninger-kjoenn']
              ? validation['person-' + person.fnr + '-personopplysninger-kjoenn']!.feilmelding
              : undefined}
            id={'c-familymanager-personopplysninger-' + person.fnr + '-kjoenn-radiogroup'}
            legend={t('ui:label-gender') + ' *'}
            name={'c-familymanager-personopplysninger-' + person.fnr + '-kjoenn-radiogroup'}
            onChange={onKjoennChange}
            radios={[
              { label: t('ui:label-woman'), value: 'K' },
              { label: t('ui:label-man'), value: 'M' },
              { label: t('ui:label-unknown'), value: 'U' }
            ]}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-utenlandskPin-input'}
            feil={validation['person-' + person.fnr + '-personopplysninger-utenlandskPin']
              ? validation['person-' + person.fnr + '-personopplysninger-utenlandskPin']!.feilmelding
              : undefined}
            id={'c-familymanager-personopplysninger-' + person.fnr + '-utenlandskPin-input'}
            label={t('ui:label-utenlandskPin')}
            onChange={onUtenlandskPinChange}
            value={person?.personopplysninger?.utenlandskPin}
          />
        </Column>
        <Column data-flex='2'>
          <CountrySelect
            data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-land-countryselect'}
            error={validation['person-' + person.fnr + '-personopplysninger-land']
              ? validation['person-' + person.fnr + '-personopplysninger-land']!.feilmelding
              : undefined}
            id={'c-familymanager-personopplysninger-' + person.fnr + '-land-countryselect'}
            includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
            label={t('ui:label-landkode')}
            menuPortalTarget={document.body}
            onChange={onUtenlandskPinChange}
            onOptionSelected={(e: any) => {
              onLandChange(e.value)
            }}
            placeholder={t('ui:label-choose')}
            values={person?.personopplysninger?.land}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <FlexDiv>
            <HighContrastInput
              bredde='XL'
              data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-norwegianpin-input'}
              feil={validation['person-' + person.fnr + '-personopplysninger-norwegianpin']
                ? validation['person-' + person.fnr + '-personopplysninger-norwegianpin']!.feilmelding
                : undefined}
              id={'c-familymanager-personopplysninger-' + person.fnr + '-norwegianpin-input'}
              label={t('ui:label-norwegian-fnr')}
              onChange={onNorwegianPinChange}
              value={person?.personopplysninger?.norskpersonnummer}
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
            {searchedPerson && (
              <Normaltekst>
                {person?.fornavn + ' ' + person?.etternavn + ' (' + person?.kjoenn + ')'}
              </Normaltekst>
            )}
          </div>
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      {person.personopplysninger?.fodested ? (
        <>
        <Row>
          <Column>
            <HighContrastInput
              data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-fodestedby-input'}
              feil={validation['person-' + person.fnr + '-personopplysninger-fodestedby']
                ? validation['person-' + person.fnr + '-personopplysninger-fodestedby']!.feilmelding
                : undefined}
              id={'c-familymanager-personopplysninger-' + person.fnr + '-fodestedby-input'}
              label={t('ui:label-by')}
              onChange={onFodestedByChange}
              value={person?.personopplysninger?.fodestedBy}
            />
          </Column>
          <HorizontalSeparatorDiv />
          <Column>
            <HighContrastInput
              data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-fodestedregion-input'}
              feil={validation['person-' + person.fnr + '-personopplysninger-fodestedregion']
                ? validation['person-' + person.fnr + '-personopplysninger-fodestedregion']!.feilmelding
                : undefined}
              id={'c-familymanager-personopplysninger-' + person.fnr + '-fodestedregion-input'}
              label={t('ui:label-region')}
              onChange={onFodestedRegionChange}
              value={person?.personopplysninger?.fodestedRegion}
            />
          </Column>
          <HorizontalSeparatorDiv />
          <Column>
            <CountrySelect
              data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-fodestedland-countryselect'}
              error={validation['person-' + person.fnr + '-personopplysninger-fodestedland']
                ? validation['person-' + person.fnr + '-personopplysninger-fodestedland']!.feilmelding
                : undefined}
              id={'c-familymanager-personopplysninger-' + person.fnr + '-fodestedland-countryselect'}
              includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
              label={t('ui:label-landkode')}
              menuPortalTarget={document.body}
              onOptionSelected={onFodestedLandChange}
              placeholder={t('ui:label-choose')}
              values={person?.personopplysninger?.fodestedLand}
            />
          </Column>
        </Row>
          <VerticalSeparatorDiv/>
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
      ) : (
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
