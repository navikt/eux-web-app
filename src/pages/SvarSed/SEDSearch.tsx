import { Close, Copy, Edit, Email, ExternalLink, Send, Star } from '@navikt/ds-icons'
import {
  Alert,
  BodyLong,
  Button,
  Checkbox,
  Detail,
  Heading,
  Link,
  Loader,
  Panel,
  Radio,
  RadioGroup,
  Search
} from '@navikt/ds-react'
import validator from '@navikt/fnrvalidator'
import {
  AlignStartRow,
  Column,
  FlexCenterDiv,
  FlexCenterSpacedDiv,
  FlexDiv,
  FlexEndDiv,
  FullWidthDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  RadioPanelGroup,
  RadioPanelBorder,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { cleanData, copyToClipboard } from 'actions/app'
import { setCurrentEntry } from 'actions/localStorage'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import { setCurrentSak, querySaksnummerOrFnr, editSed, replyToSed } from 'actions/svarsed'
import { getSedStatus, setReplySed } from 'actions/svarsed'
import { resetAllValidation } from 'actions/validation'
import classNames from 'classnames'
import { AlertstripeDiv, MyTag } from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry, Sak, Sed } from 'declarations/types'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { validateSEDSearch } from 'pages/SvarSed/mainValidation'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

