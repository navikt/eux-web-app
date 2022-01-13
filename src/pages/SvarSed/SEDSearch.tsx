import { Close, Copy, Edit, Email, Search, Send, Star, ExternalLink } from '@navikt/ds-icons'
import { Alert, Loader, Button, Checkbox, Link, Panel, BodyLong, Detail, Heading, SearchField } from '@navikt/ds-react'
import validator from '@navikt/fnrvalidator'
import { cleanData, copyToClipboard } from 'actions/app'
import { setCurrentEntry } from 'actions/localStorage'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import * as svarsedActions from 'actions/svarsed'
import { getSedStatus, setReplySed } from 'actions/svarsed'
import { resetAllValidation } from 'actions/validation'
import classNames from 'classnames'
import { AlertstripeDiv, MyTag, HiddenFormContainer } from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { ConnectedSed, LocalStorageEntry, Sed } from 'declarations/types'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import {
  AlignStartRow,
  Column,
  FlexDiv,
  FlexEndSpacedDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  RadioPanelBorder,
  RadioPanelGroup,
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
    color: var(--navds-color-action-active) !important;
  }
`
const RadioPanelBorderWithLinks = styled(RadioPanelBorder)`
  .navds-radio__input:checked + .navds-radio__label .navds-link,
  .navds-radio__input:checked + .navds-radio__label .navds-link svg {
     color: var(--navds-color-text-inverse);
  }
`
const SEDPanel = styled(Panel)`
  transition: all 0.15s ease-in-out;
  margin-left: 3rem;
  margin-right 0.5rem;
  &:hover {
    color: var(--navds-color-text-primary) !important;
    background-color: var(--navds-semantic-color-interaction-primary-hover-subtle) !important;
  }
