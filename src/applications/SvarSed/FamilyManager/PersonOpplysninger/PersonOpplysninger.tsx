import Add from 'assets/icons/Add'
import Search from 'assets/icons/Search'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import { AlignStartRow, PaddedDiv } from 'components/StyledComponents'
import { PersonInfo, Pin, ReplySed } from 'declarations/sed'
import { Kodeverk, Person, Validation } from 'declarations/types'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastKnapp,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PersonOpplysningerProps {
  landkoderList: Array<Kodeverk>
  highContrast: boolean
  onSearchingPerson: (query: string) => void
  updateReplySed: (needle: string, value: any) => void
  personID: string | undefined
  replySed: ReplySed
  resetValidation: (key?: string) => void
  searchingPerson: boolean
  searchedPerson: Person | undefined
  validation: Validation
}

const PersonOpplysninger: React.FC<PersonOpplysningerProps> = ({
  landkoderList,
  onSearchingPerson,
  updateReplySed,
  personID,
  replySed,
  resetValidation,
  searchedPerson,
  searchingPerson,
  validation
}:PersonOpplysningerProps): JSX.Element => {
  const { t } = useTranslation()
  const target = `${personID}.personInfo`
  const personInfo: PersonInfo = _.get(replySed, target)
  const namespace = `familymanager-${personID}-personopplysninger`

  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)
  const norwegianPin = _.find(personInfo.pin, p => p.land === 'NO')
  const utenlandskPin = _.find(personInfo.pin, p => p.land !== 'NO')

  const onFornavnChange = (newFornavn: string) => {
    updateReplySed(`${target}.fornavn`, newFornavn)
    if (validation[namespace + '-fornavn']) {
      resetValidation(namespace + '-fornavn')
    }
  }

  const onEtternavnChange = (newEtternavn: string) => {
    updateReplySed(`${target}.etternavn`, newEtternavn)
    if (validation[namespace + '-etternavn']) {
      resetValidation(namespace + '-etternavn')
    }
  }

  const onFodselsdatoChange = (dato: string) => {
    updateReplySed(`${target}.foedselsdato`, dato)
    if (validation[namespace + '-foedselsdato']) {
      resetValidation(namespace + '-foedselsdato')
    }
  }

  const onKjoennChange = (newKjoenn: string) => {
    updateReplySed(`${target}.kjoenn`, newKjoenn)
    if (validation[namespace + '-kjoenn']) {
      resetValidation(namespace + '-kjoenn')
    }
  }

  const onUtenlandskPinChange = (newPin: string) => {
    const pin: Array<Pin> = _.cloneDeep(personInfo.pin)
    const utendanskPinIndex = _.findIndex(pin, p => p.land !== 'NO')
    if (utendanskPinIndex >= 0) {
      pin[utendanskPinIndex].identifikator = newPin
    } else {
      pin.push({
        identifikator: newPin
      })
    }
    updateReplySed(`${target}.pin`, pin)
    if (validation[namespace + '-utenlandskpin-nummer']) {
      resetValidation(namespace + '-utenlandskpin-nummer')
    }
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
    updateReplySed(`${target}.pin`, pin)
    if (validation[namespace + '-utenlandskpin-land']) {
      resetValidation(namespace + '-utenlandskpin-land')
    }
  }

  const onNorwegianPinChange = (newPin: string) => {
    const pin: Array<Pin> = _.cloneDeep(personInfo.pin)
    const norwegianPinIndex = _.findIndex(pin, p => p.land === 'NO')
    if (norwegianPinIndex >= 0) {
      pin[norwegianPinIndex].identifikator = newPin
    } else {
      pin.push({
        identifikator: newPin
      })
    }
    updateReplySed(`${target}.pin`, pin)
    if (validation[namespace + '-norskpin-nummer']) {
      resetValidation(namespace + '-norskpin-nummer')
    }
  }

  const onFoedestedByChange = (newFodestedBy: string) => {
    updateReplySed(`${target}.pinMangler.foedested.by`, newFodestedBy)
    if (validation[namespace + '-foedested-by']) {
      resetValidation(namespace + '-foedested-by')
    }
  }

  const onFoedestedRegionChange = (newFodestedRegion: string) => {
    updateReplySed(`${target}.pinMangler.foedested.region`, newFodestedRegion)
    if (validation[namespace + '-foedested-region']) {
      resetValidation(namespace + '-foedested-region')
    }
  }

  const onFoedestedLandChange = (newLand: string) => {
    updateReplySed(`${target}.pinMangler.foedested.land`, newLand)
    if (validation[namespace + '-foedested-land']) {
      resetValidation(namespace + '-foedested-land')
    }
  }

  const onSearchUser = () => {
    if (norwegianPin && norwegianPin.identifikator) {
      onSearchingPerson(norwegianPin.identifikator)
    }
  }

  return (
    <PaddedDiv key={personID}>
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Input
            feil={validation[namespace + '-fornavn']?.feilmelding}
            namespace={namespace}
            id='fornavn-text'
            label={t('label:fornavn') + ' *'}
            onChanged={onFornavnChange}
            value={personInfo.fornavn}
          />
        </Column>
        <Column>
          <Input
            feil={validation[namespace + '-etternavn']?.feilmelding}
            namespace={namespace}
            id='etternavn-text'
            label={t('label:etternavn') + ' *'}
            onChanged={onEtternavnChange}
            value={personInfo.etternavn}
          />
        </Column>
        <Column>
          <DateInput
            error={validation[namespace + '-foedselsdato']?.feilmelding}
            namespace={namespace + '-foedselsdato'}
            key={personInfo.foedselsdato}
            label={t('label:fødselsdato') + ' *'}
            setDato={onFodselsdatoChange}
            value={personInfo.foedselsdato}
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
            legend={t('label:kjønn') + ' *'}
            name={namespace + '-kjoenn'}
            onChange={onKjoennChange}
            radios={[
              { label: t(personID?.startsWith('barn') ? 'label:jente' : 'label:kvinne'), value: 'K' },
              { label: t(personID?.startsWith('barn') ? 'label:gutt' : 'label:mann'), value: 'M' },
              { label: t('label:ukjent'), value: 'U' }
            ]}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.2s' }}>
        <Column>
          <Input
            feil={validation[namespace + '-utenlandskpin-nummer']?.feilmelding}
            namespace={namespace}
            id='utenlandskpin-nummer-text'
            label={t('label:utenlandsk-pin')}
            onChanged={onUtenlandskPinChange}
            value={utenlandskPin?.identifikator}
          />
        </Column>
        <Column>
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
            values={utenlandskPin?.land}
          />
        </Column>
        <Column />
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.3s' }}>
        <Column>
          <Input
            feil={validation[namespace + '-norskpin-nummer']?.feilmelding}
            namespace={namespace}
            id='norskpin-nummer-text'
            label={t('label:norsk-fnr')}
            onChanged={onNorwegianPinChange}
            value={norwegianPin?.identifikator}
          />
        </Column>
        <Column>
          <HighContrastKnapp
            className='nolabel'
            disabled={searchingPerson}
            spinner={searchingPerson}
            onClick={onSearchUser}
          >
            <Search />
            <HorizontalSeparatorDiv />
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
                {t('label:norsk-fnr-beskrivelse')}
              </Normaltekst>
              )}
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv data-size='2' />
      <AlignStartRow className='slideInFromLeft' style={{ animationDelay: '0.5s' }}>
        <Column>
          <Undertittel>
            {t('label:fødested')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv data-size='0.5' />
      {_seeNewForm
        ? (
          <AlignStartRow className='slideInFromLeft'>
            <Column>
              <Input
                feil={validation[namespace + '-foedested-by']?.feilmelding}
                namespace={namespace}
                id='foedested-by-text'
                label={t('label:by')}
                onChanged={onFoedestedByChange}
                value={personInfo.pinMangler?.foedested.by}
              />
            </Column>
            <Column>
              <Input
                feil={validation[namespace + '-foedested-region']?.feilmelding}
                namespace={namespace}
                id='foedested-region-text'
                label={t('label:region')}
                onChanged={onFoedestedRegionChange}
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
                {t('el:button-add-new-x', { x: t('label:fødested') })}
              </HighContrastFlatknapp>
            </Column>
          </AlignStartRow>
          )}
    </PaddedDiv>
  )
}

export default PersonOpplysninger
