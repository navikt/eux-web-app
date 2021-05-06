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
  parentNamespace: string
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
  parentNamespace,
  personID,
  replySed,
  resetValidation,
  searchedPerson,
  searchingPerson,
  updateReplySed,
  validation
}:PersonOpplysningerProps): JSX.Element => {
  const { t } = useTranslation()
  const target = `${personID}.personInfo`
  const personInfo: PersonInfo = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-personopplysninger`

  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)
  const norwegianPin = _.find(personInfo.pin, p => p.land === 'NO')
  const utenlandskPin = _.find(personInfo.pin, p => p.land !== 'NO')

  const onFornavnChange = (newFornavn: string) => {
    updateReplySed(`${target}.fornavn`, newFornavn.trim())
    if (validation[namespace + '-fornavn']) {
      resetValidation(namespace + '-fornavn')
    }
  }

  const onEtternavnChange = (newEtternavn: string) => {
    updateReplySed(`${target}.etternavn`, newEtternavn.trim())
    if (validation[namespace + '-etternavn']) {
      resetValidation(namespace + '-etternavn')
    }
  }

  const onFodselsdatoChange = (dato: string) => {
    updateReplySed(`${target}.foedselsdato`, dato.trim())
    if (validation[namespace + '-foedselsdato']) {
      resetValidation(namespace + '-foedselsdato')
    }
  }

  const onKjoennChange = (newKjoenn: string) => {
    updateReplySed(`${target}.kjoenn`, newKjoenn.trim())
    if (validation[namespace + '-kjoenn']) {
      resetValidation(namespace + '-kjoenn')
    }
  }

  const onUtenlandskPinChange = (newPin: string) => {
    const pin: Array<Pin> = _.cloneDeep(personInfo.pin)
    const utendanskPinIndex = _.findIndex(pin, p => p.land !== 'NO')
    if (utendanskPinIndex >= 0) {
      pin[utendanskPinIndex].identifikator = newPin.trim()
    } else {
      pin.push({
        identifikator: newPin.trim()
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
      pin[utendanskPinIndex].land = land.trim()
    } else {
      pin.push({
        land: land.trim()
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
      pin[norwegianPinIndex].identifikator = newPin.trim()
    } else {
      pin.push({
        identifikator: newPin.trim()
      })
    }
    updateReplySed(`${target}.pin`, pin)
    if (validation[namespace + '-norskpin-nummer']) {
      resetValidation(namespace + '-norskpin-nummer')
    }
  }

  const onFoedestedByChange = (newFodestedBy: string) => {
    updateReplySed(`${target}.pinMangler.foedested.by`, newFodestedBy.trim())
    if (validation[namespace + '-foedested-by']) {
      resetValidation(namespace + '-foedested-by')
    }
  }

  const onFoedestedRegionChange = (newFodestedRegion: string) => {
    updateReplySed(`${target}.pinMangler.foedested.region`, newFodestedRegion.trim())
    if (validation[namespace + '-foedested-region']) {
      resetValidation(namespace + '-foedested-region')
    }
  }

  const onFoedestedLandChange = (newLand: string) => {
    updateReplySed(`${target}.pinMangler.foedested.land`, newLand.trim())
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
      <Undertittel>
        {t('label:personopplysning')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <Input
            feil={validation[namespace + '-fornavn']?.feilmelding}
            id='fornavn'
            label={t('label:fornavn') + ' *'}
            namespace={namespace}
            onChanged={onFornavnChange}
            value={personInfo.fornavn}
          />
        </Column>
        <Column>
          <Input
            feil={validation[namespace + '-etternavn']?.feilmelding}
            id='etternavn'
            label={t('label:etternavn') + ' *'}
            namespace={namespace}
            onChanged={onEtternavnChange}
            value={personInfo.etternavn}
          />
        </Column>
        <Column>
          <DateInput
            error={validation[namespace + '-foedselsdato']?.feilmelding}
            key={personInfo.foedselsdato}
            label={t('label:fødselsdato') + ' *'}
            namespace={namespace + '-foedselsdato'}
            setDato={onFodselsdatoChange}
            value={personInfo.foedselsdato}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <HighContrastRadioPanelGroup
            checked={personInfo.kjoenn}
            data-no-border
            data-test-id={namespace + '-kjoenn'}
            feil={validation[namespace + '-kjoenn']?.feilmelding}
            id={namespace + '-kjoenn'}
            legend={t('label:kjønn') + ' *'}
            name={namespace + '-kjoenn'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onKjoennChange(e.target.value)}
            radios={[
              { label: t(personID?.startsWith('barn') ? 'label:jente' : 'label:kvinne'), value: 'K' },
              { label: t(personID?.startsWith('barn') ? 'label:gutt' : 'label:mann'), value: 'M' },
              { label: t('label:ukjent'), value: 'U' }
            ]}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          <Input
            feil={validation[namespace + '-utenlandskpin-nummer']?.feilmelding}
            id='utenlandskpin-nummer'
            label={t('label:utenlandsk-pin')}
            namespace={namespace}
            onChanged={onUtenlandskPinChange}
            value={utenlandskPin?.identifikator}
          />
        </Column>
        <Column>
          <CountrySelect
            data-test-id={namespace + '-utenlandskpin-land'}
            error={validation[namespace + '-utenlandskpin-land']?.feilmelding}
            id={namespace + '-utenlandskpin-land'}
            includeList={landkoderList?.map((l: Kodeverk) => l.kode) ?? []}
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
      <AlignStartRow className='slideInFromLeft'>
        <Column>
          <Input
            feil={validation[namespace + '-norskpin-nummer']?.feilmelding}
            id='norskpin-nummer'
            label={t('label:norsk-fnr')}
            namespace={namespace}
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
      <VerticalSeparatorDiv size='0.5' />
      <AlignStartRow>
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
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <Undertittel>
            {t('label:fødested')}
          </Undertittel>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='0.5' />
      {_seeNewForm
        ? (
          <AlignStartRow key='showNewForm' className='slideInFromLeft'>
            <Column>
              <Input
                feil={validation[namespace + '-foedested-by']?.feilmelding}
                id='foedested-by'
                label={t('label:by')}
                namespace={namespace}
                onChanged={onFoedestedByChange}
                value={personInfo.pinMangler?.foedested.by}
              />
            </Column>
            <Column>
              <Input
                feil={validation[namespace + '-foedested-region']?.feilmelding}
                id='foedested-region'
                label={t('label:region')}
                namespace={namespace}
                onChanged={onFoedestedRegionChange}
                value={personInfo.pinMangler?.foedested.region}
              />
            </Column>
            <Column>
              <CountrySelect
                data-test-id={namespace + '-foedested-land'}
                error={validation[namespace + '-foedested-land']?.feilmelding}
                id={namespace + '-foedested-land'}
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
          <AlignStartRow key='seeNewForm'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:fødested') })}
              </HighContrastFlatknapp>
            </Column>
          </AlignStartRow>
          )}
    </PaddedDiv>
  )
}

export default PersonOpplysninger
