import { Add, Edit, Search } from '@navikt/ds-icons'
import { resetPerson, searchPerson } from 'actions/person'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Kjoenn, PersonInfo, Pin } from 'declarations/sed'
import { Person } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import { Country, CountryFilter } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import Chevron from 'nav-frontend-chevron'
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
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validatePin, ValidationPinProps } from './validation'

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
  personName,
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
  const [_seeNorskPinForm, _setSeeNorskPinForm] = useState<boolean>(false)
  const landUtenNorge = CountryFilter.STANDARD?.filter((it: string) => it !== 'NO')
  const [_newIdentifikator, _setNewIdentifikator] = useState<string>('')
  const [_newLand, _setNewLand] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<Pin>((p: Pin): string => p.land + '-' + p.identifikator)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationPinProps>({}, validatePin)

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

  const onUtenlandskIdentifikatorChange = (newIdentifikator: string, index: number) => {
    if (index < 0) {
      _setNewIdentifikator(newIdentifikator.trim())
      _resetValidation(namespace + '-pin-identifikator')
    } else {
      dispatch(updateReplySed(`${target}.pin[${index}].identifikator`, newIdentifikator.trim()))
      if (validation[namespace + '-pin' + getIdx(index) + '-identifikator']) {
        dispatch(resetValidation('-pin' + getIdx(index) + '-identifikator'))
      }
    }
  }

  const onUtenlandskLandChange = (newLand: string, index: number) => {
    if (index < 0) {
      _setNewLand(newLand.trim())
      _resetValidation(namespace + '-pin-land')
    } else {
      dispatch(updateReplySed(`${target}.pin[${index}].land`, newLand))
      if (validation[namespace + '-pin' + getIdx(index) + '-land']) {
        dispatch(resetValidation(namespace + '-pin' + getIdx(index) + '-land'))
      }
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

  const onSearchUser = (e: React.ChangeEvent<HTMLButtonElement>) => {
    if (norwegianPin && norwegianPin.identifikator) {
      buttonLogger(e)
      dispatch(searchPerson(norwegianPin.identifikator))
    }
  }

  const resetForm = () => {
    _setNewIdentifikator('')
    _setNewLand('')
    _resetValidation()
  }

  const onCancel = () => {
    _setSeeNewForm(false)
    resetForm()
  }

  const onRemove = (index: number) => {
    const newPin: Array<Pin> = _.cloneDeep(personInfo?.pin) as Array<Pin>
    const deletedPin: Array<Pin> = newPin.splice(index, 1)
    if (deletedPin && deletedPin.length > 0) {
      removeFromDeletion(deletedPin[0])
    }
    standardLogger('svarsed.editor.personopplysning.utenlandskpin.remove')
    dispatch(updateReplySed(`${target}.pin`, newPin))
  }

  const onAdd = () => {
    const newPin: Pin = {
      identifikator: _newIdentifikator,
      land: _newLand
    }

    const valid: boolean = performValidation({
      pin: newPin,
      pins: personInfo?.pin ?? [],
      namespace: namespace + '-pin',
      personName: personName
    })
    if (valid) {
      let newPins: Array<Pin> | undefined = _.cloneDeep(personInfo?.pin)
      if (_.isNil(newPins)) {
        newPins = []
      }
      newPins = newPins.concat(newPin)
      dispatch(updateReplySed(`${target}.pin`, newPins))
      standardLogger('svarsed.editor.personopplysning.utenlandskpin.add')
      resetForm()
    }
  }

  const renderRow = (pin: Pin | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(pin)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-pin-' + el]?.feilmelding
        : validation[namespace + '-pin' + idx + '-' + el]?.feilmelding
    )
    // hide the Norwegian pins. We are doing this to preserve index numbers,
    // so when we are deleting / changing elements, pin array keeps the order
    if (pin?.land === 'NO') {
      return <div />
    }
    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
          style={{ animationDelay: index < 0 ? '0s' : (index * 0.3) + 's' }}
        >
          <Column>
            <Input
              feil={getErrorFor(index, 'identifikator')}
              id='identifikator'
              key={namespace + '-pin' + idx + '-identifikator-' + (index < 0 ? _newIdentifikator : pin?.identifikator)}
              label={t('label:utenlandsk-pin')}
              namespace={namespace + '-pin'}
              onChanged={(id: string) => onUtenlandskIdentifikatorChange(id, index)}
              value={index < 0 ? _newIdentifikator : pin?.identifikator}
            />
          </Column>
          <Column>
            <CountrySelect
              closeMenuOnSelect
              data-test-id={namespace + '-pin-land'}
              error={getErrorFor(index, 'land')}
              flagWave
              id={namespace + '-pin-land'}
              includeList={landUtenNorge}
              key={namespace + '-pin' + idx + '-land-' + (index < 0 ? _newLand : pin?.land)}
              label={t('label:land')}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => onUtenlandskLandChange(e.value, index)}
              placeholder={t('el:placeholder-select-default')}
              values={index < 0 ? _newLand : pin?.land}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(pin)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(pin)}
              onAddNew={onAdd}
              onCancelNew={onCancel}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </RepeatableRow>
    )
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
      {personInfo?.pin?.map(renderRow)}
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => _setSeeNewForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv size='0.5' />
                {t('el:button-add-new-x', { x: t('label:utenlandsk-pin').toLowerCase() })}
              </HighContrastFlatknapp>
            </Column>
          </Row>
          )}
      <VerticalSeparatorDiv />
      <label className='skjemaelement__label'>
        {t('label:norsk-fnr')}
      </label>
      <VerticalSeparatorDiv />
      <AlignStartRow className='slideInFromLeft'>
        {!_seeNorskPinForm
          ? (
            <>
              <Column>
                <Normaltekst>
                  {norwegianPin?.identifikator ?? t('message:warning-no-fnr')}
                </Normaltekst>
              </Column>
              <Column>
                <HighContrastKnapp
                  kompakt
                  onClick={() => _setSeeNorskPinForm(true)}
                >
                  <FlexCenterDiv>
                    <Edit />
                    <HorizontalSeparatorDiv size='0.35' />
                    {t('label:endre')}
                  </FlexCenterDiv>
                </HighContrastKnapp>
              </Column>
              <Column />
            </>
            )
          : (
            <>
              <Column>
                <Input
                  feil={validation[namespace + '-norskpin-nummer']?.feilmelding}
                  id='norskpin-nummer'
                  key={namespace + '-norskpin-nummer-' + norwegianPin?.identifikator}
                  label=''
                  namespace={namespace}
                  onChanged={onNorwegianPinChange}
                  value={norwegianPin?.identifikator}
                />
              </Column>
              <Column>
                <HighContrastKnapp
                  kompakt
                  disabled={searchingPerson}
                  spinner={searchingPerson}
                  data-amplitude='svarsed.editor.personopplysning.norskpin.search'
                  onClick={onSearchUser}
                >
                  <Search />
                  <HorizontalSeparatorDiv />
                  {searchingPerson
                    ? t('message:loading-searching')
                    : t('el:button-search-for-x', { x: t('label:person').toLowerCase() })}
                </HighContrastKnapp>
                <HorizontalSeparatorDiv size='0.35' />
                <HighContrastFlatknapp
                  kompakt
                  onClick={() => _setSeeNorskPinForm(false)}
                >
                  {t('el:button-cancel')}
                </HighContrastFlatknapp>
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
                <Normaltekst>
                  {searchedPerson.fornavn + ' ' + searchedPerson.etternavn + ' (' + searchedPerson.kjoenn + ')'}
                </Normaltekst>
                <HorizontalSeparatorDiv />
                <HighContrastKnapp
                  mini
                  kompakt
                  data-amplitude='svarsed.editor.personopplysning.norskpin.fill'
                  onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
                    buttonLogger(e)
                    onFillOutPerson(searchedPerson)
                  }}
                >
                  {t('label:fill-in-person-data')}
                </HighContrastKnapp>
              </FlexCenterDiv>
              )
            : _.isEmpty(norwegianPin?.identifikator)
              ? (
                <Normaltekst>
                  {t('label:norsk-fnr-beskrivelse')}
                </Normaltekst>
                )
              : <div />}
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
      {_seeNewFoedstedForm
        ? (
          <>
            <AlignStartRow key='showNewForm' className='slideInFromLeft'>
              <Column>
                <Input
                  feil={validation[namespace + '-foedested-by']?.feilmelding}
                  id='foedested-by'
                  label={t('label:by')}
                  namespace={namespace}
                  onChanged={onFoedestedByChange}
                  value={personInfo!.pinMangler?.foedested?.by ?? ''}
                />
              </Column>
              <Column>
                <Input
                  feil={validation[namespace + '-foedested-region']?.feilmelding}
                  id='foedested-region'
                  label={t('label:region')}
                  namespace={namespace}
                  onChanged={onFoedestedRegionChange}
                  value={personInfo!.pinMangler?.foedested?.region ?? ''}
                />
              </Column>
              <Column>
                <CountrySelect
                  data-test-id={namespace + '-foedested-land'}
                  error={validation[namespace + '-foedested-land']?.feilmelding}
                  id={namespace + '-foedested-land'}
                  includeList={CountryFilter.STANDARD}
                  label={t('label:land')}
                  menuPortalTarget={document.body}
                  onOptionSelected={(e: Country) => onFoedestedLandChange(e.value)}
                  placeholder={t('el:placeholder-select-default')}
                  values={personInfo!.pinMangler?.foedested?.land ?? ''}
                />
              </Column>
            </AlignStartRow>
            <VerticalSeparatorDiv />
            <AlignStartRow>
              <Column flex='2' />
              <Column>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={() => setSeeNewFoedstedForm(false)}
                >
                  <Chevron type='opp' />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('label:show-less')}
                </HighContrastFlatknapp>
              </Column>
            </AlignStartRow>
          </>
          )
        : (
          <AlignStartRow key='seeNewForm'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setSeeNewFoedstedForm(true)}
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
