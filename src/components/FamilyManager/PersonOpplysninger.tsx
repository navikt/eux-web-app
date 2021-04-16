import { searchPerson } from 'actions/svarpased'
import Add from 'assets/icons/Add'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
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
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-fornavn-text'}
            feil={validation[namespace + '-fornavn']?.feilmelding}
            id={'c-' + namespace + '-fornavn-text'}
            onChange={onFornavnChange}
            value={personInfo.fornavn}
            label={t('label:firstname') + ' *'}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-etternavn-text'}
            feil={validation[namespace + '-etternavn']?.feilmelding}
            id={'c-' + namespace + '-etternavn-text'}
            onChange={onEtternavnChange}
            value={personInfo.etternavn}
            label={t('label:lastname') + ' *'}
          />
        </Column>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-foedselsdato-text'}
            feil={validation[namespace + '-foedselsdato']?.feilmelding}
            id={'c-' + namespace + '-foedselsdato-text'}
            onChange={onFodselsdatoChange}
            value={personInfo.foedselsdato}
            placeholder={t('el:placeholder-date-default')}
            label={t('label:birthdate') + ' *'}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.1s' }}>
        <Column>
          <HighContrastRadioPanelGroup
            checked={personInfo.kjoenn}
            data-no-border
            data-test-id={'c-' + namespace + '-kjoenn-text'}
            feil={validation[namespace + '-kjoenn']?.feilmelding}
            id={'c-' + namespace + '-kjoenn-text'}
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
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-utenlandskpin-nummer-text'}
            feil={validation[namespace + '-utenlandskpin-nummer']?.feilmelding}
            id={'c-' + namespace + '-utenlandskpin-nummer-text'}
            label={t('label:utenlandsk-pin')}
            onChange={onUtenlandskPinChange}
            value={_.find(personInfo.pin, p => p.land !== 'NO')?.identifikator}
          />
        </Column>
        <Column data-flex='2'>
          <CountrySelect
            data-test-id={'c-' + namespace + '-utenlandskpin-land-text'}
            error={validation[namespace + '-utenlandskpin-land']?.feilmelding}
            id={'c-' + namespace + '-utenlandskpin-land-text'}
            includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
            label={t('label:land')}
            menuPortalTarget={document.body}
            onChange={onUtenlandskLandChange}
            onOptionSelected={(e: any) => onUtenlandskLandChange(e.value)}
            placeholder={t('el:placeholder-select-default')}
            values={_.find(personInfo.pin, p => p.land !== 'NO')?.land}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
        <Column>
          <HighContrastInput
            data-test-id={'c-' + namespace + '-norskpin-nummer-text'}
            feil={validation[namespace + '-norskpin-nummer']?.feilmelding}
            id={'c-' + namespace + '-norskpin-nummer-text'}
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
      </AlignStartRow>
      <VerticalSeparatorDiv data-size='0.5' />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.4s' }}>
        <Column>
          {searchedPerson
            ? (
              <Normaltekst>
                {_.get(replySed, `${personID}.personInfo.fornavn`) + ' ' +
            _.get(replySed, `${personID}.personInfo.etternavn`) + ' (' +
            _.get(replySed, `${personID}.personInfo.kjoenn`) + ')'}
              </Normaltekst>
              )
            : (
              <Normaltekst>
                {t('label:norwegian-fnr-description')}
              </Normaltekst>
              )}
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.5s' }}>
        <Column>
          <Undertittel>
            {t('label:birthplace')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv data-size='0.5' />
      {_seeNewForm
        ? (
          <AlignStartRow className='slideInFromLeft'>
            <Column>
              <HighContrastInput
                data-test-id={'c-' + namespace + '-foedested-by-text'}
                feil={validation[namespace + '-foedested-by']?.feilmelding}
                id={'c-' + namespace + '-foedestedby-text'}
                label={t('label:by')}
                onChange={onFoedestedByChange}
                value={personInfo.pinMangler?.foedested.by}
              />
            </Column>
            <Column>
              <HighContrastInput
                data-test-id={'c-' + namespace + '-foedested-region-text'}
                feil={validation[namespace + '-foedested-region']?.feilmelding}
                id={'c-' + namespace + '-foedested-region-text'}
                label={t('label:region')}
                onChange={onFoedestedRegionChange}
                value={personInfo.pinMangler?.foedested.region}
              />
            </Column>
            <Column>
              <CountrySelect
                data-test-id={'c-' + namespace + '-foedested-land-text'}
                error={validation[namespace + '-foedested-land']?.feilmelding}
                id={'c-' + namespace + '-foedested-land-text'}
                includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
                label={t('label:land')}
                menuPortalTarget={document.body}
                onOptionSelected={onFoedestedLandChange}
                placeholder={t('el:placeholder-select-default')}
                values={personInfo.pinMangler?.foedested.land}
              />
            </Column>
          </AlignStartRow>
          )
        : (
          <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.6s' }}>
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
          </AlignStartRow>
          )}
    </PaddedDiv>
  )
}

export default PersonOpplysninger
