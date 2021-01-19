import * as appActions from 'actions/app'
import * as svarpasedActions from 'actions/svarpased'
import classNames from 'classnames'
import { HiddenFormContainer } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { ConnectedSed, Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst } from 'nav-frontend-typografi'
import NavHighContrast, {
  AlignCenterColumn,
  AlignedRow,
  Column,
  HighContrastHovedknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  RadioEl,
  RadioGroup,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const SaksnummerOrFnrInput = styled(HighContrastInput)`
  margin-right: 1rem;
`
const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const mapState = (state: State): any => ({

  rinasaksnummerOrFnrParam: state.app.params.rinasaksnummerOrFnr,

  queryingSaksnummerOrFnr: state.loading.queryingSaksnummerOrFnr,
  queryingReplySed: state.loading.queryingReplySed,

  previousParentSed: state.svarpased.previousParentSed,
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
    parentSed,
    replySed,
    seds,

    highContrast
  }: any = useSelector<State, any>(mapState)
  const [, setIsFnrValid] = useState<boolean>(false)
  const [_saksnummerOrFnr, setSaksnummerOrFnr] = useState<string | undefined>(rinasaksnummerOrFnrParam)
  const [_validation, setValidation] = useState<Validation>({})

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

  const onReplySedClick = (connectedSed: ConnectedSed) => {
    resetValidation('replysed')
    dispatch(svarpasedActions.queryReplySed(_saksnummerOrFnr, connectedSed))
  }

  useEffect(() => {
    if (replySed && mode === '1') {
      const pin = _.find(replySed.bruker.personInfo.pin, f => f.land === 'NO')
      if (pin) {
        dispatch(svarpasedActions.getPerson(pin.identifikator))
        setMode('2', 'forward')
      }
    }
  }, [replySed, mode])

  return (
    <NavHighContrast highContrast={highContrast}>
      <AlignedRow className={classNames({ feil: _validation.saksnummerOrFnr })}>
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
                {Object.keys(seds)?.map((sed: string) => (
                  <div key={sed}>
                    <RadioEl
                      name='svarpased__saksnummerOrFnr-results'
                      value={sed}
                      checked={parentSed === sed}
                      label={sed}
                      className='slideAnimate'
                      onChange={onParentSedChange}
                    />
                    {seds[sed].map((connectedSed: ConnectedSed) => (
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
                            <div>
                              <Normaltekst>
                                {connectedSed.replySedType} {connectedSed.replySedDisplay}
                              </Normaltekst>
                              <Normaltekst>
                                {connectedSed.querySedDocumentId}
                              </Normaltekst>
                            </div>
                            <HorizontalSeparatorDiv />
                            <HighContrastHovedknapp
                              disabled={queryingReplySed}
                              spinner={queryingReplySed}
                              mini
                              kompakt
                              onClick={() => onReplySedClick(connectedSed)}
                            >
                              {queryingReplySed ? t('ui:loading-replying') : t('ui:label-reply')}
                            </HighContrastHovedknapp>
                          </FlexDiv>
                        </HighContrastPanel>
                        <VerticalSeparatorDiv />
                      </HiddenFormContainer>
                    ))}
                  </div>
                ))}
              </RadioGroup>
            </Column>
          </Row>
        </>
      )}
    </NavHighContrast>
  )
}

export default Step1