`

const mapState = (state: State): any => ({
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  featureToggles: state.app.featureToggles,
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
  const namespace = 'sedsearch'

  const onSaksnummerOrFnrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    dispatch(cleanData())
    _resetValidation(namespace + '-saksnummerOrFnr')
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
    if (!_.isEmpty(replySed) && _replySedRequested) {
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

  // filter out U-seds or UB-seds if featureSvarsed.u = false
  const visibleSeds = seds?.filter((s: Sed) => !((s.sakType.startsWith('U_') || s.sakType.startsWith('UB_')) && featureToggles.featureSvarsedU === false)) ?? undefined
  const familieytelser: number = _.filter(visibleSeds, (s: Sed) => s.sakType.startsWith('FB_'))?.length ?? 0
  const dagpenger: number = _.filter(visibleSeds, (s: Sed) => s.sakType.startsWith('UB_'))?.length ?? 0
  const horisontal: number = _.filter(visibleSeds, (s: Sed) => s.sakType.startsWith('H_'))?.length ?? 0
  const sykdom: number = _.filter(visibleSeds, (s: Sed) => s.sakType.startsWith('S_'))?.length ?? 0
  const lovvalg: number = _.filter(visibleSeds, (s: Sed) => s.sakType.startsWith('LA_'))?.length ?? 0
  const filteredSeds = _.filter(visibleSeds, (s: Sed) => _filter ? s.sakType.startsWith(_filter) : true)

  return (
    <ContainerDiv>
      <Heading size='medium'>
        {t('app:page-title-svarsed-search')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AlignStartRow
        className={classNames('slideInFromLeft', { error: _validation.saksnummerOrFnr })}
      >
        <HorizontalSeparatorDiv size='0.2' />
        <Column flex='2'>
          <PileDiv>
            <SearchField
              label={t('label:saksnummer-eller-fnr')}
              error={_validation[namespace + '-saksnummerOrFnr']?.feilmelding}
            >
              <SearchField.Input
                data-test-id={namespace + '-saksnummerOrFnr'}
                id={namespace + '-saksnummerOrFnr'}
                onChange={onSaksnummerOrFnrChange}
                required
                value={_saksnummerOrFnr}
              />
              <SearchField.Button
                disabled={queryingSaksnummerOrFnr}
                onClick={onSaksnummerOrFnrClick}
              >
                <Search />
                {queryingSaksnummerOrFnr
                  ? t('message:loading-searching')
                  : t('el:button-search')}
                {queryingSaksnummerOrFnr && <Loader />}
              </SearchField.Button>
            </SearchField>
            <VerticalSeparatorDiv size='0.5' />
            <BodyLong>
              {_validMessage}
            </BodyLong>
          </PileDiv>
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv size='3' />
      {alertMessage && alertType && [types.SVARSED_SAKSNUMMERORFNR_QUERY_FAILURE].indexOf(alertType) >= 0 && (
        <>
          <AlertstripeDiv>
            <Alert variant='warning'>
              {alertMessage}
            </Alert>
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
              >
                {t('label:utvid-alle')}
              </Checkbox>
            </div>
          </FlexEndSpacedDiv>
          <VerticalSeparatorDiv />
          <FilterDiv>
            <Button
              variant='tertiary'
              data-amplitude='svarsed.selection.filter.alle'
              className={classNames({ selected: _filter === undefined })}
              onClick={(e: any) => {
                buttonLogger(e)
                _setFilter(undefined)
              }}
            >
              {t('label:alle') + ' (' + visibleSeds.length + ')'}
            </Button>
            <HorizontalSeparatorDiv />
            {familieytelser > 0 && (
              <>
                <Button
                  variant='tertiary'
                  data-amplitude='svarsed.selection.filter.fb'
                  className={classNames({ selected: _filter === 'FB_' })}
                  onClick={(e: any) => {
                    buttonLogger(e)
                    _setFilter('FB_')
                  }}
                >
                  {t('label:familieytelser') + ' (' + familieytelser + ')'}
                </Button>
                <HorizontalSeparatorDiv />
              </>
            )}
            {dagpenger > 0 && (
              <>
                <Button
                  variant='tertiary'
                  data-amplitude='svarsed.selection.filter.ub'
                  className={classNames({ selected: _filter === 'UB_' })}
                  onClick={(e: any) => {
                    buttonLogger(e)
                    _setFilter('UB_')
                  }}
                >
                  {t('label:dagpenger') + ' (' + dagpenger + ')'}
                </Button>
                <HorizontalSeparatorDiv />
              </>
            )}
            {horisontal > 0 && (
              <>
                <Button
                  variant='tertiary'
                  data-amplitude='svarsed.selection.filter.h'
                  className={classNames({ selected: _filter === 'H_' })}
                  onClick={(e: any) => {
                    buttonLogger(e)
                    _setFilter('H_')
                  }}
                >
                  {t('label:horisontal') + ' (' + horisontal + ')'}
                </Button>
                <HorizontalSeparatorDiv />
              </>
            )}
            {sykdom > 0 && (
              <>
                <Button
                  variant='tertiary'
                  data-amplitude='svarsed.selection.filter.s'
                  className={classNames({ selected: _filter === 'S_' })}
                  onClick={(e: any) => {
                    buttonLogger(e)
                    _setFilter('S_')
                  }}
                >
                  {t('label:sykdom') + ' (' + sykdom + ')'}
                </Button>
                <HorizontalSeparatorDiv />
              </>
            )}

            {lovvalg > 0 && (
              <>
                <Button
                  variant='tertiary'
                  data-amplitude='svarsed.selection.filter.la'
                  className={classNames({ selected: _filter === 'LA_' })}
                  onClick={(e: any) => {
                    buttonLogger(e)
                    _setFilter('LA_')
                  }}
                >
                  {t('label:lovvalg') + ' (' + lovvalg + ')'}
                </Button>
                <HorizontalSeparatorDiv />
              </>
            )}

          </FilterDiv>
          <VerticalSeparatorDiv />
          <RadioPanelGroup>
            {filteredSeds.map((sed: Sed) => {
              const sedId = sed.sakId + '-' + sed.sakType
              const alone = filteredSeds?.length === 1
              return (
                <div key={sedId}>
                  <RadioPanelBorderWithLinks
                    ariaLabel={sed.sakType + ' - ' + sed.sakTittel}
                    ariaChecked={parentSed === sedId}
                    checked={alone || parentSed === sedId}
                    className='slideInFromLeft'
                    name={namespace + '-saksnummerOrFnr-results'}
                    onChange={onParentSedChange}
                    value={sedId}
                  >
                    <PileDiv>
                      <Heading size='small'>
                        {sed.sakType + ' - ' + sed.sakTittel}
                      </Heading>
                      <LeftDiv>
                        <span>
                          {t('label:saksnummer') + ': ' + sed.sakId}
                        </span>
                        <HorizontalSeparatorDiv />
                        <Link target='_blank' href={sed.sakUrl} rel='noreferrer'>
                          <span>
                            {t('label:sak-i-rina')}
                          </span>
                          <HorizontalSeparatorDiv size='0.35' />
                          <ExternalLink />
                        </Link>
                        <HorizontalSeparatorDiv />
                        <Link onClick={(e: any) => {
                          e.preventDefault()
                          e.stopPropagation()
                          dispatch(copyToClipboard(sed.sakId))
                        }}
                        >
                          <span>
                            {t('label:kopiere')}
                          </span>
                          <HorizontalSeparatorDiv size='0.35' />
                          <Copy />
                        </Link>
                      </LeftDiv>
                      <FlexDiv>
                        <BodyLong>
                          {t('label:motpart')}:
                        </BodyLong>
                        <HorizontalSeparatorDiv size='0.35' />
                        <BodyLong>
                          {sed?.motpart?.join(', ') ?? '-'}
                        </BodyLong>
                      </FlexDiv>
                      <VerticalSeparatorDiv size='0.3' />
                      <div>
                        <MyTag variant='info'>
                          {t('label:siste-oppdatert') + ': ' + sed.sistEndretDato}
                        </MyTag>
                      </div>
                    </PileDiv>
                  </RadioPanelBorderWithLinks>

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
                            <Detail>
                              {t('app:status-received-' + connectedSed.status.toLowerCase())}
                            </Detail>
                          </PileCenterDiv>
                          <HorizontalSeparatorDiv />
                          <PileDiv flex={2}>
                            <Heading size='small'>
                              {connectedSed.sedType} - {connectedSed.sedTittel}
                            </Heading>
                            <VerticalSeparatorDiv size='0.5' />
                            <FlexDiv>
                              <Link target='_blank' href={sed.sakUrl} rel='noreferrer'>
                                <span>
                                  {t('label:rediger-sed-i-rina')}
                                </span>
                                <HorizontalSeparatorDiv size='0.35' />
                                <ExternalLink />
                              </Link>
                            </FlexDiv>
                            <VerticalSeparatorDiv size='0.35' />
                            <div>
                              <MyTag variant='info'>
                                {t('label:siste-oppdatert') + ': ' + connectedSed.sistEndretDato}
                              </MyTag>
                            </div>
                          </PileDiv>
                          <PileDiv>
                            {connectedSed.lenkeHvisForrigeSedMaaJournalfoeres && (
                              <>
                                <Button
                                  variant='secondary'
                                  data-amplitude='svarsed.selection.journalforing'
                                  onClick={(e: any) => {
                                    buttonLogger(e, {
                                      type: connectedSed.sedType
                                    })
                                    window.open(connectedSed.lenkeHvisForrigeSedMaaJournalfoeres, 'rina')
                                  }}
                                >
                                  {t('label:journalforing', {
                                    sedtype: connectedSed.sedType
                                  })}
                                </Button>
                                <VerticalSeparatorDiv size='0.5' />
                              </>
                            )}
                            {hasDraft(connectedSed)
                              ? (
                                <Button
                                  variant='secondary'
                                  disabled={_sedStatusRequested === connectedSed.svarsedId || hasSentStatus(connectedSed.svarsedId)}
                                  data-amplitude='svarsed.selection.loaddraft'
                                  onClick={(e: any) => {
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
                                  {_sedStatusRequested === connectedSed.svarsedId && <Loader />}
                                </Button>
                                )
                              : connectedSed.svarsedType
                                ? (
                                  <Button
                                    variant='primary'
                                    disabled={queryingReplySed || connectedSed.lenkeHvisForrigeSedMaaJournalfoeres}
                                    data-amplitude='svarsed.selection.replysed'
                                    title={connectedSed.lenkeHvisForrigeSedMaaJournalfoeres ? t('message:warning-spørre-sed-not-journalført') : ''}
                                    onClick={(e: any) => {
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
                                    {queryingReplySed && <Loader />}
                                  </Button>
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
          </RadioPanelGroup>
        </div>
      )}
    </ContainerDiv>
  )
}

export default SEDSearch
