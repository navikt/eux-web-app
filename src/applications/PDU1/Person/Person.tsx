import { Search } from '@navikt/ds-icons'
import { BodyLong, Button, Heading, Loader } from '@navikt/ds-react'
import { resetPerson, searchPerson } from 'actions/person'
import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import classNames from 'classnames'
import DateInput from 'components/Forms/DateInput'
import Input from 'components/Forms/Input'
import { Pdu1Person } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { Person as IPerson } from 'declarations/types'
import { Country, CountryFilter } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import {
  AlignStartRow,
  Column,
  FlexCenterDiv,
  FlexRadioPanels,
  HorizontalSeparatorDiv,
  PaddedDiv,
  RadioPanel,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

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

  const onStatsborgerskapChange = (newStatsborgerskap: string) => {
    dispatch(updateReplySed(`${target}.statsborgerskap`, newStatsborgerskap.trim()))
    if (validation[namespace + '-statsborgerskap']) {
      dispatch(resetValidation(namespace +'-statsborgerskap'))
    }
  }

  const onEtternavnVedFoedselChange = (newEtternavnVedFoedsel: string) => {
    dispatch(updateReplySed(`${target}.etternavnVedFoedsel`, newEtternavnVedFoedsel.trim()))
    if (validation[namespace + '-etternavnVedFoedsel']) {
      dispatch(resetValidation(namespace +'-etternavnVedFoedsel'))
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

  return (
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
        className={classNames('slideInFromLeft')}>
        <Column>
          <CountrySelect
            ariaLabel={t('label:nasjonalitet')}
            closeMenuOnSelect
            data-test-id={namespace + '-statsborgerskap'}
             error={validation[namespace + '-statsborgerskap']?.feilmelding}
            flagWave
            label={t('label:statsborgerskap')}
            key={namespace  + '-statsborgerskap' + pdu1Person?.statsborgerskap}
            id={namespace + '-statsborgerskap'}
            includeList={CountryFilter.STANDARD}
            menuPortalTarget={document.body}
            onOptionSelected={(e: Country) => onStatsborgerskapChange(e.value)}
            placeholder={t('el:placeholder-select-default')}
            required
            values={pdu1Person?.statsborgerskap}
          />
        </Column>
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
      </AlignStartRow>
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
      <VerticalSeparatorDiv size='2' />
    </PaddedDiv>
  )
}

export default Person