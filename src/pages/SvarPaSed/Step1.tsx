import * as appActions from 'actions/app'
import * as svarpasedActions from 'actions/svarpased'
import SentIcon from 'assets/icons/Send'
import ExternalLink from 'assets/icons/Logout'
import ReceivedIcon from 'assets/icons/Email'
import classNames from 'classnames'
import { HiddenFormContainer } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { ConnectedSed, Sed, SvarSed, Validation } from 'declarations/types'
import Flag from 'flagg-ikoner'
import CountryData, { CountryList } from 'land-verktoy'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst, Systemtittel, Undertekst, Undertittel } from 'nav-frontend-typografi'
import NavHighContrast, {
  AlignCenterColumn,
  AlignedRow,
  Column,
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
const FlexDiv = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`
const LeftDiv = styled.div`
  display: flex;
  align-items: center;
`
const PileCenterDiv = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
`
const PileLeftDiv = styled.div`
  flex-direction: column;
  display: flex;
`
const Etikett = styled.div`
  padding: 0.35rem;
  color:  ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]} !important;
  background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme[themeKeys.MAIN_BORDER_COLOR]};
  display: inline-block;
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
  const [, setIsFnrValid] = useState<boolean>(false)
  const [_saksnummerOrFnr, setSaksnummerOrFnr] = useState<string | undefined>(rinasaksnummerOrFnrParam)
  const [_validation, setValidation] = useState<Validation>({})

  const countryInstance: CountryList = CountryData.getCountryInstance('nb')

  const onSaksnummerOrFnrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.cleanData())
    setSaksnummerOrFnr(e.target.value)
    setIsFnrValid(false)
    resetValidation('saksnummerOrFnr')
  }

  const onSaksnummerOrFnrClick = () => {
    if (!_saksnummerOrFnr) {
      setValidation({
        ..._validation,
        saksnummerOrFnr: {
          feilmelding: t('message:validation-noSaksnummerOrFnr'),
          skjemaelementId: 'svarpased__saksnummerOrFnr-text'
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

  const onReplySedClick = (svarSed: SvarSed, saksnummer: string) => {
    resetValidation('replysed')
    dispatch(svarpasedActions.queryReplySed(_saksnummerOrFnr, svarSed, saksnummer))
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
          {t('el:title-svarSed')}
        </Systemtittel>
        <VerticalSeparatorDiv data-size='2' />
        <AlignedRow
          className={classNames('slideInFromLeft', { feil: _validation.saksnummerOrFnr })}
        >
          <HorizontalSeparatorDiv data-size='0.1' />
          <Column data-flex='2'>
            <HighContrastInput
              bredde='fullbredde'
              data-test-id='svarpased__saksnummerOrFnr-text'
              feil={_validation.saksnummerOrFnr ? _validation.saksnummerOrFnr.feilmelding : undefined}
              highContrast={highContrast}
              id='svarpased__saksnummerOrFnr-text'
              label={t('label:saksnummerOrFnr')}
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
            {seds.map((sed: Sed) => {
              const country = countryInstance.findByValue(sed.motpartLand)
              return (
                <div key={sed.type + '-' + sed.description}>
                  <RadioElementBorder
                    name='svarpased__saksnummerOrFnr-results'
                    value={sed.type}
                    checked={parentSed === sed.type}
                    label={(
                      <>
                        <Undertittel>
                          {sed.type + ' - ' + sed.description}
                        </Undertittel>
                        <LeftDiv>
                          <span>
                            {t('label:saksnummer') + ': ' + sed.sakId}
                          </span>
                          <HorizontalSeparatorDiv />
                          <HighContrastLink href={sed.urlSak}>
                            <span>
                              {t('label:goToRina')}
                            </span>
                            <HorizontalSeparatorDiv data-size='0.35' />
                            <ExternalLink />
                          </HighContrastLink>
                        </LeftDiv>
                        <FlexDiv style={{ width: '1px' }}>
                          <Normaltekst>
                            {t('label:land')}:
                          </Normaltekst>
                          <HorizontalSeparatorDiv data-size='0.35' />
                          <Flag
                            size='XS'
                            type='circle'
                            label={country?.label || ''}
                            country={country?.value || ''}
                          />
                          <HorizontalSeparatorDiv data-size='0.35' />
                          <Normaltekst>
                            {country?.label}
                          </Normaltekst>
                        </FlexDiv>
                        <Normaltekst>
                          {t('label:institusjon') + ': ' + sed.motpartInstitusjon}
                        </Normaltekst>
                        <VerticalSeparatorDiv data-size='0.3' />
                        <Etikett>
                          {t('label:lastModified') + ': ' + sed.sistEndretDato}
                        </Etikett>
                      </>
                  )}
                    className='slideInFromLeft'
                    onChange={onParentSedChange}
                  />
                  {sed.sed.map((connectedSed: ConnectedSed) => (
                    <HiddenFormContainer
                      key={sed + '-' + connectedSed.sedId}
                      className={classNames({
                        slideOpen: previousParentSed !== sed.type && parentSed === sed.type,
                        slideClose: previousParentSed === sed.type && parentSed !== sed.type,
                        closed: !((previousParentSed !== sed.type && parentSed === sed.type) || (previousParentSed === sed.type && parentSed !== sed.type))
                      })}
                    >
                      <HighContrastPanel style={{ marginLeft: '3rem' }}>
                        <FlexDiv>
                          <PileCenterDiv>
                            {connectedSed.erInnkommende === 'ja' && <ReceivedIcon />}
                            {connectedSed.erInnkommende === 'nei' && <SentIcon />}
                            <VerticalSeparatorDiv data-size='0.35' />
                            <Undertekst>
                              {t('app:status-received-' + connectedSed.erInnkommende)}
                            </Undertekst>
                          </PileCenterDiv>
                          <HorizontalSeparatorDiv />
                          <PileLeftDiv style={{ flex: 2 }}>
                            {connectedSed.svarSed.map((s: SvarSed) => (
                              <FlexDiv>
                                <Undertittel>
                                  {s.svarSedType} - {s.svarSedDisplay}
                                </Undertittel>
                                <HighContrastHovedknapp
                                  disabled={queryingReplySed}
                                  spinner={queryingReplySed}
                                  mini
                                  onClick={() => onReplySedClick(s, sed.sakId)}
                                >
                                  {queryingReplySed ? t('message:loading-replying') : t('label:reply')}
                                </HighContrastHovedknapp>
                              </FlexDiv>
                            ))}
                            <Normaltekst>
                              {t('label:lastModified') + ': ' + connectedSed.sistEndretDato}
                            </Normaltekst>
                            <VerticalSeparatorDiv data-size='0.35' />
                            <HighContrastLink href={connectedSed.urlSed}>
                              <span>
                                {t('label:goToSedInRina')}
                              </span>
                              <HorizontalSeparatorDiv data-size='0.35' />
                              <ExternalLink />
                            </HighContrastLink>
                          </PileLeftDiv>

                        </FlexDiv>
                      </HighContrastPanel>
                      <VerticalSeparatorDiv />
                    </HiddenFormContainer>
                  ))}
                </div>
              )
            }
            )}
          </HighContrastRadioGroup>
        )}
      </ContainerDiv>
    </NavHighContrast>
  )
}

export default Step1