export const FlexRadioGroup = styled(RadioGroup)`
 .navds-radio-buttons {
   display: flex;
 }
`
export const PileStartDiv = styled(PileDiv)`
 align-items: flex-start;
`
const RadioPanelBorderWithLinks = styled(RadioPanelBorder)`
  .navds-radio__label:before { display: none; } // hiding the checkbox
  .navds-radio__label {
    padding: 1rem !important;
  }
  .navds-radio__content {
     width: 100%;
  }
  .navds-radio__input:checked + .navds-radio__label .navds-link,
  .navds-radio__input:checked + .navds-radio__label .navds-link svg {
     color: var(--navds-color-text-inverse);
  }
`
const SEDPanel = styled(Panel)`
  transition: all 0.15s ease-in-out;
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
  replyingToSed: state.loading.replyingToSed,
  editingSed: state.loading.editingSed,
  replySed: state.svarsed.replySed,
  rinasaksnummerOrFnrParam: state.app.params.rinasaksnummerOrFnr,
  saks: state.svarsed.saks,
  currentSak: state.svarsed.currentSak,
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
    editingSed,
    featureToggles,
    queryingSaksnummerOrFnr,
    replyingToSed,
    replySed,
    rinasaksnummerOrFnrParam,
    saks,
    currentSak,
    sedStatus
  }: any = useSelector<State, any>(mapState)
  const entries = useSelector<State, Array<LocalStorageEntry<ReplySed>> | null | undefined>(
    (state) => state.localStorage.svarsed.entries)
  const [_buttonClickedId, _setButtonClickedId] = useState<string>('')
  const [_filter, _setFilter] = useState<string>('all')
  const [_onlyEditableSaks, _setOnlyEditableSeds] = useState<boolean>(true)
  const [_queryType, _setQueryType] = useState<string |undefined>(undefined)
  const [_replySedRequested, _setReplySedRequested] = useState<boolean>(false)
  const [_saksnummerOrFnr, _setSaksnummerOrFnr] = useState<string>(rinasaksnummerOrFnrParam ?? '')
  const [_sedStatusRequested, _setSedStatusRequested] = useState<string |undefined>(undefined)
  const [_validMessage, _setValidMessage] = useState<string>('')
  const [_validation, _resetValidation, _performValidation] = useValidation({}, validateSEDSearch)

  const namespace = 'sedsearch'

  const onSaksnummerOrFnrChange = (query: string) => {
    dispatch(cleanData())
    dispatch(setCurrentSak(undefined))
    const q: string = query.trim()
    _resetValidation(namespace + '-saksnummerOrFnr')
    _setSaksnummerOrFnr(q)
    const result = validator.idnr(q)
    if (result.status !== 'valid') {
      if (q.match(/^\d+$/)) {
        _setQueryType('saksnummer')
        _setValidMessage(t('label:saksnummer'))
      }
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

  const hasDraft = (connectedSed: Sed): boolean => (
    findSavedEntry(connectedSed.svarsedId) !== undefined
  )

  const hasSentStatus = (svarsedId: string): boolean => {
    if (!Object.prototype.hasOwnProperty.call(sedStatus, svarsedId)) {
      return false
    }
    return sedStatus[svarsedId] === 'sent'
  }

  const loadDraft = (sakId: string, svarsedId: string) => {
    _setSedStatusRequested(svarsedId)
    dispatch(getSedStatus(sakId, svarsedId))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSaksnummerOrFnrClick()
    }
  }

  const onSaksnummerOrFnrClick = () => {
    const valid: boolean = _performValidation({
      saksnummerOrFnr: _saksnummerOrFnr.trim()
    })
    if (valid) {
      standardLogger('svarsed.selection.query', {
        type: _queryType
      })
      dispatch(querySaksnummerOrFnr(_saksnummerOrFnr.trim()))
    }
  }

  const onEditSedClick = (sedId: string, sedType: string, saksnummer: string, status: string) => {
    _setReplySedRequested(true)
    dispatch(editSed(sedId, sedType, saksnummer, status))
  }

  const onReplySedClick = (connectedSed: Sed, saksnummer: string, sakUrl: string) => {
    _setReplySedRequested(true)
    dispatch(replyToSed(connectedSed, saksnummer, sakUrl))
  }

  const canEditSed = (sedType: string) => ['F002', 'H001', 'H002', 'U002', 'U004', 'U017'].indexOf(sedType) >= 0

  const isSedEditable = (connectedSed: Sed) => (
    !!connectedSed.lenkeHvisForrigeSedMaaJournalfoeres ||
    (hasDraft(connectedSed) && !hasSentStatus(connectedSed.svarsedId)) ||
    (connectedSed.status === 'new' && canEditSed(connectedSed.sedType)) ||
    (connectedSed.svarsedType && !connectedSed.lenkeHvisForrigeSedMaaJournalfoeres)
  )

  /** if we have areceived SEDS, and we have searched for saksnummer, add it as the currentSak */
  useEffect(() => {
    if (!_.isNil(_sedStatusRequested) && Object.prototype.hasOwnProperty.call(sedStatus, _sedStatusRequested)) {
      const entry: LocalStorageEntry<ReplySed> | undefined = findSavedEntry(_sedStatusRequested)
      if (entry && !hasSentStatus(entry.id)) {
        dispatch(setCurrentEntry('svarsed', entry))
        dispatch(setReplySed(entry.content))
        _setReplySedRequested(true)
      }
      _setSedStatusRequested(undefined)
    }
  }, [_sedStatusRequested, sedStatus])

  /** if we have a saved entry, let's load it */
  useEffect(() => {
    if (!_.isNil(_sedStatusRequested) && Object.prototype.hasOwnProperty.call(sedStatus, _sedStatusRequested)) {
      const entry: LocalStorageEntry<ReplySed> | undefined = findSavedEntry(_sedStatusRequested)
      if (entry && !hasSentStatus(entry.id)) {
        dispatch(setCurrentEntry('svarsed', entry))
        dispatch(setReplySed(entry.content))
        _setReplySedRequested(true)
      }
      _setSedStatusRequested(undefined)
    }
  }, [_sedStatusRequested, sedStatus])

  /** if we have a reply sed, let's go to edit mode */
  useEffect(() => {
    if (!_.isEmpty(replySed) && _replySedRequested) {
      _setReplySedRequested(false)
      _setButtonClickedId('')
      dispatch(resetAllValidation())
      changeMode('B', 'forward')
    }
  }, [replySed])

  /** if we get seds by searching a saksnummer,set the currentSak */
  useEffect(() => {
    if (_.isUndefined(currentSak) && saks?.length === 1 && _validMessage === t('label:saksnummer')) {
      dispatch(setCurrentSak(saks[0]))
    }
  }, [saks])

  useEffect(() => {
    dispatch(startPageStatistic('selection'))
    return () => {
      dispatch(finishPageStatistic('selection'))
    }
  }, [])

  // filter out U-seds or UB-seds if featureSvarsed.u = false
  const visibleSaks = saks?.filter((s: Sak) => !((s.sakType.startsWith('U_') || s.sakType.startsWith('UB_')) && featureToggles.featureSvarsedU === false)) ?? undefined
  const familieytelser: number = _.filter(visibleSaks, (s: Sak) => s.sakType.startsWith('FB_'))?.length ?? 0
  const dagpenger: number = _.filter(visibleSaks, (s: Sak) => s.sakType.startsWith('UB_'))?.length ?? 0
  const horisontal: number = _.filter(visibleSaks, (s: Sak) => s.sakType.startsWith('H_'))?.length ?? 0
  const sykdom: number = _.filter(visibleSaks, (s: Sak) => s.sakType.startsWith('S_'))?.length ?? 0
  const lovvalg: number = _.filter(visibleSaks, (s: Sak) => s.sakType.startsWith('LA_'))?.length ?? 0
  const filteredSaks = _.filter(visibleSaks, (s: Sak) => _filter !== 'all' ? s.sakType.startsWith(_filter) : true)
  const nrEditableSaks = _.filter(visibleSaks, (s: Sak) => _.find(s.sedListe, isSedEditable) !== undefined)?.length ?? 0

  const setFilter = (props: any) => {
    console.log('setFilter', props)
    _setFilter(props)
  }

  return (
    <PileStartDiv>
      <FullWidthDiv>
        {!currentSak && (
          <>
            <Heading size='medium'>
              {t('app:page-title-svarsed-search')}
            </Heading>
            <VerticalSeparatorDiv size='2' />
            <AlignStartRow
              className={classNames('slideInFromLeft', { error: _validation.saksnummerOrFnr })}
            >
              <HorizontalSeparatorDiv size='0.2' />
              <Column>
                <PileDiv>
                  <FlexEndDiv>
                    <Search
                      label={t('label:saksnummer-eller-fnr')}
                      data-testid={namespace + '-saksnummerOrFnr'}
                      id={namespace + '-saksnummerOrFnr'}
                      onKeyPress={handleKeyPress}
                      onChange={onSaksnummerOrFnrChange}
                      required
                      hideLabel={false}
                      value={_saksnummerOrFnr}
                      disabled={queryingSaksnummerOrFnr}
                      onSearch={onSaksnummerOrFnrClick}
                    >
                      <Search.Button>
                        {queryingSaksnummerOrFnr
                          ? t('message:loading-searching')
                          : t('el:button-search')}
                        {queryingSaksnummerOrFnr && <Loader />}
                      </Search.Button>
                    </Search>
                    <HorizontalSeparatorDiv />
                    <PileDiv>
                      <BodyLong>
                        {_validMessage}
                      </BodyLong>
                      <VerticalSeparatorDiv size='0.5' />
                    </PileDiv>
                  </FlexEndDiv>
                  {_validation[namespace + '-saksnummerOrFnr']?.feilmelding && (
                    <>
                      <VerticalSeparatorDiv size='0.5' />
                      <span className='navds-error-message navds-error-message--medium'>
                        {_validation[namespace + '-saksnummerOrFnr']?.feilmelding}
                      </span>
                    </>
                  )}

                </PileDiv>
              </Column>
              <Column/>
            </AlignStartRow>
            <VerticalSeparatorDiv size='3' />
            {alertMessage && alertType && [types.SVARSED_SAKS_FAILURE].indexOf(alertType) >= 0 && (
              <>
                <AlertstripeDiv>
                  <Alert variant='warning'>
                    {alertMessage}
                  </Alert>
                </AlertstripeDiv>
                <VerticalSeparatorDiv />
              </>
            )}
            {visibleSaks?.length > 0 && (
              <>
                <FlexDiv>
                  <Checkbox
                    checked={_onlyEditableSaks}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setOnlyEditableSeds(e.target.checked)}
                  >
                    {t('label:only-active-seds') + ' (' + nrEditableSaks + ')'}
                  </Checkbox>
                </FlexDiv>
                <VerticalSeparatorDiv />
                <FlexRadioGroup
                  onChange={setFilter}
                  legend=''
                  value={_filter}
                >
                  <Radio value='all'>{t('label:alle') + ' (' + visibleSaks.length + ')'}</Radio>
                  <HorizontalSeparatorDiv size='0.5'/>
                  {familieytelser > 0 && (
                    <>
                    <Radio value='FB_'>{t('label:familieytelser') + ' (' + familieytelser  + ')'}</Radio>
                    <HorizontalSeparatorDiv size='0.5'/>
                    </>
                  )}
                  {dagpenger > 0 && (
                    <>
                      <Radio value='UB_'>{t('label:dagpenger') + ' (' + dagpenger  + ')'}</Radio>
                      <HorizontalSeparatorDiv size='0.5'/>
                    </>
                  )}
                  {horisontal > 0 && (
                    <>
                      <Radio value='H_'>{t('label:horisontal') + ' (' + horisontal  + ')'}</Radio>
                      <HorizontalSeparatorDiv size='0.5'/>
                    </>
                  )}
                  {sykdom > 0 && (
                    <>
                      <Radio value='S_'>{t('label:sykdom') + ' (' + sykdom  + ')'}</Radio>
                      <HorizontalSeparatorDiv size='0.5'/>
                    </>
                  )}
                  {lovvalg > 0 && (
                    <>
                      <Radio value='LA_'>{t('label:lovvalg') + ' (' + lovvalg  + ')'}</Radio>
                      <HorizontalSeparatorDiv size='0.5'/>
                    </>
                  )}
                </FlexRadioGroup>
              </>
            )}
            </>
        )}
        <VerticalSeparatorDiv />
        {!currentSak ? (
          <RadioPanelGroup>
          {filteredSaks.map((sak: Sak) => {
            const sakId = sak.sakId + '-' + sak.sakType
            const editableSaks = _.find(sak?.sedListe, isSedEditable) !== undefined
            if (_onlyEditableSaks && !editableSaks) {
              return <div/>
            }
            return (
              <>
              <RadioPanelBorderWithLinks
                ariaLabel={sak.sakType + ' - ' + sak.sakTittel}
                className='slideInFromLeft'
                name={namespace + '-saksnummerOrFnr-results'}
                onChange={() => {
                  dispatch(setCurrentSak(sak))
                }}
                value={sakId}
              >
                <PileDiv>
                  <Heading size='small'>
                    {sak.sakType + ' - ' + sak.sakTittel}
                  </Heading>
                  <FlexDiv>
                    <BodyLong>
                      {t('label:motpart')}:
                    </BodyLong>
                    <HorizontalSeparatorDiv size='0.35' />
                    <BodyLong>
                      {sak?.motpart?.join(', ') ?? '-'}
                    </BodyLong>
                  </FlexDiv>
                  <VerticalSeparatorDiv size='0.3' />
                  <FlexCenterSpacedDiv style={{width: '100%'}}>
                    <BodyLong>
                      {t('label:siste-oppdatert') + ': ' + sak.sistEndretDato}
                    </BodyLong>
                    <FlexCenterDiv>
                    <span>
                      {t('label:saksnummer') + ': '}
                    </span>
                      <HorizontalSeparatorDiv />
                      <Link target='_blank' href={sak.sakUrl} rel='noreferrer'>
                      <span>
                        {sak.sakId}
                      </span>
                        <HorizontalSeparatorDiv size='0.35' />
                        <ExternalLink />
                      </Link>
                      <HorizontalSeparatorDiv />
                      <Link title={t('label:kopiere')} onClick={(e: any) => {
                        e.preventDefault()
                        e.stopPropagation()
                        dispatch(copyToClipboard(sak.sakId))
                      }}
                      >
                        <Copy />
                      </Link>
                    </FlexCenterDiv>
                  </FlexCenterSpacedDiv>
                </PileDiv>
              </RadioPanelBorderWithLinks>
              <VerticalSeparatorDiv/>
              </>
            )
          })}
          </RadioPanelGroup>
        ) : (
          <RadioPanelGroup>
            {currentSak.sedListe.map((connectedSed: Sed) => (
              <>
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
                        <Link target='_blank' href={currentSak.sakUrl} rel='noreferrer'>
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
                              _setButtonClickedId('draft-' + connectedSed.sedId)
                              loadDraft(currentSak.sakId, connectedSed.svarsedId)
                            }}
                          >
                            <Edit />
                            <HorizontalSeparatorDiv size='0.35' />
                            {(_sedStatusRequested === connectedSed.svarsedId && _buttonClickedId === 'draft-' + connectedSed.sedId)
                              ? (
                                <>
                                  {t('message:loading-checking-sed-status')}
                                  <Loader />
                                </>
                              )
                              : (hasSentStatus(connectedSed.svarsedId)
                                ? t('label:sed-already-sent', { sed: connectedSed.svarsedType })
                                : t('label:gå-til-draft'))}
                          </Button>
                        )
                        : (
                          <>
                            {connectedSed.status === 'new' && canEditSed(connectedSed.sedType) && (
                              <>
                                <Button
                                  variant='secondary'
                                  disabled={editingSed}
                                  data-amplitude='svarsed.selection.editsed'
                                  onClick={(e: any) => {
                                    buttonLogger(e, {
                                      type: connectedSed.sedType
                                    })
                                    _setButtonClickedId('edit-' + connectedSed.sedId)
                                    onEditSedClick(connectedSed.sedId, connectedSed.sedType, currentSak.sakId, connectedSed.status)
                                  }}
                                >
                                  {(editingSed && _buttonClickedId === 'edit-' + connectedSed.sedId)
                                    ? (
                                      <>
                                        {t('message:loading-editing')}
                                        <Loader />
                                      </>
                                    )
                                    : t('label:edit-sed-x', {
                                      x: connectedSed.sedType
                                    })}
                                </Button>
                                <VerticalSeparatorDiv size='0.5' />
                              </>
                            )}
                            {connectedSed.svarsedType && (
                              <Button
                                variant='primary'
                                disabled={replyingToSed || connectedSed.lenkeHvisForrigeSedMaaJournalfoeres}
                                data-amplitude='svarsed.selection.replysed'
                                title={connectedSed.lenkeHvisForrigeSedMaaJournalfoeres ? t('message:warning-spørre-sed-not-journalført') : ''}
                                onClick={(e: any) => {
                                  buttonLogger(e, {
                                    type: connectedSed.svarsedType,
                                    parenttype: connectedSed.sedType
                                  })
                                  _setButtonClickedId('reply-' + connectedSed.sedId)
                                  onReplySedClick(connectedSed, currentSak.sakId, currentSak.sakUrl)
                                }}
                              >
                                {(replyingToSed && _buttonClickedId === 'reply-' + connectedSed.sedId)
                                  ? (
                                    <>
                                      {t('message:loading-replying')}
                                      <Loader />
                                    </>
                                  )
                                  : t('label:besvar-med', {
                                    sedtype: connectedSed.svarsedType
                                  })}
                              </Button>
                            )}
                          </>
                        )}
                    </PileDiv>
                  </FlexDiv>
                </SEDPanel>
                <VerticalSeparatorDiv />
              </>
            ))}
          </RadioPanelGroup>
        )}
      </FullWidthDiv>
    </PileStartDiv>
  )
}

export default SEDSearch
