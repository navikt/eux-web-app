import * as appActions from 'actions/app'
import * as svarpasedActions from 'actions/svarpased'
import FileIcon from 'assets/icons/FileIcon'
import ReceivedIcon from 'assets/icons/Email'
import ExternalLink from 'assets/icons/Logout'
import SentIcon from 'assets/icons/Send'
import classNames from 'classnames'
import {
  Etikett,
  FlexDiv,
  FlexStartDiv,
  HiddenFormContainer,
  PileCenterDiv,
  PileDiv
} from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { ConnectedSed, Sed, Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst, Systemtittel, Undertekst, Undertittel } from 'nav-frontend-typografi'
import NavHighContrast, {
  AlignCenterColumn,
  AlignedRow,
  Column,
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastLink,
  HighContrastPanel,
  HighContrastRadioGroup,
  HorizontalSeparatorDiv,
  RadioElementBorder,
  themeKeys,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const ContainerDiv = styled.div`
  max-width: 1000px;
`
const LeftDiv = styled.div`
  display: flex;
  align-items: center;
`
const FilterDiv = styled(FlexDiv)`
 .selected {
    text-decoration: underline;
    text-decoration: bold;
    color: ${({theme}) => theme[themeKeys.MAIN_ACTIVE_COLOR]} !important;
 }
`

const mapState = (state: State): any => ({
  rinasaksnummerOrFnrParam: state.app.params.rinasaksnummerOrFnr,

  queryingSaksnummerOrFnr: state.loading.queryingSaksnummerOrFnr,
  queryingReplySed: state.loading.queryingReplySed,

  previousParentSed: state.svarpased.previousParentSed,
  previousReplySed: state.svarpased.previousReplySed,
  parentSed: state.svarpased.parentSed,
  seds: state.svarpased.seds,
  replySed: state.svarpased.replySed,

  highContrast: state.ui.highContrast
})

export interface SvarPaSedProps {
  mode: string | undefined
  setMode: (mode: string, from: string, callback?: () => void) => void
}

const Step1: React.FC<SvarPaSedProps> = ({
  mode, setMode
}: SvarPaSedProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    rinasaksnummerOrFnrParam,

    queryingSaksnummerOrFnr,
    queryingReplySed,

    previousParentSed,
    previousReplySed,
    parentSed,
    replySed,
    seds,

    highContrast
  }: any = useSelector<State, any>(mapState)
  const [_filter, _setFilter] = useState<string | undefined>(undefined)
  const [_saksnummerOrFnr, _setSaksnummerOrFnr] = useState<string | undefined>(rinasaksnummerOrFnrParam)
  const [_validation, setValidation] = useState<Validation>({})

  const onSaksnummerOrFnrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.cleanData())
    _setSaksnummerOrFnr(e.target.value)
    resetValidation('saksnummerOrFnr')
  }

  const onSaksnummerOrFnrClick = () => {
    if (!_saksnummerOrFnr) {
      setValidation({
        ..._validation,
        saksnummerOrFnr: {
          feilmelding: t('message:validation-noSaksnummerOrFnr'),
          skjemaelementId: 'c-step1-saksnummerOrFnr-text'
        } as FeiloppsummeringFeil
      })
    } else {
      dispatch(svarpasedActions.querySaksnummerOrFnr(_saksnummerOrFnr))
    }
  }

  const resetValidation = (key?: Array<string> | string): void => {
    const newValidation = _.cloneDeep(_validation)
    if (!key) {
      setValidation({})
    }
    if (_.isString(key)) {
      newValidation[key] = undefined
    }
    if (_.isArray(key)) {
      key.forEach((k) => (newValidation[k] = undefined))
    }
    setValidation(newValidation)
  }

  const onParentSedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedSed: string | undefined = e.target.value
    if (selectedSed) {
      dispatch(svarpasedActions.setParentSed(selectedSed))
    }
  }

  const onReplySedClick = (connectedSed: ConnectedSed, saksnummer: string) => {
    resetValidation('replysed')
    dispatch(svarpasedActions.resetReplySed())
    dispatch(svarpasedActions.queryReplySed(_saksnummerOrFnr, connectedSed, saksnummer))
  }

  useEffect(() => {
    if (replySed && !previousReplySed && mode === '1') {
      setMode('2', 'forward')
    }
  }, [previousReplySed, replySed, mode])

  return (
    <NavHighContrast highContrast={highContrast}>
      <ContainerDiv>
        <Systemtittel>
          {t('el:title-svarsed')}
        </Systemtittel>
        <VerticalSeparatorDiv data-size='2' />
        <AlignedRow
          className={classNames('slideInFromLeft', { feil: _validation.saksnummerOrFnr })}
        >
          <HorizontalSeparatorDiv data-size='0.1' />
          <Column data-flex='2'>
            <HighContrastInput
              bredde='fullbredde'
              data-test-id='c-step1-saksnummerOrFnr-text'
              feil={_validation.saksnummerOrFnr?.feilmelding}
              highContrast={highContrast}
              id='c-step1-saksnummerOrFnr-text'
              label={t('label:saksnummer-or-fnr')}
              onChange={onSaksnummerOrFnrChange}
              placeholder={t('el:placeholder-input-default')}
              value={_saksnummerOrFnr}
            />
          </Column>
          <HorizontalSeparatorDiv />
          <AlignCenterColumn>
            <HighContrastKnapp
              disabled={queryingSaksnummerOrFnr}
              spinner={queryingSaksnummerOrFnr}
              onClick={onSaksnummerOrFnrClick}
            >
              {queryingSaksnummerOrFnr ? t('message:loading-searching') : t('el:button-search')}
            </HighContrastKnapp>
          </AlignCenterColumn>
        </AlignedRow>
        <VerticalSeparatorDiv />
        {seds && (
          <HighContrastRadioGroup
            legend={t('label:searchResultsForSaksnummerOrFnr', {
              antall: seds.length,
              saksnummerOrFnr: _saksnummerOrFnr
            })}
          >
          <>
            <FilterDiv>
              <HighContrastFlatknapp
                mini
                kompakt
                className={classNames({selected: _filter === undefined})}
                onClick={() => _setFilter(undefined)}
              >
                {t('label:all') + ' (' +seds.length + ')'}
              </HighContrastFlatknapp>
              <HorizontalSeparatorDiv/>
              <HighContrastFlatknapp
                mini
                kompakt
                className={classNames({selected: _filter === 'FB_'})}
                onClick={() => _setFilter('FB_')}
              >
                {t('label:family-benefits') + ' (' +_.filter(seds, (s: Sed) => s.sakType.startsWith('FB_')).length + ')'}
              </HighContrastFlatknapp>
              <HorizontalSeparatorDiv/>
            </FilterDiv>
          <VerticalSeparatorDiv/>
          </>
            {seds
              .filter((s: Sed) => _filter ? s.sakType.startsWith(_filter): true)
              .map((sed: Sed) => (
                <div key={sed.sakType}>
                  <RadioElementBorder
                    name='svarpased__saksnummerOrFnr-results'
                    value={sed.sakType}
                    checked={parentSed === sed.sakType}
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
                          <HighContrastLink href={sed.sakUrl}>
                            <span>
                              {t('label:goToRina')}
                            </span>
                            <HorizontalSeparatorDiv data-size='0.35' />
                            <ExternalLink />
                          </HighContrastLink>
                        </LeftDiv>
                        <FlexDiv>
                          <Normaltekst>
                            {t('label:motpart')}:
                          </Normaltekst>
                          <HorizontalSeparatorDiv data-size='0.35' />
                          <Normaltekst>
                            {sed.motpart.join(', ')}
                          </Normaltekst>
                        </FlexDiv>
                        <VerticalSeparatorDiv data-size='0.3' />
                        <Etikett>
                          {t('label:lastModified') + ': ' + sed.sistEndretDato}
                        </Etikett>
                      </>
                  )}
                    className='slideInFromLeft'
                    onChange={onParentSedChange}
                  />
                  {sed.sedListe.map((connectedSed: ConnectedSed) => (
                    <HiddenFormContainer
                      key={sed + '-' + connectedSed.sedId}
                      className={classNames({
                        slideOpen: previousParentSed !== sed.sakType && parentSed === sed.sakType,
                        slideClose: previousParentSed === sed.sakType && parentSed !== sed.sakType,
                        closed: !((previousParentSed !== sed.sakType && parentSed === sed.sakType) || (previousParentSed === sed.sakType && parentSed !== sed.sakType))
                      })}
                    >
                      <HighContrastPanel style={{ marginLeft: '3rem' }}>
                        <FlexDiv>
                          <PileCenterDiv>
                            {connectedSed.status === 'received' && <ReceivedIcon />}
                            {connectedSed.status === 'sent' && <SentIcon />}
                            {connectedSed.status === 'new' && <FileIcon />}
                            <VerticalSeparatorDiv data-size='0.35' />
                            <Undertekst>
                              {t('app:status-received-' + connectedSed.status)}
                            </Undertekst>
                          </PileCenterDiv>
                          <HorizontalSeparatorDiv />
                          <PileDiv style={{ flex: 2 }}>
                            <FlexStartDiv>
                              <Undertittel>
                                {connectedSed.svarsedType} - {connectedSed.svarsedDisplay}
                              </Undertittel>
                              <HighContrastHovedknapp
                                disabled={queryingReplySed}
                                spinner={queryingReplySed}
                                mini
                                onClick={() => onReplySedClick(connectedSed, sed.sakId)}
                              >
                                {queryingReplySed ? t('message:loading-replying') : t('label:reply')}
                              </HighContrastHovedknapp>
                            </FlexStartDiv>
                            <HighContrastLink href={connectedSed.sedUrl}>
                              <span>
                                {t('label:goToSedInRina')}
                              </span>
                              <HorizontalSeparatorDiv data-size='0.35' />
                              <ExternalLink />
                            </HighContrastLink>
                            <VerticalSeparatorDiv data-size='0.35' />
                            <div>
                              <Etikett>
                                {t('label:lastModified') + ': ' + connectedSed.sistEndretDato}
                              </Etikett>
                            </div>
                          </PileDiv>
                        </FlexDiv>
                      </HighContrastPanel>
                      <VerticalSeparatorDiv />
                    </HiddenFormContainer>
                  ))}
                </div>
              ))}
          </HighContrastRadioGroup>
        )}
      </ContainerDiv>
    </NavHighContrast>
  )
}

export default Step1
