import { Add, CollapseFilled, Edit, Search } from '@navikt/ds-icons'
import { BodyLong, Button, Heading, Loader } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  FlexCenterDiv,
  FlexEndDiv,
  FlexRadioPanels,
  HorizontalSeparatorDiv,
  PaddedDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { Country, CountryFilter } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { resetPerson, searchPerson } from 'actions/person'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import UtenlandskPins from 'components/UtenlandskPins/UtenlandskPins'
import { State } from 'declarations/reducers'
import { Kjoenn, PersonInfo, Pin } from 'declarations/sed'
import { Person } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface PersonOpplysningerSelector extends PersonManagerFormSelector {
  searchingPerson: boolean
  searchedPerson: Person | null | undefined
}

const mapState = (state: State): PersonOpplysningerSelector => ({
  searchedPerson: state.person.person,
  searchingPerson: state.loading.searchingPerson,
  validation: state.validation.status
})

const PersonOpplysninger: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}:PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    searchedPerson,
    searchingPerson,
    validation
  } = useSelector<State, PersonOpplysningerSelector>(mapState)
  const dispatch = useDispatch()
  const target: string = `${personID}.personInfo`
  const personInfo: PersonInfo | undefined = _.get(replySed, target) // undefined for a brief time when switching to 'familie'
  const namespace: string = `${parentNamespace}-${personID}-personopplysninger`

  const [_seeNewFoedstedForm, setSeeNewFoedstedForm] = useState<boolean>(false)

  const norwegianPin: Pin | undefined = _.find(personInfo?.pin, p => p.land === 'NO')
  const utenlandskPins: Array<Pin> = _.filter(personInfo?.pin, p => p.land !== 'NO')

  const [_seeNorskPinForm, _setSeeNorskPinForm] = useState<boolean>(false)

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
    dispatch(resetPerson())
    _setSeeNorskPinForm(false)
  }

  const onUtenlandskPinChange = (newPins: Array<Pin>, whatChanged: string | undefined) => {
    let pins: Array<Pin> = _.cloneDeep(newPins)
    if (_.isNil(pins)) {
      pins = []
    }
    const norwegianPin: Pin | undefined = _.find(personInfo!.pin, p => p.land === 'NO')
    if (!_.isEmpty(norwegianPin)) {
      pins.unshift(norwegianPin!)
    }
    dispatch(updateReplySed(`${target}.pin`, pins))
    if (whatChanged && validation[whatChanged]) {
      dispatch(resetValidation(whatChanged))
    }
  }

  const onNorwegianPinChange = (newPin: string) => {
    let pins: Array<Pin> = _.cloneDeep(personInfo!.pin)
    if (_.isNil(pins)) {
      pins = []
    }
    const norwegianPinIndex = _.findIndex(pins, p => p.land === 'NO')
    if (norwegianPinIndex >= 0) {
      pins[norwegianPinIndex].identifikator = newPin.trim()
    } else {
      pins.push({
        identifikator: newPin.trim(),
        land: 'NO'
      })
    }
    dispatch(updateReplySed(`${target}.pin`, pins))
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

  const onSearchUser = (e: any) => {
    if (norwegianPin && norwegianPin.identifikator) {
      buttonLogger(e)
      dispatch(searchPerson(norwegianPin.identifikator))
    }
  }

  return (
    <>
      <PaddedDiv key={namespace + '-div'}>
        <Heading size='small'>
          {t('label:personopplysninger')}
        </Heading>
        <VerticalSeparatorDiv size='2' />
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-fornavn']?.feilmelding}
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
              error={validation[namespace + '-etternavn']?.feilmelding}
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
              error={validation[namespace + '-foedselsdato']?.feilmelding}
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
            <RadioPanelGroup
              value={personInfo?.kjoenn}
              data-no-border
              data-testid={namespace + '-kjoenn'}
              error={validation[namespace + '-kjoenn']?.feilmelding}
              id={namespace + '-kjoenn'}
              key={namespace + '-kjoenn-' + (personInfo?.kjoenn ?? '')}
              legend={t('label:kjønn') + ' *'}
              name={namespace + '-kjoenn'}
              onChange={onKjoennChange}
            >
              <FlexRadioPanels>
                <RadioPanel value='K'>
                  {t(personID?.startsWith('barn') ? 'label:jente' : 'label:kvinne')}
                </RadioPanel>
                <RadioPanel value='M'>
                  {t(personID?.startsWith('barn') ? 'label:gutt' : 'label:mann')}
                </RadioPanel>
                <RadioPanel value='U'>
                  {t('label:ukjent')}
                </RadioPanel>
              </FlexRadioPanels>

            </RadioPanelGroup>

          </Column>
        </AlignStartRow>
      </PaddedDiv>
      <VerticalSeparatorDiv />
      <UtenlandskPins
        limit={99}
        loggingNamespace='svarsed.editor.personopplysning'
        pins={utenlandskPins}
        onPinsChanged={onUtenlandskPinChange}
        namespace={namespace + '-pin'}
        validation={validation}
      />

      <VerticalSeparatorDiv />
      <PaddedDiv>
        <label className='navds-text-field__label navds-label'>
          {t('label:norsk-fnr')}
        </label>
        <VerticalSeparatorDiv />
        <AlignStartRow className='slideInFromLeft'>
          {!_seeNorskPinForm
            ? (
              <>
                <Column>
                  <BodyLong>
                    {norwegianPin?.identifikator ?? t('message:warning-no-fnr')}
                  </BodyLong>
                </Column>
                <Column>
                  <Button
                    variant='secondary'
                    onClick={() => _setSeeNorskPinForm(true)}
                  >
                    <FlexCenterDiv>
                      <Edit />
                      <HorizontalSeparatorDiv size='0.35' />
                      {t('label:endre')}
                    </FlexCenterDiv>
                  </Button>
                </Column>
                <Column />
              </>
              )
            : (
              <>
                <Column>
                  <Input
                    error={validation[namespace + '-norskpin-nummer']?.feilmelding}
                    id='norskpin-nummer'
                    key={namespace + '-norskpin-nummer-' + norwegianPin?.identifikator}
                    label=''
                    namespace={namespace}
                    onChanged={onNorwegianPinChange}
                    value={norwegianPin?.identifikator}
                  />
                </Column>
                <Column>
                  <FlexEndDiv>
                    <Button
                      variant='secondary'
                      disabled={searchingPerson}
                      data-amplitude='svarsed.editor.personopplysning.norskpin.search'
                      onClick={onSearchUser}
                    >
                      <Search />
                      <HorizontalSeparatorDiv />
                      {searchingPerson
                        ? t('message:loading-searching')
                        : t('el:button-search-for-x', { x: t('label:person').toLowerCase() })}
                      {searchingPerson && <Loader />}
                    </Button>
                    <HorizontalSeparatorDiv size='0.35' />
                    <Button
                      variant='tertiary'
                      onClick={() => _setSeeNorskPinForm(false)}
                    >
                      {t('el:button-cancel')}
                    </Button>
                  </FlexEndDiv>
                </Column>
              </>
              )}
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow>
          <Column>
            {searchedPerson
              ? (
                <FlexCenterDiv>
                  <BodyLong>
                    {searchedPerson.fornavn + ' ' + searchedPerson.etternavn + ' (' + searchedPerson.kjoenn + ')'}
                  </BodyLong>
                  <HorizontalSeparatorDiv />
                  <Button
                    variant='secondary'
                    data-amplitude='svarsed.editor.personopplysning.norskpin.fill'
                    onClick={(e) => {
                      buttonLogger(e)
                      onFillOutPerson(searchedPerson)
                    }}
                  >
                    {t('label:fill-in-person-data')}
                  </Button>
                </FlexCenterDiv>
                )
              : _.isEmpty(norwegianPin?.identifikator)
                ? (
                  <BodyLong>
                    {t('label:norsk-fnr-beskrivelse')}
                  </BodyLong>
                  )
                : <div />}
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='2' />
        <AlignStartRow>
          <Column>
            <Heading size='small'>
              {t('label:fødested')}
            </Heading>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
        {_seeNewFoedstedForm
          ? (
            <>
              <AlignStartRow key='showNewForm' className='slideInFromLeft'>
                <Column>
                  <Input
                    error={validation[namespace + '-foedested-by']?.feilmelding}
                    id='foedested-by'
                    label={t('label:by')}
                    namespace={namespace}
                    onChanged={onFoedestedByChange}
                    value={personInfo!.pinMangler?.foedested?.by ?? ''}
                  />
                </Column>
                <Column>
                  <Input
                    error={validation[namespace + '-foedested-region']?.feilmelding}
                    id='foedested-region'
                    label={t('label:region')}
                    namespace={namespace}
                    onChanged={onFoedestedRegionChange}
                    value={personInfo!.pinMangler?.foedested?.region ?? ''}
                  />
                </Column>
                <Column>
                  <CountrySelect
                    data-testid={namespace + '-foedested-land'}
                    error={validation[namespace + '-foedested-land']?.feilmelding}
                    id={namespace + '-foedested-land'}
                    includeList={CountryFilter.STANDARD({})}
                    label={t('label:land')}
                    menuPortalTarget={document.body}
                    onOptionSelected={(e: Country) => onFoedestedLandChange(e.value)}
                    values={personInfo!.pinMangler?.foedested?.land ?? ''}
                  />
                </Column>
              </AlignStartRow>
              <VerticalSeparatorDiv />
              <AlignStartRow>
                <Column flex='2' />
                <Column>
                  <Button
                    variant='tertiary'
                    onClick={() => setSeeNewFoedstedForm(false)}
                  >
                    <CollapseFilled />
                    <HorizontalSeparatorDiv size='0.5' />
                    {t('label:show-less')}
                  </Button>
                </Column>
              </AlignStartRow>
            </>
            )
          : (
            <AlignStartRow key='seeNewForm'>
              <Column>
                <Button
                  variant='tertiary'
                  onClick={() => setSeeNewFoedstedForm(true)}
                >
                  <Add />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-add-x', { x: t('label:fødested') })}
                </Button>
              </Column>
            </AlignStartRow>
            )}
      </PaddedDiv>
    </>
  )
}

export default PersonOpplysninger
