import { Cancel, Edit, Search, SuccessStroke } from '@navikt/ds-icons'
import { BodyLong, Button, Heading, Label, Loader } from '@navikt/ds-react'
import {
  AlignCenterRow,
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
import { resetPerson, searchPerson } from 'actions/person'
import { resetValidation } from 'actions/validation'
import { TwoLevelFormProps, TwoLevelFormSelector } from 'applications/SvarSed/TwoLevelForm'
import FoedestedFC from 'components/Foedested/Foedested'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import UtenlandskPins from 'components/UtenlandskPins/UtenlandskPins'
import { State } from 'declarations/reducers'
import { Foedested, Kjoenn, PersonInfo, Pin } from 'declarations/sed.d'
import { Person } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

interface PersonOpplysningerSelector extends TwoLevelFormSelector {
  searchingPerson: boolean
  searchedPerson: Person | null | undefined
}

const mapState = (state: State): PersonOpplysningerSelector => ({
  searchedPerson: state.person.person,
  searchingPerson: state.loading.searchingPerson,
  validation: state.validation.status
})

const PersonOpplysninger: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}:TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()
  const {
    searchedPerson,
    searchingPerson,
    validation
  } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target: string = `${personID}.personInfo`
  const personInfo: PersonInfo | undefined = _.get(replySed, target) // undefined for a brief time when switching to 'familie'
  const namespace: string = `${parentNamespace}-${personID}-personopplysninger`

  const norwegianPin: Pin | undefined = _.find(personInfo?.pin, p => p.land === 'NO')
  const utenlandskPins: Array<Pin> = _.filter(personInfo?.pin, p => p.land !== 'NO')

  const [_tempNorwegianPin, _setTempNorwegianPin] = useState<string| undefined>(undefined)
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

  const onFoedestedChange = (newFoedested: Foedested | undefined, whatChanged: string | undefined) => {
    let foedested: Foedested | undefined = _.cloneDeep(newFoedested)
    if (_.isNil(foedested)) {
      foedested = {} as Foedested
    }
    dispatch(updateReplySed(`${target}.pinMangler.foedested`, foedested))
    if (whatChanged && validation[namespace + '-foedested-' + whatChanged]) {
      dispatch(resetValidation(namespace + '-foedested-' + whatChanged))
    }
  }

  const onNorwegianPinChange = (newPin: string) => {
    _setTempNorwegianPin(newPin)
  }

  const onNorwegianPinSave = () => {
    let pins: Array<Pin> = _.cloneDeep(personInfo!.pin)
    if (_.isNil(pins)) {
      pins = []
    }
    const norwegianPinIndex = _.findIndex(pins, p => p.land === 'NO')
    if (norwegianPinIndex >= 0) {
      pins[norwegianPinIndex].identifikator = _tempNorwegianPin!.trim()
    } else {
      pins.push({
        identifikator: _tempNorwegianPin!.trim(),
        land: 'NO'
      })
    }
    dispatch(updateReplySed(`${target}.pin`, pins))
    if (validation[namespace + '-norskpin-nummer']) {
      dispatch(resetValidation(namespace + '-norskpin-nummer'))
    }
    _setSeeNorskPinForm(false)
  }

  const onSearchUser = (e: any) => {
    if (norwegianPin && norwegianPin.identifikator) {
      buttonLogger(e)
      dispatch(searchPerson(norwegianPin.identifikator))
    }
  }

  return (
    <div key={namespace + '-div'}>
      <PaddedDiv>
        <AlignCenterRow>
          {!_seeNorskPinForm
            ? (
              <>
                <Column>
                  <FlexCenterDiv>
                    <Label>
                      {t('label:fnr-eller-dnr')}
                    </Label>
                    <HorizontalSeparatorDiv />
                    <BodyLong>
                      {norwegianPin?.identifikator ?? t('message:warning-no-fnr')}
                    </BodyLong>
                  </FlexCenterDiv>
                </Column>
                <Column>
                  <Button
                    variant='secondary'
                    onClick={() => {
                      _setTempNorwegianPin(norwegianPin?.identifikator)
                      _setSeeNorskPinForm(true)
                    }}
                  >
                    <Edit />
                    {t('label:endre')}
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
                    key={namespace + '-norskpin-nummer-' + _tempNorwegianPin}
                    label={t('label:fnr-eller-dnr')}
                    hideLabel
                    namespace={namespace}
                    onChanged={onNorwegianPinChange}
                    value={_tempNorwegianPin}
                  />
                </Column>
                <Column>
                  <FlexEndDiv>
                    <Button
                      variant='secondary'
                      disabled={_.isEmpty(_tempNorwegianPin?.trim())}
                      data-amplitude='svarsed.editor.personopplysning.norskpin.save'
                      onClick={onNorwegianPinSave}
                    >
                      <SuccessStroke />
                      {t('el:button-save')}
                    </Button>
                    <HorizontalSeparatorDiv size='0.35' />
                    <Button
                      variant='secondary'
                      disabled={searchingPerson}
                      data-amplitude='svarsed.editor.personopplysning.norskpin.search'
                      onClick={onSearchUser}
                    >
                      <Search />
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
                      <Cancel />
                      {t('el:button-cancel')}
                    </Button>
                  </FlexEndDiv>
                </Column>
              </>
              )}
        </AlignCenterRow>
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
                      onFillOutPerson(searchedPerson!)
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
        <VerticalSeparatorDiv />
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
                <RadioPanel value='M'>
                  {t(personID?.startsWith('barn') ? 'label:gutt' : 'label:mann')}
                </RadioPanel>
                <RadioPanel value='K'>
                  {t(personID?.startsWith('barn') ? 'label:jente' : 'label:kvinne')}
                </RadioPanel>
                <RadioPanel value='U'>
                  {t('label:ukjent')}
                </RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <Heading size='small'>
          {t('label:utenlandske-pin')}
        </Heading>
      </PaddedDiv>
      <UtenlandskPins
        limit={99}
        loggingNamespace='svarsed.editor.personopplysning'
        pins={utenlandskPins}
        onPinsChanged={onUtenlandskPinChange}
        namespace={namespace + '-pin'}
        validation={validation}
      />
      <PaddedDiv>
        <VerticalSeparatorDiv />
        <Heading size='small'>
          {t('label:fødested')}
        </Heading>
      </PaddedDiv>
      <FoedestedFC
        loggingNamespace='svarsed.editor.fodested'
        foedested={personInfo?.pinMangler?.foedested}
        onFoedestedChanged={onFoedestedChange}
        namespace={namespace + '-foedested'}
        validation={validation}
      />
    </div>
  )
}

export default PersonOpplysninger