import { Checkbox, Heading, Radio, RadioGroup } from '@navikt/ds-react'
import {
  AlignStartRow,
  Column,
  Container,
  Content,
  FlexDiv,
  FullWidthDiv,
  HorizontalSeparatorDiv, Margin,
  PileDiv,
  RadioPanelGroup,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { appReset, copyToClipboard } from 'actions/app'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import { querySaks, setCurrentSak } from 'actions/svarsed'
import SakPanel from 'applications/SvarSed/Sak/SakPanel'
import { isSedEditable } from 'applications/SvarSed/Sak/utils'
import SEDQuery from 'applications/SvarSed/SEDQuery/SEDQuery'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { Sak, Sed } from 'declarations/types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'

export const FlexRadioGroup = styled(RadioGroup)`
 .navds-radio-buttons {
   display: flex;
 }
`
export const PileStartDiv = styled(PileDiv)`
 align-items: flex-start;
`
export const MyRadioPanelGroup = styled(RadioPanelGroup)`
  .navds-radio-buttons {
    margin-top: 0rem !important;
  }
`

const mapState = (state: State): any => ({
  entries: state.localStorage.svarsed.entries,
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  featureToggles: state.app.featureToggles,
  queryingSaks: state.loading.queryingSaks,
  rinasaksnummerOrFnrParam: state.app.params.rinasaksnummerOrFnr,
  deletedSak: state.svarsed.deletedSak,
  saks: state.svarsed.saks,
  sedStatus: state.svarsed.sedStatus
})

const SEDSearch = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const {
    entries,
    alertMessage,
    alertType,
    deletedSak,
    featureToggles,
    queryingSaks,
    rinasaksnummerOrFnrParam,
    saks,
    sedStatus
  }: any = useAppSelector(mapState)

  const params: URLSearchParams = new URLSearchParams(window.location.search)
  const navigate = useNavigate()
  const [_filter, _setFilter] = useState<string>('all')
  const [_onlyEditableSaks, _setOnlyEditableSeds] = useState<boolean>(true)
  const [_query, _setQuery] = useState<string | null>(params.get('q'))
  const [_queryType, _setQueryType] = useState<string | undefined>(undefined)

  const namespace = 'sedsearch'

  useEffect(() => {
    if (_query && !_.isNil(deletedSak)) {
      // if we are deleting a sak, and query was saksnummer, then we are deleting the same sak, nothing to query
      // but if we are querying fnr/dnr, we have to query again so we can have a sak list without the deleted sak
      if (_queryType !== 'saksnummer') {
        dispatch(querySaks(_query!, 'new'))
      }
    }
  }, [deletedSak])

  /** if we get 1 sed by querying a saksnummer, then set it as currentSak */
  useEffect(() => {
    if (saks?.length === 1 && _queryType === 'saksnummer') {
      dispatch(setCurrentSak(saks[0]))
      navigate({
        pathname: '/svarsed/view/sak/' + saks[0].sakId,
        search: _query ? '?q=' + _query : ''
      })
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

  return (
    <Container>
      <Margin />
      <Content style={{minWidth: '800px'}}>
        <PileStartDiv>
          <FullWidthDiv>
            <Heading size='medium'>
              {t('app:page-title-svarsed-search')}
            </Heading>
            <SEDQuery
              parentNamespace={namespace}
              initialQuery={_query ?? rinasaksnummerOrFnrParam}
              onQueryChanged={(queryType: string) => {
                dispatch(appReset())
                _setQueryType(queryType)
              }}
              onQuerySubmit={(q: string) => {
                _setQuery(q)
                dispatch(querySaks(q, 'new'))
              }}
              querying={queryingSaks}
              error={!!alertMessage && alertType && [types.SVARSED_SAKS_FAILURE].indexOf(alertType) >= 0 ? alertMessage : undefined}
            />
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
                  onChange={_setFilter}
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
            {queryingSaks
              ? (<WaitingPanel />)
              : (
                <AlignStartRow>
                  <Column flex='2'>
                    <MyRadioPanelGroup>
                      {filteredSaks?.map((sak: Sak) => (
                        _onlyEditableSaks &&
                        _.find(sak?.sedListe, (sed: Sed) => isSedEditable(sed, entries, sedStatus)) === undefined
                          ? <div />
                          : (
                            <div key={'sak-' + sak?.sakId}>
                              <SakPanel
                                sak={sak}
                                onSelected={() => {
                                  dispatch(setCurrentSak(sak))
                                  navigate({
                                    pathname: '/svarsed/view/sak/' + sak.sakId,
                                    search: _query ? '?q=' + _query : ''
                                  })
                                }}
                                onCopy={() => dispatch(copyToClipboard(sak.sakId))}
                              />
                              <VerticalSeparatorDiv />
                            </div>
                            )
                      ))}
                    </MyRadioPanelGroup>
                  </Column>
                </AlignStartRow>
                )}
          </FullWidthDiv>
        </PileStartDiv>
      </Content>
      <Margin />
    </Container>
  )
}

export default SEDSearch
