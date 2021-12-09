import { Add, Search } from '@navikt/ds-icons'
import { BodyLong, Button, Heading, Loader } from '@navikt/ds-react'
import { resetPerson, searchPerson } from 'actions/person'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import { HorizontalLineSeparator, RepeatableRow } from 'components/StyledComponents'
import { Pdu1Person } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { Person as IPerson } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import useValidation from 'hooks/useValidation'
import { Country, CountryFilter } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import {
  AlignStartRow,
  Column,
  FlexCenterDiv,
  FlexRadioPanels,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PaddedHorizontallyDiv,
  RadioPanel,
  RadioPanelGroup,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getIdx } from 'utils/namespace'
import { validateUtenlandskPin, ValidationUtenlandskPinProps } from './validation'

interface PersonOpplysningerSelector extends PersonManagerFormSelector {
  searchingPerson: boolean
  searchedPerson: IPerson | null | undefined
}

const mapState = (state: State): PersonOpplysningerSelector => ({
  searchedPerson: state.person.person,
  searchingPerson: state.loading.searchingPerson,
  validation: state.validation.status
})

const Person: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
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
  const target: string = 'bruker'
  const pdu1Person: Pdu1Person | undefined = _.get(replySed, target) // undefined for a brief time when switching to 'familie'
  const namespace: string = `${parentNamespace}-person`
  const landUtenNorge = CountryFilter.STANDARD?.filter((it: string) => it !== 'NO')
  const [_newIdentifikator, _setNewIdentifikator] = useState<string>('')
  const [_newLand, _setNewLand] = useState<string>('')

  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<string>((p: string): string => p)
  const [_seeNewForm, _setSeeNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, performValidation] = useValidation<ValidationUtenlandskPinProps>({}, validateUtenlandskPin)

  const onFnrChange = (newFnr: string) => {
    dispatch(updateReplySed(`${target}.fnr`, newFnr.trim()))
    if (validation[namespace + '-fnr']) {
      dispatch(resetValidation(namespace + '-fnr'))
    }
  }

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

  const onEtternavnVedFoedselChange = (newEtternavnVedFoedsel: string) => {
    dispatch(updateReplySed(`${target}.etternavnVedFoedsel`, newEtternavnVedFoedsel.trim()))
    if (validation[namespace + '-etternavnVedFoedsel']) {
      dispatch(resetValidation(namespace + '-etternavnVedFoedsel'))
    }
  }

  const onUtenlandskeIdentifikatorChange = (newIdentifikator: string, index: number) => {
    if (index < 0) {
      _setNewIdentifikator(newIdentifikator.trim())
      _resetValidation(namespace + '-utenlandskepin-identifikator')
    } else {
      dispatch(updateReplySed(`${target}.pin[${index}].identifikator`, newIdentifikator.trim()))
      if (validation[namespace + '-utenlandskepin' + getIdx(index) + '-identifikator']) {
        dispatch(resetValidation('-utenlandskepin' + getIdx(index) + '-identifikator'))
      }
    }
  }

  const onUtenlandskeLandChange = (newLand: string, index: number) => {
    if (index < 0) {
      _setNewLand(newLand.trim())
      _resetValidation(namespace + '-utenlandskepin-land')
    } else {
      dispatch(updateReplySed(`${target}.pin[${index}].land`, newLand))
      if (validation[namespace + '-utenlandskepin' + getIdx(index) + '-land']) {
        dispatch(resetValidation(namespace + '-utenlandskepin' + getIdx(index) + '-land'))
      }
    }
  }

  const onRemove = (index: number) => {
    const newUtenlandskePin: Array<string> = _.cloneDeep(pdu1Person?.utenlandskePin) as Array<string>
    const deletedUtenlandskePin: Array<string> = newUtenlandskePin.splice(index, 1)
    if (deletedUtenlandskePin && deletedUtenlandskePin.length > 0) {
      removeFromDeletion(deletedUtenlandskePin[0])
    }
    standardLogger('pdu1.editor.person.utenlandskpin.remove')
    dispatch(updateReplySed(`${target}.utenlandskePin`, newUtenlandskePin))
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

  const onAdd = () => {
    const valid: boolean = performValidation({
      land: _newLand,
      identifikator: _newIdentifikator,
      utenlandskePins: pdu1Person?.utenlandskePin ?? [],
      namespace: namespace + '-utenlandskepin'
    })
    if (valid) {
      let newUtenlandskePins: Array<string> = _.cloneDeep(pdu1Person?.utenlandskePin) as Array<string>
      if (_.isNil(newUtenlandskePins)) {
        newUtenlandskePins = []
      }
      newUtenlandskePins = newUtenlandskePins.concat(_newLand + ' ' + _newIdentifikator)
      dispatch(updateReplySed(`${target}.utenlandskePin`, newUtenlandskePins))
      standardLogger('pdu1.editor.person.utenlandskpin.add')
      onCancel()
    }
  }

  const onFillOutPerson = (searchedPerson: IPerson) => {
    onFodselsdatoChange(searchedPerson.fdato!)
    onFornavnChange(searchedPerson.fornavn!)
    onEtternavnChange(searchedPerson.etternavn!)
    onKjoennChange(searchedPerson.kjoenn!)
    dispatch(resetPerson())
  }

  const onSearchUser = (e: any) => {
    if (!_.isNil(pdu1Person?.fnr)) {
      buttonLogger(e)
      dispatch(searchPerson(pdu1Person!.fnr))
    }
  }

  const renderRow = (utenlandskePin: string | null, index: number) => {
    const candidateForDeletion = index < 0 ? false : isInDeletion(utenlandskePin)
    const els = utenlandskePin?.split(/\s+/)
    const idx = getIdx(index)
    const getErrorFor = (index: number, el: string): string | undefined => (
      index < 0
        ? _validation[namespace + '-utenlandskepin-' + el]?.feilmelding
        : validation[namespace + '-utenlandskepin' + idx + '-' + el]?.feilmelding
    )

    return (
      <RepeatableRow className={classNames({ new: index < 0 })}>
        <AlignStartRow
          className={classNames('slideInFromLeft')}
        >
          <Column>
            <Input
              error={getErrorFor(index, 'identifikator')}
              id='identifikator'
              key={namespace + '-utenlandskepin' + idx + '-identifikator-' + (index < 0 ? _newIdentifikator : els?.[1])}
              label={t('label:utenlandsk-pin')}
              hideLabel
              namespace={namespace + '-utenlandskepin'}
              onChanged={(id: string) => onUtenlandskeIdentifikatorChange(id, index)}
              value={index < 0 ? _newIdentifikator : els?.[1]}
            />
          </Column>
          <Column>
            <CountrySelect
              closeMenuOnSelect
              data-test-id={namespace + '-utenlandskepin' + idx + '-land'}
              error={getErrorFor(index, 'land')}
              flagWave
              id={namespace + '-utenlandskepin' + idx + '-land'}
              includeList={landUtenNorge}
              hideLabel
              key={namespace + '-utenlandskepin' + idx + '-land-' + (index < 0 ? _newLand : els?.[0])}
              label={t('label:land')}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => onUtenlandskeLandChange(e.value, index)}
              values={index < 0 ? _newLand : els?.[0]}
            />
          </Column>
          <Column>
            <AddRemovePanel
              candidateForDeletion={candidateForDeletion}
              existingItem={(index >= 0)}
              marginTop
              onBeginRemove={() => addToDeletion(utenlandskePin)}
              onConfirmRemove={() => onRemove(index)}
              onCancelRemove={() => removeFromDeletion(utenlandskePin)}
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
    <div key={namespace + '-div'}>
      <VerticalSeparatorDiv />
      <PaddedHorizontallyDiv>
        <Heading size='medium'>
          {t('label:personopplysninger')}
        </Heading>
        <VerticalSeparatorDiv size='2' />
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-fornavn']?.feilmelding}
              id='fornavn'
              key={namespace + '-fornavn-' + (pdu1Person?.fornavn ?? '')}
              label={t('label:fornavn') + ' *'}
              namespace={namespace}
              onChanged={onFornavnChange}
              required
              value={pdu1Person?.fornavn ?? ''}
            />
          </Column>
          <Column>
            <Input
              error={validation[namespace + '-etternavn']?.feilmelding}
              id='etternavn'
              key={namespace + '-fornavn-' + (pdu1Person?.etternavn ?? '')}
              label={t('label:etternavn') + ' *'}
              namespace={namespace}
              onChanged={onEtternavnChange}
              required
              value={pdu1Person?.etternavn ?? ''}
            />
          </Column>
          <Column>
            <DateInput
              error={validation[namespace + '-foedselsdato']?.feilmelding}
              id='foedselsdato'
              key={namespace + '-foedselsdato-' + (pdu1Person?.foedselsdato ?? '')}
              label={t('label:fødselsdato') + ' *'}
              namespace={namespace}
              onChanged={onFodselsdatoChange}
              required
              value={pdu1Person?.foedselsdato ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='2' />
        <AlignStartRow>
          <Column>
            <RadioPanelGroup
              value={pdu1Person?.kjoenn}
              data-no-border
              data-test-id={namespace + '-kjoenn'}
              error={validation[namespace + '-kjoenn']?.feilmelding}
              id={namespace + '-kjoenn'}
              key={namespace + '-kjoenn-' + (pdu1Person?.kjoenn ?? '')}
              legend={t('label:kjønn') + ' *'}
              name={namespace + '-kjoenn'}
              onChange={onKjoennChange}
            >
              <FlexRadioPanels>
                <RadioPanel value='K'>
                  {t('label:kvinne')}
                </RadioPanel>
                <RadioPanel value='M'>
                  {t('label:mann')}
                </RadioPanel>
                <RadioPanel value='U'>
                  {t('label:ukjent')}
                </RadioPanel>
              </FlexRadioPanels>
            </RadioPanelGroup>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        <AlignStartRow
          className={classNames('slideInFromLeft')}
        >
          <Column>
            <Input
              error={validation[namespace + '-etternavnVedFoedsel']?.feilmelding}
              id='etternavnVedFoedsel'
              label={t('label:etternavn-ved-foedsel')}
              namespace={namespace}
              onChanged={onEtternavnVedFoedselChange}
              value={pdu1Person?.etternavnVedFoedsel}
            />
          </Column>
          <Column />
        </AlignStartRow>
        <VerticalSeparatorDiv size='2' />
        <Heading size='small'>{t('label:pins')}</Heading>
        <VerticalSeparatorDiv />
        <AlignStartRow className='slideInFromLeft'>
          <Column>
            <Input
              error={validation[namespace + '-fnr']?.feilmelding}
              id='fnr'
              key={namespace + '-fnr-' + pdu1Person?.fnr}
              label={t('label:norsk-fnr')}
              namespace={namespace}
              onChanged={onFnrChange}
              value={pdu1Person?.fnr}
            />
          </Column>
          <Column>
            <Button
              className='nolabel'
              variant='secondary'
              disabled={searchingPerson}
              data-amplitude='pdu1.editor.person.fnr.search'
              onClick={onSearchUser}
            >
              <Search />
              <HorizontalSeparatorDiv />
              {searchingPerson
                ? t('message:loading-searching')
                : t('el:button-search-for-x', { x: t('label:person').toLowerCase() })}
              {searchingPerson && <Loader />}
            </Button>
          </Column>
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
              : _.isEmpty(pdu1Person?.fnr)
                ? (
                  <BodyLong>
                    {t('label:norsk-fnr-beskrivelse')}
                  </BodyLong>
                  )
                : <div />}
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </PaddedHorizontallyDiv>
      {_.isEmpty(pdu1Person?.utenlandskePin)
        ? (
          <PaddedDiv>
            <BodyLong>
              {t('message:warning-no-utenlandskepin')}
            </BodyLong>
          </PaddedDiv>
          )
        : pdu1Person?.utenlandskePin?.map(renderRow)}
      <VerticalSeparatorDiv />
      <HorizontalLineSeparator />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <PaddedDiv>
            <Row>
              <Column>
                <Button
                  variant='tertiary'
                  onClick={() => _setSeeNewForm(true)}
                >
                  <Add />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-add-new-x', { x: t('label:utenlandsk-pin').toLowerCase() })}
                </Button>
              </Column>
            </Row>
          </PaddedDiv>
          )}
    </div>
  )
}

export default Person
