import { searchPerson } from 'actions/person'
import { updateReplySed } from 'actions/svarpased'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import Add from 'assets/icons/Add'
import Search from 'assets/icons/Search'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import { State } from 'declarations/reducers'
import { Kjoenn, PersonInfo, Pin } from 'declarations/sed'
import { Kodeverk, Person } from 'declarations/types'
import { Country } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  FlexCenterDiv,
  HighContrastFlatknapp,
  HighContrastKnapp,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  PaddedDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface PersonOpplysningerSelector extends PersonManagerFormSelector {
  landkoderList: Array<Kodeverk> | undefined
  searchingPerson: boolean
  searchedPerson: Person | undefined
}

const mapState = (state: State): PersonOpplysningerSelector => ({
  landkoderList: state.app.landkoder,
  replySed: state.svarpased.replySed,
  searchedPerson: state.person.person,
  searchingPerson: state.loading.searchingPerson,
  validation: state.validation.status
})

const PersonOpplysninger: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    landkoderList,
    replySed,
    searchedPerson,
    searchingPerson,
    validation
  } = useSelector<State, PersonOpplysningerSelector>(mapState)
  const dispatch = useDispatch()
  const target = `${personID}.personInfo`
  const personInfo: PersonInfo | undefined = _.get(replySed, target) // undefined for a brief time when switching to 'familie'
  const namespace = `${parentNamespace}-${personID}-personopplysninger`

  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)
  const norwegianPin = _.find(personInfo?.pin, p => p.land === 'NO')
  const utenlandskPin = _.find(personInfo?.pin, p => p.land !== 'NO')

  const onFornavnChange = (newFornavn: string) => {
    dispatch(updateReplySed(`${target}.fornavn`, newFornavn.trim()))
    if (validation[namespace + '-fornavn']) {
      dispatch(resetValidation(namespace + '-fornavn'))
    }
  }

  const onEtternavnChange = (newEtternavn: string) => {
    dispatch(updateReplySed(`${target}.etternavn`, newEtternavn.trim()))
    if (validation[namespace + '-etternavn']) {
      dispatch(resetValidation(namespace + '-etternavn'))
    }
  }

  const onFodselsdatoChange = (dato: string) => {
    dispatch(updateReplySed(`${target}.foedselsdato`, dato.trim()))
    if (validation[namespace + '-foedselsdato']) {
      dispatch(resetValidation(namespace + '-foedselsdato'))
    }
  }

  const onKjoennChange = (newKjoenn: string) => {
    dispatch(updateReplySed(`${target}.kjoenn`, newKjoenn.trim()))
    if (validation[namespace + '-kjoenn']) {
      dispatch(resetValidation(namespace + '-kjoenn'))
    }
  }

  const onFillOutPerson = (searchedPerson: Person) => {
    const newPersonInfo = _.cloneDeep(personInfo)

    if (searchedPerson.fnr) {
      const index = _.findIndex(newPersonInfo?.pin, p => p.land === 'NO')
      if (index >= 0) {
        newPersonInfo!.pin[index].identifikator = searchedPerson.fnr
      }
    }
    if (searchedPerson.fdato) {
      newPersonInfo!.foedselsdato = searchedPerson.fdato
    }
    if (searchedPerson.fornavn) {
      newPersonInfo!.fornavn = searchedPerson.fornavn
    }
    if (searchedPerson.etternavn) {
      newPersonInfo!.etternavn = searchedPerson.etternavn
    }
    if (searchedPerson.kjoenn) {
      newPersonInfo!.kjoenn = searchedPerson.kjoenn as Kjoenn
    }
    dispatch(updateReplySed(target, newPersonInfo))
    if (validation[namespace + '-fornavn']) {
      dispatch(resetValidation(namespace + '-fornavn'))
    }
    if (validation[namespace + '-etternavn']) {
      dispatch(resetValidation(namespace + '-etternavn'))
    }
    if (validation[namespace + '-kjoenn']) {
      dispatch(resetValidation(namespace + '-kjoenn'))
    }
    if (validation[namespace + '-foedselsdato']) {
      dispatch(resetValidation(namespace + '-foedselsdato'))
    }
    if (validation[namespace + '-norskpin-nummer']) {
      dispatch(resetValidation(namespace + '-norskpin-nummer'))
    }
  }

  const onUtenlandskPinChange = (newPin: string) => {
    const pin: Array<Pin> = _.cloneDeep(personInfo!.pin)
    const utendanskPinIndex = _.findIndex(pin, p => p.land !== 'NO')
    if (utendanskPinIndex >= 0) {
      pin[utendanskPinIndex].identifikator = newPin.trim()
    } else {
      pin.push({
        identifikator: newPin.trim()
      })
    }
    dispatch(updateReplySed(`${target}.pin`, pin))
    if (validation[namespace + '-utenlandskpin-nummer']) {
      dispatch(resetValidation(namespace + '-utenlandskpin-nummer'))
    }
  }

  const onUtenlandskLandChange = (land: string) => {
    const pin: Array<Pin> = _.cloneDeep(personInfo!.pin)
    const utendanskPinIndex = _.findIndex(pin, p => p.land !== 'NO')
    if (utendanskPinIndex >= 0) {
      pin[utendanskPinIndex].land = land.trim()
    } else {
      pin.push({
        land: land.trim()
      })
    }
    dispatch(updateReplySed(`${target}.pin`, pin))
    if (validation[namespace + '-utenlandskpin-land']) {
      dispatch(resetValidation(namespace + '-utenlandskpin-land'))
    }
  }

  const onNorwegianPinChange = (newPin: string) => {
    const pin: Array<Pin> = _.cloneDeep(personInfo!.pin)
    const norwegianPinIndex = _.findIndex(pin, p => p.land === 'NO')
    if (norwegianPinIndex >= 0) {
      pin[norwegianPinIndex].identifikator = newPin.trim()
    } else {
      pin.push({
        identifikator: newPin.trim()
      })
    }
    dispatch(updateReplySed(`${target}.pin`, pin))
    if (validation[namespace + '-norskpin-nummer']) {
      dispatch(resetValidation(namespace + '-norskpin-nummer'))
    }
  }

  const onFoedestedByChange = (newFodestedBy: string) => {
    dispatch(updateReplySed(`${target}.pinMangler.foedested.by`, newFodestedBy.trim()))
    if (validation[namespace + '-foedested-by']) {
      dispatch(resetValidation(namespace + '-foedested-by'))
    }
  }

  const onFoedestedRegionChange = (newFodestedRegion: string) => {
    dispatch(updateReplySed(`${target}.pinMangler.foedested.region`, newFodestedRegion.trim()))
    if (validation[namespace + '-foedested-region']) {
      dispatch(resetValidation(namespace + '-foedested-region'))
    }
  }

  const onFoedestedLandChange = (newLand: string) => {
    dispatch(updateReplySed(`${target}.pinMangler.foedested.land`, newLand.trim()))
    if (validation[namespace + '-foedested-land']) {
      dispatch(resetValidation(namespace + '-foedested-land'))
    }
  }

  const onSearchUser = () => {
    if (norwegianPin && norwegianPin.identifikator) {
      dispatch(searchPerson(norwegianPin.identifikator))
    }
  }

  return (
    <PaddedDiv key={namespace + '-div'}>
      <Undertittel>
        {t('label:personopplysninger')}
      </Undertittel>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <Input
            feil={validation[namespace + '-fornavn']?.feilmelding}
            id='fornavn'
            key={namespace + '-fornavn-' + (personInfo?.fornavn ?? '')}
            label={t('label:fornavn') + ' *'}
            namespace={namespace}
            onChanged={onFornavnChange}
            required
            value={personInfo?.fornavn ?? ''}
          />
        </Column>
        <Column>
          <Input
            feil={validation[namespace + '-etternavn']?.feilmelding}
            id='etternavn'
            key={namespace + '-fornavn-' + (personInfo?.etternavn ?? '')}
            label={t('label:etternavn') + ' *'}
            namespace={namespace}
            onChanged={onEtternavnChange}
            required
            value={personInfo?.etternavn ?? ''}
          />
        </Column>
        <Column>
          <DateInput
            feil={validation[namespace + '-foedselsdato']?.feilmelding}
            id='foedselsdato'
            key={namespace + '-foedselsdato-' + (personInfo?.foedselsdato ?? '')}
            label={t('label:fødselsdato') + ' *'}
            namespace={namespace}
            onChanged={onFodselsdatoChange}
            required
            value={personInfo?.foedselsdato ?? ''}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow>
        <Column>
          <HighContrastRadioPanelGroup
            checked={personInfo?.kjoenn}
            data-no-border
            data-test-id={namespace + '-kjoenn'}
            feil={validation[namespace + '-kjoenn']?.feilmelding}
            id={namespace + '-kjoenn'}
            key={namespace + '-kjoenn-' + (personInfo?.kjoenn ?? '')}
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
            key={namespace + '-utenlandskpin-nummer-' + utenlandskPin?.identifikator}
            label={t('label:utenlandsk-pin')}
            namespace={namespace}
            onChanged={onUtenlandskPinChange}
            value={utenlandskPin?.identifikator}
          />
        </Column>
        <Column>
          <CountrySelect
            closeMenuOnSelect
            data-test-id={namespace + '-utenlandskpin-land'}
            error={validation[namespace + '-utenlandskpin-land']?.feilmelding}
            flagWave
            id={namespace + '-utenlandskpin-land'}
            includeList={landkoderList?.map((l: Kodeverk) => l.kode) ?? []}
            label={t('label:land')}
            menuPortalTarget={document.body}
            onOptionSelected={(e: Country) => onUtenlandskLandChange(e.value)}
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
            key={namespace + '-norskpin-nummer-' + norwegianPin?.identifikator}
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
      <VerticalSeparatorDiv />
      <AlignStartRow>
        <Column>
          {searchedPerson
            ? (
              <FlexCenterDiv>
                <Normaltekst>
                  {searchedPerson.fornavn + ' ' + searchedPerson.etternavn + ' (' + searchedPerson.kjoenn + ')'}
                </Normaltekst>
                <HorizontalSeparatorDiv />
                <HighContrastKnapp
                  mini kompakt
                  onClick={() => onFillOutPerson(searchedPerson)}
                >
                  {t('label:fill-in-person-data')}
                </HighContrastKnapp>
              </FlexCenterDiv>
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
                value={personInfo!.pinMangler?.foedested.by}
              />
            </Column>
            <Column>
              <Input
                feil={validation[namespace + '-foedested-region']?.feilmelding}
                id='foedested-region'
                label={t('label:region')}
                namespace={namespace}
                onChanged={onFoedestedRegionChange}
                value={personInfo!.pinMangler?.foedested.region}
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
                onOptionSelected={(e: Country) => onFoedestedLandChange(e.value)}
                placeholder={t('el:placeholder-select-default')}
                values={personInfo!.pinMangler?.foedested.land}
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
                {t('el:button-add-x', { x: t('label:fødested') })}
              </HighContrastFlatknapp>
            </Column>
          </AlignStartRow>
          )}
    </PaddedDiv>
  )
}

export default PersonOpplysninger
