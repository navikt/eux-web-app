import { Alert, BodyLong, Checkbox, Heading, Loader, Radio, RadioGroup, Search } from '@navikt/ds-react'
import validator from '@navikt/fnrvalidator'
import {
  AlignStartRow,
  Column,
  FlexDiv,
  FlexEndDiv,
  FullWidthDiv,
  HorizontalSeparatorDiv,
  PileDiv,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { cleanData, copyToClipboard } from 'actions/app'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import { querySaksnummerOrFnr, setCurrentSak } from 'actions/svarsed'
import SakPanel from 'applications/SvarSed/Sak/SakPanel'
import SEDPanel from 'applications/SvarSed/Sak/SEDPanel'
import classNames from 'classnames'
import { AlertstripeDiv } from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { Sak, Sed } from 'declarations/types'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { validateSEDSearch } from 'pages/SvarSed/mainValidation'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { isSedEditable } from 'applications/SvarSed/Sak/utils'

export const FlexRadioGroup = styled(RadioGroup)`
 .navds-radio-buttons {
   display: flex;
 }
`
export const PileStartDiv = styled(PileDiv)`
 align-items: flex-start;
`

const mapState = (state: State): any => ({
  entries: state.localStorage.svarsed.entries,
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  featureToggles: state.app.featureToggles,
  queryingSaksnummerOrFnr: state.loading.queryingSaksnummerOrFnr,
  rinasaksnummerOrFnrParam: state.app.params.rinasaksnummerOrFnr,
  saks: state.svarsed.saks,
  sedStatus: state.svarsed.sedStatus,
  currentSak: state.svarsed.currentSak
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
    entries,
    alertMessage,
    alertType,
    featureToggles,
    queryingSaksnummerOrFnr,
    rinasaksnummerOrFnrParam,
    saks,
    sedStatus,
    currentSak
  }: any = useSelector<State, any>(mapState)

  const [_filter, _setFilter] = useState<string>('all')
  const [_onlyEditableSaks, _setOnlyEditableSeds] = useState<boolean>(true)
  const [_queryType, _setQueryType] = useState<string |undefined>(undefined)
  const [_saksnummerOrFnr, _setSaksnummerOrFnr] = useState<string>(rinasaksnummerOrFnrParam ?? '')
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
  const nrEditableSaks = _.filter(visibleSaks, (s: Sak) => _.find(s.sedListe, (sed: Sed) => isSedEditable(sed, entries, sedStatus)) !== undefined)?.length ?? 0

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
              <Column flex='2'>
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
              <Column />
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
                <FlexRadioGroup
                  onChange={setFilter}
                  legend=''
                  value={_filter}
                >
                  <Radio value='all'>{t('label:alle') + ' (' + visibleSaks.length + ')'}</Radio>
                  <HorizontalSeparatorDiv size='0.5' />
                  {familieytelser > 0 && (
                    <>
                      <Radio value='FB_'>{t('label:familieytelser') + ' (' + familieytelser + ')'}</Radio>
                      <HorizontalSeparatorDiv size='0.5' />
                    </>
                  )}
                  {dagpenger > 0 && (
                    <>
                      <Radio value='UB_'>{t('label:dagpenger') + ' (' + dagpenger + ')'}</Radio>
                      <HorizontalSeparatorDiv size='0.5' />
                    </>
                  )}
                  {horisontal > 0 && (
                    <>
                      <Radio value='H_'>{t('label:horisontal') + ' (' + horisontal + ')'}</Radio>
                      <HorizontalSeparatorDiv size='0.5' />
                    </>
                  )}
                  {sykdom > 0 && (
                    <>
                      <Radio value='S_'>{t('label:sykdom') + ' (' + sykdom + ')'}</Radio>
                      <HorizontalSeparatorDiv size='0.5' />
                    </>
                  )}
                  {lovvalg > 0 && (
                    <>
                      <Radio value='LA_'>{t('label:lovvalg') + ' (' + lovvalg + ')'}</Radio>
                      <HorizontalSeparatorDiv size='0.5' />
                    </>
                  )}
                </FlexRadioGroup>
              </>
            )}
          </>
        )}
        <VerticalSeparatorDiv />
        <RadioPanelGroup>
          {!currentSak
            ? filteredSaks.map((sak: Sak) => (
              _onlyEditableSaks && _.find(sak?.sedListe, (sed: Sed) => isSedEditable(sed, entries, sedStatus)) === undefined
              ? <div />
              : (
                  <div key={'sak-' + sak.sakId}>
                    <SakPanel
                      sak={sak}
                      onSelected={() => dispatch(setCurrentSak(sak))}
                      onCopy={() => dispatch(copyToClipboard(sak.sakId))}
                    />
                    <VerticalSeparatorDiv />
                  </div>
                )))
            : currentSak.sedListe.map((connectedSed: Sed) => (
              <div key={'sed-' + connectedSed.sedId}>
                <SEDPanel
                  currentSak={currentSak}
                  changeMode={changeMode}
                  connectedSed={connectedSed}
                />
                <VerticalSeparatorDiv />
              </div>
            ))}
        </RadioPanelGroup>
      </FullWidthDiv>
    </PileStartDiv>
  )
}

export default SEDSearch
