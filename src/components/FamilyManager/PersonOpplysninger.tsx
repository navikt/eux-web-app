import Tilsette from 'assets/icons/Tilsette'
import { State } from 'declarations/reducers'
import { Kodeverk, Person } from 'declarations/types'
import CountrySelect from 'landvelger'
import { Undertittel } from 'nav-frontend-typografi'
import {
  Column, HighContrastFlatknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

interface PersonOpplysningerProps {
  person: Person
  highContrast: boolean
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

interface PersonOpplysningerSelector {
  landkoderList: any
}

const mapState = (state: State): PersonOpplysningerSelector => ({
  landkoderList: state.app.landkoder
})

const PersonOpplysninger: React.FC<PersonOpplysningerProps> = ({
  person
}:PersonOpplysningerProps): JSX.Element => {
  const [_etternavn, setEtternavn] = useState<string | undefined>(undefined)
  const [_fodselsdato, setFodselsdato] = useState<string | undefined>(undefined)
  const [_fornavn, setFornavn] = useState<string | undefined>(undefined)
  const [_foundPerson, setFoundPerson] = useState<string | undefined>(undefined)
  const [_kjoenn, setKjoenn] = useState<string | undefined>(undefined)
  const [_land, setLand] = useState<string | undefined>(undefined)
  const [_mounted, setMounted] = useState<boolean>(false)
  const [_newFodestedBy, setNewFodestedBy] = useState<string | undefined>(undefined)
  const [_newFodestedRegion, setNewFodestedRegion] = useState<string | undefined>(undefined)
  const [_newFodestedLand, setNewFodestedLand] = useState<string | undefined>(undefined)
  const [_norwegianPin, setNorwegianPin] = useState<string | undefined>(undefined)
  const [_seeAddBirthPlace, setSeeAddBirthPlace] = useState<boolean>(false)
  const [_utenlandskPin, setUtenlandskPin] = useState<string | undefined>(undefined)
  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { landkoderList }: PersonOpplysningerSelector = useSelector<State, PersonOpplysningerSelector>(mapState)
  const { t } = useTranslation()

  const onFornavnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    setFornavn(e.target.value)
  }

  const onEtternavnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    setEtternavn(e.target.value)
  }

  const onFodselsdatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    setFodselsdato(e.target.value)
  }

  const onKjoennChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    setKjoenn(e.target.value)
  }

  const onUtenlandskPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    setUtenlandskPin(e.target.value)
  }

  const onLandChange = (e: string) => {
    setIsDirty(true)
    setLand(e)
  }

  const onNorwegianPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true)
    setNorwegianPin(e.target.value)
  }

  // TODO
  const onSearchUser = () => {
    setFoundPerson(
      'bla bla bla bla'
    )
  }

  useEffect(() => {
    if (!_mounted) {
      setMounted(true)
    }
    return () => {
      console.log('unmounting')
    }
  }, [_mounted])

  useEffect(() => {
    setEtternavn(person?.etternavn || '')
    setFodselsdato('')
    setFornavn(person?.fornavn || '')
    setKjoenn(person?.kjoenn || 'U')
  }, [person])

  return (
    <PersonOpplysningerDiv>
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-fornavn-input'}
            key={'c-familymanager-personopplysninger-' + person.fnr + '-fornavn-key'}
            id={'c-familymanager-personopplysninger-' + person.fnr + '-fornavn'}
            onChange={onFornavnChange}
            value={_fornavn}
            label={t('ui:label-firstname')}
          />
        </Column>
        <HorizontalSeparatorDiv />
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-etternavn-input'}
            key={'c-familymanager-personopplysninger-' + person.fnr + '-etternavn-key'}
            id={'c-familymanager-personopplysninger-' + person.fnr + '-etternavn'}
            onChange={onEtternavnChange}
            value={_etternavn}
            label={t('ui:label-lastname')}
          />
        </Column>
        <HorizontalSeparatorDiv />
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-fodselsdato-input'}
            key={'c-familymanager-personopplysninger-' + person.fnr + '-fodselsdato-key'}
            id={'c-familymanager-personopplysninger-' + person.fnr + '-fodselsdato'}
            onChange={onFodselsdatoChange}
            value={_fodselsdato}
            placeholder={t('ui:placeholder-birthDate')}
            label={t('ui:label-birthDate')}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastRadioPanelGroup
            checked={_kjoenn}
            data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-kjoenn-radiogroup'}
            data-multiple-line='false'
            key={'c-familymanager-personopplysninger-' + person.fnr + '-kjoenn-key'}
            id={'c-familymanager-personopplysninger-' + person.fnr + '-kjoenn'}
            feil={undefined}
            legend={t('ui:label-gender')}
            name='c-familymanager-personopplysninger-kjoenn-radiogroup'
            radios={[
              { label: t('ui:label-woman'), value: 'K' },
              { label: t('ui:label-man'), value: 'M' },
              { label: t('ui:label-unknown'), value: 'U' }
            ]}
            onChange={onKjoennChange}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row>
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-utenlandskpin-input'}
            key={'c-familymanager-personopplysninger-' + person.fnr + '-utenlandskpin-key'}
            id={'c-familymanager-personopplysninger-' + person.fnr + '-utenlandskpin'}
            onChange={onUtenlandskPinChange}
            value={_utenlandskPin}
            label={t('ui:label-utenlandskPin')}
          />
        </Column>
        <Column data-flex='2'>
          <CountrySelect
            data-test-id={'c-familymanager-personopplysninger-' + person.fnr + '-land-countryselect'}
            key={'c-familymanager-personopplysninger-' + person.fnr + '-land-key'}
            id={'c-familymanager-personopplysninger-' + person.fnr + '-land'}
            onChange={onUtenlandskPinChange}
            label={t('ui:label-landkode')}
            menuPortalTarget={document.body}
            includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
            onOptionSelected={(e: any) => {
              onLandChange(e.value)
            }}
            placeholder={t('ui:label-choose')}
            values={_land}
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
              key={'c-familymanager-personopplysninger-' + person.fnr + '-norwegianpin-key'}
              id={'c-familymanager-personopplysninger-' + person.fnr + '-norwegianpin'}
              onChange={onNorwegianPinChange}
              value={_norwegianPin}
              label={t('ui:label-norwegian-fnr')}
            />
            <HorizontalSeparatorDiv />
            <HighContrastKnapp
              onClick={onSearchUser}
            >
              {t('ui:label-searchUser')}
            </HighContrastKnapp>
          </FlexDiv>
          <VerticalSeparatorDiv data-size='0.5' />
          <div>
            {_foundPerson || t('ui:label-norwegian-fnr-description')}
          </div>
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      {_seeAddBirthPlace ? (
        <Row>
          <Column>
            <HighContrastInput
              data-test-id='c-familymanager-personopplysninger-fodested-by-input'
              id='c-familymanager-personopplysninger-fodested-by'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFodestedBy(e.target.value)}
              value={_newFodestedBy}
              label={t('ui:label-by')}
            />
          </Column>
          <HorizontalSeparatorDiv />
          <Column>
            <HighContrastInput
              data-test-id='c-familymanager-personopplysninger-fodested-region-input'
              id='c-familymanager-personopplysninger-fodested-region'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFodestedRegion(e.target.value)}
              value={_newFodestedRegion}
              label={t('ui:label-region')}
            />
          </Column>
          <HorizontalSeparatorDiv />
          <Column>
            <CountrySelect
              data-test-id='c-familymanager-personopplysninger-fodested-land-countryselect'
              id='c-familymanager-personopplysninger-fodested-land'
              label={t('ui:label-landkode')}
              menuPortalTarget={document.body}
              includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
              onOptionSelected={(e: any) => {
                setNewFodestedLand(e.value)
                return true
              }}
              placeholder={t('ui:label-choose')}
              values={_newFodestedLand}
            />
          </Column>
        </Row>
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
              onClick={() => setSeeAddBirthPlace(true)}
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
