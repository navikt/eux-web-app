import { Close, Edit, Email, Search, Send, Star } from '@navikt/ds-icons'
import validator from '@navikt/fnrvalidator'
import * as appActions from 'actions/app'
import { setCurrentEntry } from 'actions/localStorage'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import * as svarsedActions from 'actions/svarsed'
import { getSedStatus, setReplySed } from 'actions/svarsed'
import { resetAllValidation } from 'actions/validation'
import ExternalLink from 'assets/icons/Logout'
import classNames from 'classnames'
import { AlertstripeDiv, Etikett, HiddenFormContainer } from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { ConnectedSed, LocalStorageEntry, Sed } from 'declarations/types'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import AlertStripe from 'nav-frontend-alertstriper'
import { Checkbox } from 'nav-frontend-skjema'
import { Normaltekst, Systemtittel, Undertekst, Undertittel } from 'nav-frontend-typografi'
import {
  AlignStartRow,
  Column,
  FlexDiv,
  FlexEndSpacedDiv,
  FlexStartDiv,
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastLink,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  RadioElementBorder,
  themeKeys,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import { validateSEDSearch } from 'pages/SvarSed/mainValidation'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const ContainerDiv = styled(PileCenterDiv)`
  width: 780px;
  align-items: center;
`
const LeftDiv = styled.div`
  display: flex;
  align-items: center;
`
const FilterDiv = styled(FlexDiv)`
  transition: all 0.3s ease-in-out;
  .selected {
    text-decoration: underline;
    text-decoration: bold;
    color: ${({ theme }) => theme[themeKeys.MAIN_ACTIVE_COLOR]} !important;
  }
`

const SEDPanel = styled(HighContrastPanel)`
  transition: all 0.15s ease-in-out;
  margin-left: 3rem;
  &:hover, .skjemaelement__input:hover {
    color: ${({ theme }: any) => theme[themeKeys.MAIN_FONT_COLOR]} !important;
    background-color: ${({ theme }: any) => theme[themeKeys.MAIN_HOVER_COLOR]} !important;
  }
`

const mapState = (state: State): any => ({
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,
  featureToggles: state.app.featureToggles,
  highContrast: state.ui.highContrast,
  queryingSaksnummerOrFnr: state.loading.queryingSaksnummerOrFnr,
  queryingReplySed: state.loading.queryingReplySed,
  parentSed: state.svarsed.parentSed,
  previousParentSed: state.svarsed.previousParentSed,
  replySed: state.svarsed.replySed,
  rinasaksnummerOrFnrParam: state.app.params.rinasaksnummerOrFnr,
  seds: state.svarsed.seds,
  sedStatus: state.svarsed.sedStatus
})

export interface SvarSedProps {
  changeMode: (mode: string, from: string, callback?: () => void) => void
}

const SEDSearch: React.FC<SvarSedProps> = ({
  changeMode
}: SvarSedProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    alertMessage,
    alertType,
    featureToggles,
    parentSed,
    previousParentSed,
    queryingSaksnummerOrFnr,
    queryingReplySed,
    replySed,
    rinasaksnummerOrFnrParam,
    seds,
    sedStatus
  }: any = useSelector<State, any>(mapState)
  const entries = useSelector<State, Array<LocalStorageEntry<ReplySed>> | null | undefined>(
    (state) => state.localStorage.svarsed.entries)
  const [_allOpen, _setAllOpen] = useState<boolean>(false)
  const [_filter, _setFilter] = useState<string | undefined>(undefined)
  const [_saksnummerOrFnr, _setSaksnummerOrFnr] = useState<string>(rinasaksnummerOrFnrParam ?? '')
  const [_queryType, _setQueryType] = useState<string |undefined>(undefined)
  const [_validMessage, _setValidMessage] = useState<string>('')
  const [_validation, _resetValidation, performValidation] = useValidation({}, validateSEDSearch)
  const [_replySedRequested, setReplySedRequested] = useState<boolean>(false)
  const [_sedStatusRequested, setSedStatusRequested] = useState<string |undefined>(undefined)

  const onSaksnummerOrFnrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    dispatch(appActions.cleanData())
    _resetValidation('sedsearch-saksnummerOrFnr')
    _setSaksnummerOrFnr(query)
    const result = validator.idnr(query)
    if (result.status !== 'valid') {
      _setQueryType('saksnummer')
      _setValidMessage(t('label:saksnummer'))
    } else {
      if (result.type === 'fnr') {
        _setQueryType('fnr')
        _setValidMessage(t('label:valid-fnr'))
      }
      if (result.type === 'dnr') {
        _setQueryType('dnr')
        _setValidMessage(t('label:valid-dnr'))
      }
    }
  }

  const findSavedEntry = (svarsedId: string): LocalStorageEntry<ReplySed> | undefined => (
    _.find(entries, (e: LocalStorageEntry<ReplySed>) => e.id === svarsedId)
  )

  const hasDraft = (connectedSed: ConnectedSed): boolean => {
    if (_.isEmpty(entries)) {
      return false
    }
    return findSavedEntry(connectedSed.svarsedId) !== undefined
  }

  const hasSentStatus = (svarsedId: string): boolean => {
    if (!Object.prototype.hasOwnProperty.call(sedStatus, svarsedId)) {
      return false
    }
    return sedStatus[svarsedId] === 'sent'
  }

  const loadDraft = (sakId: string, svarsedId: string) => {
    setSedStatusRequested(svarsedId)
    dispatch(getSedStatus(sakId, svarsedId))
  }

  const onSaksnummerOrFnrClick = () => {
    const valid: boolean = performValidation({
      saksnummerOrFnr: _saksnummerOrFnr.trim()
    })
    if (valid) {
      standardLogger('svarsed.selection.query', {
        type: _queryType
      })
      dispatch(svarsedActions.querySaksnummerOrFnr(_saksnummerOrFnr.trim()))
    }
  }

  const onParentSedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(svarsedActions.setParentSed(e.target.value))
  }

  const onReplySedClick = (connectedSed: ConnectedSed, saksnummer: string, sakUrl: string) => {
    setReplySedRequested(true)
    dispatch(svarsedActions.queryReplySed(connectedSed, saksnummer, sakUrl))
  }

  useEffect(() => {
    if (!_.isNil(_sedStatusRequested) && Object.prototype.hasOwnProperty.call(sedStatus, _sedStatusRequested)) {
      const entry: LocalStorageEntry<ReplySed> | undefined = findSavedEntry(_sedStatusRequested)
      if (entry && !hasSentStatus(entry.id)) {
        dispatch(setCurrentEntry('svarsed', entry))
        dispatch(setReplySed(entry.content))
        setReplySedRequested(true)
      }
      setSedStatusRequested(undefined)
    }
  }, [_sedStatusRequested, sedStatus])

  useEffect(() => {
    if (replySed && _replySedRequested) {
      setReplySedRequested(false)
      dispatch(resetAllValidation())
      changeMode('B', 'forward')
    }
  }, [replySed])

  useEffect(() => {
    dispatch(startPageStatistic('selection'))
    return () => {
      dispatch(finishPageStatistic('selection'))
    }
  }, [])

  const visibleSeds = seds?.filter((s: Sed) => !(s.sakType.startsWith('U_') && featureToggles['featureSvarsed.u'] === false)) ?? undefined

  const familieytelser: number = _.filter(visibleSeds, (s: Sed) => s.sakType.startsWith('FB_'))?.length ?? 0
  const dagpenger: number = _.filter(visibleSeds, (s: Sed) => s.sakType.startsWith('UB_'))?.length ?? 0
  const horisontal: number = _.filter(visibleSeds, (s: Sed) => s.sakType.startsWith('H_'))?.length ?? 0
  const sykdom: number = _.filter(visibleSeds, (s: Sed) => s.sakType.startsWith('S_'))?.length ?? 0
  const lovvalg: number = _.filter(visibleSeds, (s: Sed) => s.sakType.startsWith('LA_'))?.length ?? 0
  const filteredSeds = _.filter(visibleSeds, (s: Sed) => _filter ? s.sakType.startsWith(_filter) : true)

  return (
    <ContainerDiv>
      <Systemtittel>
        {t('app:page-title-svarsed-search')}
      </Systemtittel>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow
        className={classNames('slideInFromLeft', { feil: _validation.saksnummerOrFnr })}
      >
        <HorizontalSeparatorDiv size='0.2' />
        <Column flex='2'>
          <PileDiv>
            <FlexStartDiv>
              <HighContrastInput
                ariaLabel={t('label:saksnummer-eller-fnr')}
                ariaInvalid={_validation['sedsearch-saksnummerOrFnr']?.feilmelding}
                bredde='xl'
                data-test-id='sedsearch-saksnummerOrFnr'
                feil={_validation['sedsearch-saksnummerOrFnr']?.feilmelding}
                id='sedsearch-saksnummerOrFnr'
                label={t('label:saksnummer-eller-fnr')}
                onChange={onSaksnummerOrFnrChange}
                placeholder={t('el:placeholder-input-default')}
                required
                value={_saksnummerOrFnr}
              />
              <HorizontalSeparatorDiv />
              <div className='nolabel'>
                <HighContrastKnapp
                  ariaLabel={t('el:button-search')}
                  disabled={queryingSaksnummerOrFnr}
                  spinner={queryingSaksnummerOrFnr}
                  onClick={onSaksnummerOrFnrClick}
                >
                  <Search />
                  <HorizontalSeparatorDiv />
                  {queryingSaksnummerOrFnr
                    ? t('message:loading-searching')
                    : t('el:button-search')}
                </HighContrastKnapp>
              </div>
            </FlexStartDiv>
            <VerticalSeparatorDiv size='0.5' />
            <Normaltekst>
              {_validMessage}
            </Normaltekst>
          </PileDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='3' />
      {alertMessage && alertType && [types.SVARSED_SAKSNUMMERORFNR_QUERY_FAILURE].indexOf(alertType) >= 0 && (
        <>
          <AlertstripeDiv>
            <AlertStripe type='advarsel'>
              {alertMessage}
            </AlertStripe>
          </AlertstripeDiv>
          <VerticalSeparatorDiv />
        </>
      )}
      {visibleSeds && (
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <FlexEndSpacedDiv>
            <div>
              <span>{
                t('label:antall-treff-for', {
                  saksnummerOrFnr: _saksnummerOrFnr
                })
              }
              </span>
              <HorizontalSeparatorDiv size='0.3' />
              <span style={{ fontSize: '130%' }}>
                {visibleSeds.length}
              </span>
            </div>
            <div>
              <Checkbox
                checked={_allOpen}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setAllOpen(e.target.checked)}
                label={t('label:utvid-alle')}
              />
            </div>
          </FlexEndSpacedDiv>
          <VerticalSeparatorDiv />
          <FilterDiv>
            <HighContrastFlatknapp
              mini
              kompakt
              data-amplitude='svarsed.selection.filter.alle'
              className={classNames({ selected: _filter === undefined })}
              onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
                buttonLogger(e)
                _setFilter(undefined)
              }}
            >
              {t('label:alle') + ' (' + visibleSeds.length + ')'}
            </HighContrastFlatknapp>
            <HorizontalSeparatorDiv />
            {familieytelser > 0 && (
              <>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  data-amplitude='svarsed.selection.filter.fb'
                  className={classNames({ selected: _filter === 'FB_' })}
                  onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
                    buttonLogger(e)
                    _setFilter('FB_')
                  }}
                >
                  {t('label:familieytelser') + ' (' + familieytelser + ')'}
                </HighContrastFlatknapp>
                <HorizontalSeparatorDiv />
              </>
            )}
            {dagpenger > 0 && (
              <>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  data-amplitude='svarsed.selection.filter.ub'
                  className={classNames({ selected: _filter === 'UB_' })}
                  onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
                    buttonLogger(e)
                    _setFilter('UB_')
                  }}
                >
                  {t('label:dagpenger') + ' (' + dagpenger + ')'}
                </HighContrastFlatknapp>
                <HorizontalSeparatorDiv />
              </>
            )}
            {horisontal > 0 && (
              <>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  data-amplitude='svarsed.selection.filter.h'
                  className={classNames({ selected: _filter === 'H_' })}
                  onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
                    buttonLogger(e)
                    _setFilter('H_')
                  }}
                >
                  {t('label:horisontal') + ' (' + horisontal + ')'}
                </HighContrastFlatknapp>
                <HorizontalSeparatorDiv />
              </>
            )}
            {sykdom > 0 && (
              <>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  data-amplitude='svarsed.selection.filter.s'
                  className={classNames({ selected: _filter === 'S_' })}
                  onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
                    buttonLogger(e)
                    _setFilter('S_')
                  }}
                >
                  {t('label:sykdom') + ' (' + sykdom + ')'}
                </HighContrastFlatknapp>
                <HorizontalSeparatorDiv />
              </>
            )}

            {lovvalg > 0 && (
              <>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  data-amplitude='svarsed.selection.filter.la'
                  className={classNames({ selected: _filter === 'LA_' })}
                  onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
                    buttonLogger(e)
                    _setFilter('LA_')
                  }}
                >
                  {t('label:lovvalg') + ' (' + lovvalg + ')'}
                </HighContrastFlatknapp>
                <HorizontalSeparatorDiv />
              </>
            )}

          </FilterDiv>
          <VerticalSeparatorDiv />
          {filteredSeds.map((sed: Sed) => {
            const sedId = sed.sakId + '-' + sed.sakType
            const alone = filteredSeds?.length === 1
            return (
              <div key={sedId}>
                <RadioElementBorder
                  ariaLabel={sed.sakType + ' - ' + sed.sakTittel}
                  ariaChecked={parentSed === sedId}
                  checked={alone || parentSed === sedId}
                  className='slideInFromLeft'
                  label={(
                    <>
                      <Undertittel>
                        {sed.sakType + ' - ' + sed.sakTittel}
                      </Undertittel>
                      <LeftDiv>
                        <span>
                          {t('label:saksnummer') + ': ' + sed.sakId}
                        </span>
                        <HorizontalSeparatorDiv />
                        <HighContrastLink target='_blank' href={sed.sakUrl}>
                          <span>
                            {t('label:gå-til-rina')}
                          </span>
                          <HorizontalSeparatorDiv size='0.35' />
                          <ExternalLink />
                        </HighContrastLink>
                      </LeftDiv>
                      <FlexDiv>
                        <Normaltekst>
                          {t('label:motpart')}:
                        </Normaltekst>
                        <HorizontalSeparatorDiv size='0.35' />
                        <Normaltekst>
                          {sed?.motpart?.join(', ') ?? '-'}
                        </Normaltekst>
                      </FlexDiv>
                      <VerticalSeparatorDiv size='0.3' />
                      <Etikett>
                        {t('label:siste-oppdatert') + ': ' + sed.sistEndretDato}
                      </Etikett>
                    </>
                  )}
                  name='sedsearch-saksnummerOrFnr-results'
                  onChange={onParentSedChange}
                  value={sedId}
                />
                <VerticalSeparatorDiv />
                {sed.sedListe.map((connectedSed: ConnectedSed) => (
                  <HiddenFormContainer
                    aria-hidden={!(previousParentSed !== sedId && parentSed === sedId)}
                    className={classNames({
                      slideOpen: _allOpen === true ? true : (alone || (previousParentSed !== sedId && parentSed === sedId)),
                      slideClose: _allOpen === true ? false : ((previousParentSed === sedId && parentSed !== sedId)),
                      closed: _allOpen === true ? false : (!alone && !((previousParentSed !== sedId && parentSed === sedId) || (previousParentSed === sedId && parentSed !== sedId)))
                    })}
                    key={sed + '-' + connectedSed.sedId}
                  >
                    <SEDPanel border>
                      <FlexDiv>
                        <PileCenterDiv style={{ alignItems: 'center' }} title={t('')}>
                          {connectedSed.status === 'received' && <Email width='32' height='32' />}
                          {connectedSed.status === 'sent' && <Send width='32' height='32' />}
                          {connectedSed.status === 'new' && <Star width='32' height='32' />}
                          {connectedSed.status === 'active' && <Edit width='32' height='32' />}
                          {connectedSed.status === 'cancelled' && <Close width='32' height='32' />}
                          <VerticalSeparatorDiv size='0.35' />
                          <Undertekst>
                            {t('app:status-received-' + connectedSed.status.toLowerCase())}
                          </Undertekst>
                        </PileCenterDiv>
                        <HorizontalSeparatorDiv />
                        <PileDiv flex={2}>
                          <Undertittel>
                            {connectedSed.sedType} - {connectedSed.sedTittel}
                          </Undertittel>
                          <VerticalSeparatorDiv size='0.5' />
                          <FlexDiv>
                            <HighContrastLink target='_blank' href={sed.sakUrl}>
                              <span>
                                {t('label:rediger-sed-i-rina')}
                              </span>
                              <HorizontalSeparatorDiv size='0.35' />
                              <ExternalLink />
                            </HighContrastLink>
                          </FlexDiv>
                          <VerticalSeparatorDiv size='0.35' />
                          <div>
                            <Etikett>
                              {t('label:siste-oppdatert') + ': ' + connectedSed.sistEndretDato}
                            </Etikett>
                          </div>
                        </PileDiv>
                        <PileDiv>
                          {connectedSed.lenkeHvisForrigeSedMaaJournalfoeres && (
                            <>
                              <HighContrastKnapp
                                mini
                                data-amplitude='svarsed.selection.journalforing'
                                onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
                                  buttonLogger(e, {
                                    type: connectedSed.sedType
                                  })
                                  window.open(connectedSed.lenkeHvisForrigeSedMaaJournalfoeres, 'rina')
                                }}
                              >
                                {t('label:journalforing', {
                                  sedtype: connectedSed.sedType
                                })}
                              </HighContrastKnapp>
                              <VerticalSeparatorDiv size='0.5' />
                            </>
                          )}
                          {hasDraft(connectedSed)
                            ? (
                              <HighContrastKnapp
                                mini
                                kompakt
                                disabled={_sedStatusRequested === connectedSed.svarsedId || hasSentStatus(connectedSed.svarsedId)}
                                spinner={_sedStatusRequested === connectedSed.svarsedId}
                                data-amplitude='svarsed.selection.loaddraft'
                                onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
                                  buttonLogger(e, {
                                    type: connectedSed.svarsedType
                                  })
                                  loadDraft(sed.sakId, connectedSed.svarsedId)
                                }}
                              >
                                <Edit />
                                <HorizontalSeparatorDiv size='0.35' />
                                {_sedStatusRequested === connectedSed.svarsedId
                                  ? t('message:loading-checking-sed-status')
                                  : (hasSentStatus(connectedSed.svarsedId)
                                      ? t('label:sed-already-sent', { sed: connectedSed.svarsedType })
                                      : t('label:gå-til-draft'))}
                              </HighContrastKnapp>
                              )
                            : connectedSed.svarsedType
                              ? (
                                <HighContrastHovedknapp
                                  disabled={queryingReplySed || connectedSed.lenkeHvisForrigeSedMaaJournalfoeres}
                                  spinner={queryingReplySed}
                                  mini
                                  data-amplitude='svarsed.selection.replysed'
                                  title={connectedSed.lenkeHvisForrigeSedMaaJournalfoeres ? t('message:warning-spørre-sed-not-journalført') : ''}
                                  onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
                                    buttonLogger(e, {
                                      type: connectedSed.svarsedType,
                                      parenttype: connectedSed.sedType
                                    })
                                    onReplySedClick(connectedSed, sed.sakId, sed.sakUrl)
                                  }}
                                >
                                  {queryingReplySed
                                    ? t('message:loading-replying')
                                    : t('label:besvar-med', {
                                      sedtype: connectedSed.svarsedType
                                    })}
                                </HighContrastHovedknapp>
                                )
                              : (<div />)}
                        </PileDiv>
                      </FlexDiv>
                    </SEDPanel>
                    <VerticalSeparatorDiv />
                  </HiddenFormContainer>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </ContainerDiv>
  )
}

export default SEDSearch
