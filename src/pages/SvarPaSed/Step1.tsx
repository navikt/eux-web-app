import validator from '@navikt/fnrvalidator'
import * as appActions from 'actions/app'
import * as svarpasedActions from 'actions/svarpased'
import ReceivedIcon from 'assets/icons/Email'
import FileIcon from 'assets/icons/FileIcon'
import ExternalLink from 'assets/icons/Logout'
import Search from 'assets/icons/Search'
import SentIcon from 'assets/icons/Send'
import classNames from 'classnames'
import {
  AlignStartRow,
  Etikett,
  FlexDiv,
  FlexStartDiv,
  HiddenFormContainer,
  PileCenterDiv,
  PileDiv
} from 'components/StyledComponents'
import useValidation from 'hooks/useValidation'
import { State } from 'declarations/reducers'
import { ConnectedSed, Sed } from 'declarations/types'
import _ from 'lodash'
import { Normaltekst, Systemtittel, Undertekst, Undertittel } from 'nav-frontend-typografi'
import NavHighContrast, {
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
import { validateStep1 } from 'pages/SvarPaSed/validation'
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
    color: ${({ theme }) => theme[themeKeys.MAIN_ACTIVE_COLOR]} !important;
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
  const [_saksnummerOrFnr, _setSaksnummerOrFnr] = useState<string>(rinasaksnummerOrFnrParam ?? '')
  const [_validMessage, _setValidMessage] = useState<string>('')
  const [_validation, _resetValidation, performValidation] = useValidation({}, validateStep1)

  const onSaksnummerOrFnrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    dispatch(appActions.cleanData())
    _resetValidation('step1-saksnummerOrFnr')
    _setSaksnummerOrFnr(query)
    const result = validator.idnr(query)
    if (result.status !== 'valid') {
      _setValidMessage(t('label:saksnummer'))
    } else {
      if (result.type === 'fnr') {
        _setValidMessage(t('label:valid-fnr'))
      }
      if (result.type === 'dnr') {
        _setValidMessage(t('label:valid-dnr'))
      }
    }
  }

  const onSaksnummerOrFnrClick = () => {
    const valid: boolean = performValidation({
      saksnummerOrFnr: _saksnummerOrFnr
    })
    if (valid) {
      dispatch(svarpasedActions.querySaksnummerOrFnr(_saksnummerOrFnr))
    }
  }

  const onParentSedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedSed: string | undefined = e.target.value
    if (selectedSed) {
      dispatch(svarpasedActions.setParentSed(selectedSed))
    }
  }

  const onReplySedClick = (connectedSed: ConnectedSed, saksnummer: string) => {
    dispatch(svarpasedActions.resetReplySed())
    dispatch(svarpasedActions.queryReplySed(_saksnummerOrFnr, connectedSed, saksnummer))
  }

  useEffect(() => {
    if (replySed && !previousReplySed && mode === '1') {
      setMode('2', 'forward')
    }
  }, [previousReplySed, replySed, mode])

  const familieytelser: number = _.filter(seds, (s: Sed) => s.sakType.startsWith('FB_'))?.length ?? 0
  const dagpenger: number = _.filter(seds, (s: Sed) => s.sakType.startsWith('U_'))?.length ?? 0

  return (
    <NavHighContrast highContrast={highContrast}>
      <ContainerDiv>
        <Systemtittel>
          {t('el:title-svarsed')}
        </Systemtittel>
        <VerticalSeparatorDiv data-size='2' />
        <AlignStartRow
          className={classNames('slideInFromLeft', { feil: _validation.saksnummerOrFnr })}
        >
          <HorizontalSeparatorDiv data-size='0.1' />
          <Column data-flex='2'>
            <PileDiv>
              <FlexDiv>
                <HighContrastInput
                  bredde='xl'
                  data-test-id='step1-saksnummerOrFnr'
                  feil={_validation['step1-saksnummerOrFnr']?.feilmelding}
                  highContrast={highContrast}
                  id='step1-saksnummerOrFnr'
                  label={t('label:saksnummer-eller-fnr')}
                  onChange={onSaksnummerOrFnrChange}
                  placeholder={t('el:placeholder-input-default')}
                  value={_saksnummerOrFnr}
                />
                <HorizontalSeparatorDiv />
                <div className='nolabel'>
                  <HighContrastKnapp
                    disabled={queryingSaksnummerOrFnr}
                    spinner={queryingSaksnummerOrFnr}
                    onClick={onSaksnummerOrFnrClick}
                  >
                    <Search />
                    <HorizontalSeparatorDiv />
                    {queryingSaksnummerOrFnr ? t('message:loading-searching') : t('el:button-search')}
                  </HighContrastKnapp>
                </div>
              </FlexDiv>
              <VerticalSeparatorDiv data-size='0.5' />
              <Normaltekst>
                {_validMessage}
              </Normaltekst>
            </PileDiv>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
        {seds && (
          <HighContrastRadioGroup
            legend={(
              <>
                <span>{
                t('label:antall-treff-for', {
                  saksnummerOrFnr: _saksnummerOrFnr
                })
              }
                </span>
                <span style={{ fontSize: '130%' }}>
                  {seds.length}
                </span>
              </>
            )}
          >
            <>
              <FilterDiv>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  className={classNames({ selected: _filter === undefined })}
                  onClick={() => _setFilter(undefined)}
                >
                  {t('label:alle') + ' (' + seds.length + ')'}
                </HighContrastFlatknapp>
                <HorizontalSeparatorDiv />
                {familieytelser > 0 && (
                  <>
                    <HighContrastFlatknapp
                      mini
                      kompakt
                      className={classNames({ selected: _filter === 'FB_' })}
                      onClick={() => _setFilter('FB_')}
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
                      className={classNames({ selected: _filter === 'U_' })}
                      onClick={() => _setFilter('U_')}
                    >
                      {t('label:dagpenger') + ' (' + dagpenger + ')'}
                    </HighContrastFlatknapp>
                    <HorizontalSeparatorDiv />
                  </>
                )}
              </FilterDiv>
              <VerticalSeparatorDiv />
            </>
            {seds
              .filter((s: Sed) => _filter ? s.sakType.startsWith(_filter) : true)
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
                              {t('label:gå-til-rina')}
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
                          {t('label:siste-oppdatert') + ': ' + sed.sistEndretDato}
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
                                {connectedSed.sedType} - {connectedSed.sedTittel}
                              </Undertittel>
                              {connectedSed.svarsedType
                                ? (
                                  <HighContrastHovedknapp
                                    disabled={queryingReplySed}
                                    spinner={queryingReplySed}
                                    mini
                                    onClick={() => onReplySedClick(connectedSed, sed.sakId)}
                                  >
                                    {queryingReplySed
                                      ? t('message:loading-replying')
                                      : t('label:besvar-med', {
                                        sedtype: connectedSed.svarsedType
                                      })}
                                  </HighContrastHovedknapp>
                                  )
                                : (<div />)}
                            </FlexStartDiv>
                            <HighContrastLink href={connectedSed.sedUrl}>
                              <span>
                                {t('label:gå-til-sed-i-rina')}
                              </span>
                              <HorizontalSeparatorDiv data-size='0.35' />
                              <ExternalLink />
                            </HighContrastLink>
                            <VerticalSeparatorDiv data-size='0.35' />
                            <div>
                              <Etikett>
                                {t('label:siste-oppdatert') + ': ' + connectedSed.sistEndretDato}
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
