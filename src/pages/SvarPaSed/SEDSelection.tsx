import validator from '@navikt/fnrvalidator'
import * as appActions from 'actions/app'
import * as svarpasedActions from 'actions/svarpased'
import ReceivedIcon from 'assets/icons/Email'
import FileIcon from 'assets/icons/FileIcon'
import ExternalLink from 'assets/icons/Logout'
import Search from 'assets/icons/Search'
import SentIcon from 'assets/icons/Send'
import classNames from 'classnames'
import { Etikett, HiddenFormContainer } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { ConnectedSed, Sed } from 'declarations/types'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { Normaltekst, Systemtittel, Undertekst, Undertittel } from 'nav-frontend-typografi'
import NavHighContrast, {
  AlignStartRow,
  Column,
  FlexDiv,
  FlexStartSpacedDiv,
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastLink,
  HighContrastPanel,
  HighContrastRadioGroup,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  RadioElementBorder,
  themeKeys,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import { validateSEDSelection } from 'pages/SvarPaSed/validation'
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
    background-color: ${({ theme }: any) => theme[themeKeys.ALTERNATIVE_HOVER_COLOR]} !important;
    border-color: ${({ theme }: any) => theme[themeKeys.MAIN_HOVER_COLOR]} !important;
  }
`

const mapState = (state: State): any => ({
  highContrast: state.ui.highContrast,
  queryingSaksnummerOrFnr: state.loading.queryingSaksnummerOrFnr,
  queryingReplySed: state.loading.queryingReplySed,
  parentSed: state.svarpased.parentSed,
  previousParentSed: state.svarpased.previousParentSed,
  previousReplySed: state.svarpased.previousReplySed,
  replySed: state.svarpased.replySed,
  rinasaksnummerOrFnrParam: state.app.params.rinasaksnummerOrFnr,
  seds: state.svarpased.seds
})

export interface SvarPaSedProps {
  mode: string | undefined
  setMode: (mode: string, from: string, callback?: () => void) => void
}

const SEDSelection: React.FC<SvarPaSedProps> = ({
  mode, setMode
}: SvarPaSedProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    highContrast,
    parentSed,
    previousParentSed,
    previousReplySed,
    queryingSaksnummerOrFnr,
    queryingReplySed,
    replySed,
    rinasaksnummerOrFnrParam,
    seds
  }: any = useSelector<State, any>(mapState)
  const [_filter, _setFilter] = useState<string | undefined>(undefined)
  const [_saksnummerOrFnr, _setSaksnummerOrFnr] = useState<string>(rinasaksnummerOrFnrParam ?? '')
  const [_validMessage, _setValidMessage] = useState<string>('')
  const [_validation, _resetValidation, performValidation] = useValidation({}, validateSEDSelection)

  const onSaksnummerOrFnrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    dispatch(appActions.cleanData())
    _resetValidation('sedselection-saksnummerOrFnr')
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
    dispatch(svarpasedActions.setParentSed(e.target.value))
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
  const horisontal: number = _.filter(seds, (s: Sed) => s.sakType.startsWith('H_'))?.length ?? 0

  return (
    <NavHighContrast highContrast={highContrast}>
      <ContainerDiv>
        <Systemtittel>
          {t('label:svarsed')}
        </Systemtittel>
        <VerticalSeparatorDiv size='2' />
        <AlignStartRow
          className={classNames('slideInFromLeft', { feil: _validation.saksnummerOrFnr })}
        >
          <HorizontalSeparatorDiv size='0.2' />
          <Column flex='2'>
            <PileDiv>
              <FlexDiv>
                <HighContrastInput
                  ariaLabel={t('label:saksnummer-eller-fnr')}
                  ariaInvalid={_validation['sedselection-saksnummerOrFnr']?.feilmelding}
                  bredde='xl'
                  data-test-id='sedselection-saksnummerOrFnr'
                  feil={_validation['sedselection-saksnummerOrFnr']?.feilmelding}
                  id='sedselection-saksnummerOrFnr'
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
              </FlexDiv>
              <VerticalSeparatorDiv size='0.5' />
              <Normaltekst>
                {_validMessage}
              </Normaltekst>
            </PileDiv>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv size='3' />
        {seds && (
          <HighContrastRadioGroup
            style={{ marginLeft: '0.1rem', marginRight: '0.1rem' }}
            legend={(
              <>
                <span>{
                t('label:antall-treff-for', {
                  saksnummerOrFnr: _saksnummerOrFnr
                })
              }
                </span>
                <HorizontalSeparatorDiv size='0.3' />
                <span style={{ fontSize: '130%' }}>
                  {seds.length}
                </span>
              </>
            )}
          >
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
              {horisontal > 0 && (
                <>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    className={classNames({ selected: _filter === 'H_' })}
                    onClick={() => _setFilter('H_')}
                  >
                    {t('label:horisontal') + ' (' + horisontal + ')'}
                  </HighContrastFlatknapp>
                  <HorizontalSeparatorDiv />
                </>
              )}
            </FilterDiv>
            <VerticalSeparatorDiv />
            {seds
              .filter((s: Sed) => _filter ? s.sakType.startsWith(_filter) : true)
              .map((sed: Sed) => (
                <div key={sed.sakType}>
                  <RadioElementBorder
                    ariaLabel={sed.sakType + ' - ' + sed.sakTittel}
                    ariaChecked={parentSed === sed.sakType}
                    checked={parentSed === sed.sakType}
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
                          <HighContrastLink href={sed.sakUrl}>
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
                            {sed.motpart.join(', ')}
                          </Normaltekst>
                        </FlexDiv>
                        <VerticalSeparatorDiv size='0.3' />
                        <Etikett>
                          {t('label:siste-oppdatert') + ': ' + sed.sistEndretDato}
                        </Etikett>
                      </>
                  )}
                    name='sedselection-saksnummerOrFnr-results'
                    onChange={onParentSedChange}
                    value={sed.sakType}
                  />
                  {sed.sedListe.map((connectedSed: ConnectedSed) => (
                    <HiddenFormContainer
                      aria-hidden={!(previousParentSed !== sed.sakType && parentSed === sed.sakType)}
                      className={classNames({
                        slideOpen: previousParentSed !== sed.sakType && parentSed === sed.sakType,
                        slideClose: previousParentSed === sed.sakType && parentSed !== sed.sakType,
                        closed: !((previousParentSed !== sed.sakType && parentSed === sed.sakType) || (previousParentSed === sed.sakType && parentSed !== sed.sakType))
                      })}
                      key={sed + '-' + connectedSed.sedId}
                    >
                      <SEDPanel>
                        <FlexDiv>
                          <PileCenterDiv>
                            {connectedSed.status === 'received' && <ReceivedIcon />}
                            {connectedSed.status === 'sent' && <SentIcon />}
                            {connectedSed.status === 'new' && <FileIcon />}
                            <VerticalSeparatorDiv size='0.35' />
                            <Undertekst>
                              {t('app:status-received-' + connectedSed.status)}
                            </Undertekst>
                          </PileCenterDiv>
                          <HorizontalSeparatorDiv />
                          <PileDiv flex={2}>
                            <FlexStartSpacedDiv flex={1}>
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
                            </FlexStartSpacedDiv>
                            <FlexDiv>
                              <HighContrastLink href={connectedSed.sedUrl}>
                                <span>
                                  {t('label:gå-til-sed-i-rina')}
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
                        </FlexDiv>
                      </SEDPanel>
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

export default SEDSelection