import { searchPerson } from 'actions/svarpased'
import Add from 'assets/icons/Add'
import { PaddedDiv } from 'components/StyledComponents'
import { PersonInfo, Pin, ReplySed } from 'declarations/sed'
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
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const namespace = 'familymanager-' + personID + '-personopplysninger'
  const personInfo: PersonInfo = _.get(replySed, `${personID}.personInfo`)
  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)

  const onFornavnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChanged(`${personID}.personInfo.fornavn`, e.target.value)
  }

  const onEtternavnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChanged(`${personID}.personInfo.etternavn`, e.target.value)
  }

  const onFodselsdatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChanged(`${personID}.personInfo.foedselsdato`, e.target.value)
  }

  const onKjoennChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChanged(`${personID}.personInfo.kjoenn`, e.target.value)
  }

  const onUtenlandskPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin: Array<Pin> = _.cloneDeep(personInfo.pin)
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
    const pin: Array<Pin> = _.cloneDeep(personInfo.pin)
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
    const pin: Array<Pin> = _.cloneDeep(personInfo.pin)
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
    onValueChanged(`${personID}.personInfo.pinMangler.foedested.by`, e.target.value)
  }

  const onFoedestedRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChanged(`${personID}.personInfo.pinMangler.foedested.region`, e.target.value)
  }

  const onFoedestedLandChange = (land: string) => {
    onValueChanged(`${personID}.personInfo.pinMangler.foedested.land`, land)
    return true
  }

  const onSearchUser = () => {
    const norwegianPin = _.find(personInfo.pin, p => p.land === 'NO')
    if (norwegianPin) {
      dispatch(searchPerson(norwegianPin.identifikator))
    }
  }

  return (
    <PaddedDiv key={personID}>
      <Row className='slideInFromLeft'>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-fornavn-input'}
            feil={validation[namespace + '-fornavn']?.feilmelding}
            id={'c-' + namespace + '-fornavn-input'}
            onChange={onFornavnChange}
            value={personInfo.fornavn}
            label={t('label:firstname') + ' *'}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-etternavn-input'}
            feil={validation[namespace + '-etternavn']?.feilmelding}
            id={'c-' + namespace + '-etternavn-input'}
            onChange={onEtternavnChange}
            value={personInfo.etternavn}
            label={t('label:lastname') + ' *'}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-foedselsdato-input'}
            feil={validation[namespace + '-foedselsdato']?.feilmelding}
            id={'c-' + namespace + '-foedselsdato-input'}
            onChange={onFodselsdatoChange}
            value={personInfo.foedselsdato}
            placeholder={t('el:placeholder-date-default')}
            label={t('label:birthdate') + ' *'}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <HighContrastRadioPanelGroup
            checked={personInfo.kjoenn}
            data-no-border
            data-test-id={'c-' + namespace + '-kjoenn-radiogroup'}
            feil={validation[namespace + '-kjoenn']?.feilmelding}
            id={'c-' + namespace + '-kjoenn-radiogroup'}
            legend={t('label:gender') + ' *'}
            name={namespace + '-kjoenn'}
            onChange={onKjoennChange}
            radios={[
              { label: t(personID?.startsWith('barn') ? 'label:girl' : 'label:woman'), value: 'K' },
              { label: t(personID?.startsWith('barn') ? 'label:boy' : 'label:man'), value: 'M' },
              { label: t('label:unknown'), value: 'U' }
            ]}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-utenlandskpin-nummer-input'}
            feil={validation[namespace + '-utenlandskpin-nummer']?.feilmelding}
            id={'c-' + namespace + '-utenlandskpin-nummer-input'}
            label={t('label:utenlandsk-pin')}
            onChange={onUtenlandskPinChange}
            value={_.find(personInfo.pin, p => p.land !== 'NO')?.identifikator}
          />
        </Column>
        <Column data-flex='2'>
          <CountrySelect
            data-test-id={'c-' + namespace + '-utenlandskpin-land-countryselect'}
            error={validation[namespace + '-utenlandskpin-land']?.feilmelding}
            id={'c-' + namespace + '-utenlandskpin-land-countryselect'}
            includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
            label={t('label:land')}
            menuPortalTarget={document.body}
            onChange={onUtenlandskLandChange}
            onOptionSelected={(e: any) => onUtenlandskLandChange(e.value)}
            placeholder={t('el:placeholder-select-default')}
            values={_.find(personInfo.pin, p => p.land !== 'NO')?.land}
          />
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-norskpin-nummer-input'}
            feil={validation[namespace + '-norskpin-nummer']?.feilmelding}
            id={'c-' + namespace + '-norskpin-nummer-input'}
            label={t('label:norwegian-fnr')}
            onChange={onNorwegianPinChange}
            value={_.find(personInfo.pin, p => p.land === 'NO')?.identifikator}
          />
        </Column>
        <Column>
          <HighContrastKnapp
            className='nolabel'
            disabled={searchingPerson}
            spinner={searchingPerson}
            onClick={onSearchUser}
          >
            {searchingPerson
              ? t('message:loading-searching')
              : t('el:button-search-for-x', { x: t('label:person').toLowerCase() })}
          </HighContrastKnapp>
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv data-size='0.5' />
      <Row>
        <Column>
          {searchedPerson
            ? (
              <Normaltekst>
                {_.get(replySed, `${personID}.personInfo.fornavn`) + ' ' +
            _.get(replySed, `${personID}.personInfo.etternavn`) + ' (' +
            _.get(replySed, `${personID}.personInfo.kjoenn`) + ')'}
              </Normaltekst>
              ) : (
                <Normaltekst>
                  {t('label:norwegian-fnr-description')}
                </Normaltekst>
              )}
        </Column>
      </Row>
      <VerticalSeparatorDiv />
      <Row className='slideInFromLeft'>
        <Column>
          <Undertittel>
            {t('label:birthplace')}
          </Undertittel>
        </Column>
      </Row>
      <VerticalSeparatorDiv data-size='0.5' />
      {_seeNewForm
        ? (
          <Row className='slideInFromLeft'>
            <Column>
              <HighContrastInput
                data-test-id={'c-' + namespace + '-foedested-by-input'}
                feil={validation[namespace + '-foedested-by']?.feilmelding}
                id={'c-' + namespace + '-foedestedby-input'}
                label={t('label:by')}
                onChange={onFoedestedByChange}
                value={personInfo.pinMangler?.foedested.by}
              />
            </Column>
            <Column>
              <HighContrastInput
                data-test-id={'c-' + namespace + '-foedested-region-input'}
                feil={validation[namespace + '-foedested-region']?.feilmelding}
                id={'c-' + namespace + '-foedested-region-input'}
                label={t('label:region')}
                onChange={onFoedestedRegionChange}
                value={personInfo.pinMangler?.foedested.region}
              />
            </Column>
            <Column>
              <CountrySelect
                data-test-id={'c-' + namespace + '-foedested-land-countryselect'}
                error={validation[namespace + '-foedested-land']?.feilmelding}
                id={'c-' + namespace + '-foedested-land-countryselect'}
                includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
                label={t('label:land')}
                menuPortalTarget={document.body}
                onOptionSelected={onFoedestedLandChange}
                placeholder={t('el:placeholder-select-default')}
                values={personInfo.pinMangler?.foedested.land}
              />
            </Column>
          </Row>
          )
        : (
          <Row className='slideInFromLeft'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('el:button-add-birthplace')}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default PersonOpplysninger
