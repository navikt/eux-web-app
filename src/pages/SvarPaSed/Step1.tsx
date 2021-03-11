import * as appActions from 'actions/app'
import * as svarpasedActions from 'actions/svarpased'
import classNames from 'classnames'
import Flag from 'flagg-ikoner'
import CountryData, { CountryList } from 'land-verktoy'
import { HiddenFormContainer } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { ConnectedSed, Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi'
import NavHighContrast, {
  AlignCenterColumn,
  AlignedRow,
  Column,
  HighContrastHovedknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastLink,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  RadioEl,
  RadioGroup,
  Row, themeKeys,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import ReceivedIcon from 'assets/icons/mailbox-4'
import SentIcon from 'assets/icons/email-send-1'
import ExternalLink from 'assets/icons/line-version-logout'

const SaksnummerOrFnrInput = styled(HighContrastInput)`
  margin-right: 1rem;
`
const FlexDiv = styled.div`
  display: flex;
  align-items: center;
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
  background-color: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  border-radius: 5px;
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
        saksnummerOrFƒnr: {
          feilmelding: t('ui:validation-noSaksnummerOrFnr'),
          skjemaelementId: 'svarpased__saksnummerOrFnr-input'
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
      key.forEach((k) => {
        newValidation[k] = undefined
      })
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
    dispatch(svarpasedActions.queryReplySed(_saksnummerOrFnr, connectedSed, saksnummer))
  }

  useEffect(() => {
    if (replySed && !previousReplySed && mode === '1') {
      setMode('2', 'forward')
    }
  }, [previousReplySed, replySed, mode])

  return (
    <NavHighContrast highContrast={highContrast}>
      <AlignedRow
        className={classNames('slideAnimate', { feil: _validation.saksnummerOrFnr })}
      >
        <Column
          style={{ flex: 2 }}
        >
          <SaksnummerOrFnrInput
            bredde='fullbredde'
            data-test-id='svarpased__saksnummerOrFnr-input'
            feil={_validation.saksnummerOrFnr ? _validation.saksnummerOrFnr.feilmelding : undefined}
            highContrast={highContrast}
            id='svarpased__saksnummerOrFnr-input'
            label={t('ui:label-saksnummerOrFnr')}
            onChange={onSaksnummerOrFnrChange}
            placeholder={t('ui:placeholder-saksnummerOrFnr')}
            value={_saksnummerOrFnr}
          />
        </Column>
        <AlignCenterColumn>
          <HighContrastKnapp
            disabled={queryingSaksnummerOrFnr}
            spinner={queryingSaksnummerOrFnr}
            onClick={onSaksnummerOrFnrClick}
          >
            {queryingSaksnummerOrFnr ? t('ui:loading-searching') : t('ui:label-search')}
          </HighContrastKnapp>
        </AlignCenterColumn>
      </AlignedRow>
      <VerticalSeparatorDiv />
      {seds && (
        <>
          <Row>
            <Column>
              <RadioGroup
                legend={t('ui:label-searchResultsForSaksnummerOrFnr', {
                  antall: Object.keys(seds).length,
                  saksnummerOrFnr: _saksnummerOrFnr
                })}
                feil={undefined}
              >
                {Object.keys(seds)?.map((sed: string) => {
                  const country = countryInstance.findByValue(seds[sed].land)
                  return (
                    <div key={sed}>
                      <RadioEl
                        name='svarpased__saksnummerOrFnr-results'
                        value={sed}
                        checked={parentSed === sed}
                        label={(
                          <>
                            <Undertittel>{sed}</Undertittel>
                            <LeftDiv>
                              <span>{t('ui:label-caseNumber') + ': ' + seds[sed].saksnummer}</span>
                              <HorizontalSeparatorDiv />
                              <HighContrastLink href='#'>
                                <span>{t('ui:label-goToRina')}</span>
                                <HorizontalSeparatorDiv data-size='0.35' />
                                <ExternalLink />
                              </HighContrastLink>
                            </LeftDiv>
                            <FlexDiv style={{ width: '1px' }}>
                              <Normaltekst>
                                {t('ui:label-land')}:
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
                              {t('ui:label-institusjon') + ': ' + seds[sed].institusjon}
                            </Normaltekst>
                            <Etikett>
                              {t('ui:label-lastModified') + ': ' + seds[sed].sisteOppdatert}
                            </Etikett>
                          </>
                        )}
                        className='slideAnimate'
                        onChange={onParentSedChange}
                      />
                      {seds[sed].seds.map((connectedSed: ConnectedSed) => (
                        <HiddenFormContainer
                          key={sed + '-' + connectedSed.replySedType}
                          className={classNames({
                            slideOpen: previousParentSed !== sed && parentSed === sed,
                            slideClose: previousParentSed === sed && parentSed !== sed,
                            closed: !((previousParentSed !== sed && parentSed === sed) || (previousParentSed === sed && parentSed !== sed))
                          })}
                        >
                          <HighContrastPanel style={{ marginLeft: '3rem' }}>
                            <FlexDiv>
                              <PileCenterDiv>
                                {connectedSed.status === 'received' && <ReceivedIcon />}
                                {connectedSed.status === 'sent' && <SentIcon />}
                                <VerticalSeparatorDiv data-size='0.35' />
                                <Undertekst>{t('ui:status-' + connectedSed.status)}</Undertekst>
                              </PileCenterDiv>
                              <HorizontalSeparatorDiv />
                              <PileLeftDiv style={{ flex: 2 }}>
                                <div>
                                  <Undertittel>
                                    {connectedSed.replySedType} - {connectedSed.replySedDisplay}
                                  </Undertittel>
                                  <VerticalSeparatorDiv data-size='0.35' />
                                  <Normaltekst>
                                    {t('ui:label-lastModified') + ': ' + seds[sed].sisteOppdatert}
                                  </Normaltekst>
                                  <VerticalSeparatorDiv data-size='0.35' />
                                  <HighContrastLink href='#'>
                                    <span>{t('ui:label-goToSedInRina')}</span>
                                    <HorizontalSeparatorDiv data-size='0.35' />
                                    <ExternalLink />
                                  </HighContrastLink>
                                </div>
                              </PileLeftDiv>
                              <HorizontalSeparatorDiv />
                              <HighContrastHovedknapp
                                disabled={queryingReplySed}
                                spinner={queryingReplySed}
                                mini
                                kompakt
                                onClick={() => onReplySedClick(connectedSed, seds[sed].saksnummer)}
                              >
                                {queryingReplySed ? t('ui:loading-replying') : t('ui:label-reply')}
                              </HighContrastHovedknapp>
                            </FlexDiv>
                          </HighContrastPanel>
                          <VerticalSeparatorDiv />
                        </HiddenFormContainer>
                      ))}
                    </div>
                  )
                }
                )}
              </RadioGroup>
            </Column>
          </Row>
        </>
      )}
    </NavHighContrast>
  )
}

export default Step1
