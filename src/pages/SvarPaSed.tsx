import { setStatusParam } from 'actions/app'
import * as svarpasedActions from 'actions/svarpased'
import classNames from 'classnames'
import { fadeIn, fadeOut } from 'components/keyframes'
import { Container, Content, Margin, VerticalSeparatorDiv } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

const SaksnummerOrFnrInput = styled(HighContrastInput)`
  margin-right: 1rem;
`
const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  width: 50%;
`
const mapState = (state: State): any => ({
  alertStatus: state.alert.clientErrorStatus,
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,

  familierelasjonKodeverk: state.app.familierelasjoner,

  gettingPerson: state.loading.gettingPerson,
  queryingSaksnummerOrFnr: state.loading.queryingSaksnummerOrFnr,
  queryingSvarSed: state.loading.queryingSvarSed,
  sendingSvarPaSed: state.loading.sendingSvarPaSed,

  arbeidsforholdList: state.svarpased.arbeidsforholdList,
  inntekter: state.svarpased.inntekter,
  person: state.svarpased.person,
  personRelatert: state.svarpased.personRelatert,
  previousSpørreSed: state.svarpased.previousSpørreSed,
  spørreSed: state.svarpased.spørreSed,
  svarSed: state.svarpased.svarSed,
  svarPaSedOversikt: state.svarpased.svarPaSedOversikt,
  svarPasedData: state.svarpased.svarPasedData,
  valgteFamilieRelasjoner: state.svarpased.familierelasjoner,
  valgteArbeidsforhold: state.svarpased.valgteArbeidsforhold,
  valgtSvarSed: state.svarpased.valgtSvarSed,

  highContrast: state.ui.highContrast
})

export interface SvarPaSedProps {
  location: any
}

const SvarPaSed: React.FC<SvarPaSedProps> = ({
  location
}: SvarPaSedProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [, setIsFnrValid] = useState<boolean>(false)
  const [_addFormal, setAddFormal] = useState<boolean>(false)
  const [_newFormal, setNewFormal] = useState<string>('')
  const [_formal, setFormal] = useState<Array<string>>([])
  const [_mounted, setMounted] = useState<boolean>(false)
  const [_saksnummerOrFnr, setSaksnummerOrFnr] = useState<string | undefined>(undefined)
  const [_validation, setValidation] = useState<Validation>({})
  const {
    alertStatus,
    alertMessage,
    alertType,

    familierelasjonKodeverk,

    gettingPerson,
    queryingSaksnummerOrFnr,
    queryingSvarSed,
    sendingSvarPaSed,
=======
>>>>>>> Using slider for SvarPaSed

import Step1 from './SvarPaSed/Step1'
import Step2 from './SvarPaSed/Step2'

const transition = 1000
const timeout = 1001
const zoomOutTransition = 100

const AnimatableDiv = styled.div`
  flex: 1;
  background: inherit;
  &.animate {
    will-change: transform, opacity;
    pointer-events: none;
    * {
      pointer-events: none;
    }
    transition: transform ${transition}ms ease-in-out;
  }
  &.left {
    transform: translateX(0%);
  }
  &.right {
    transform: translateX(20%);
  }
  &.alt_left {
    transform: translateX(-120%);
  }
  &.alt_right {
    transform: translateX(-100%);
  }
  &.A_going_to_left {
    transform: translateX(-120%);
    animation: ${fadeOut} ${transition}ms forwards;
  }
  &.A_going_to_right {
    animation: ${fadeIn} ${transition}ms forwards;
    transform: translateX(0%);
  }
  &.B_going_to_left {
    animation: ${fadeIn} ${transition}ms forwards;
    transform: translateX(-100%);
  }
  &.B_going_to_right {
    animation: ${fadeOut} ${transition}ms forwards;
    transform: translateX(20%);
  }
`
export const ContainerDiv = styled.div`
  width: 100%;
  display: block;
  overflow: hidden;
  will-change: transform;
  &.shrink {
    transform: scale(0.98);
    transform-origin: center center;
    transition: transform ${zoomOutTransition}ms ease-in;
  }
  &:not(.shrink) {
    transform: scale(1);
    transform-origin: center center;
    transition: transform ${zoomOutTransition}ms ease-out;
  }
`
const WaitingPanelDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`
export const WindowDiv = styled.div`
  width: 200%;
  display: flex;
  overflow: hidden;
`

export interface SvarPaSedPageProps {
  allowFullScreen?: boolean
  onFullFocus?: () => void
  onRestoreFocus?: () => void
  waitForMount?: boolean
  location: any
  setMode: (mode: string, from: string, callback?: () => void) => void
}

export type Mode = '1'| '2'

export enum Slide {
  LEFT,
  RIGHT,
  ALT_LEFT,
  ALT_RIGHT,
  A_GOING_TO_LEFT,
  A_GOING_TO_RIGHT,
  B_GOING_TO_LEFT,
  B_GOING_TO_RIGHT
}

export const SvarPaSedPage: React.FC<SvarPaSedPageProps> = ({
  location,
  waitForMount = true
}: SvarPaSedPageProps): JSX.Element => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [_mounted, setMounted] = useState<boolean>(!waitForMount)
  const [positionA, setPositionA] = useState<Slide>(Slide.LEFT)
  const [positionB, setPositionB] = useState<Slide>(Slide.RIGHT)
  const [contentA, setContentA] = useState<any>(null)
  const [contentB, setContentB] = useState<any>(null)
  const [animating, setAnimating] = useState<boolean>(false)

  const WaitingDiv = (
    <WaitingPanelDiv>
      <WaitingPanel />
    </WaitingPanelDiv>
  )

  const _setMode = useCallback((newMode: string, from: string, callback?: () => void) => {
    if (animating) {
      return
    }
    if (newMode === '1') {
      if (!from || from === 'none') {
        setPositionA(Slide.LEFT)
        setPositionB(Slide.RIGHT)
        if (callback) {
          callback()
        }
      }
      if (from === 'back') {
        setPositionA(Slide.A_GOING_TO_RIGHT)
        setPositionB(Slide.B_GOING_TO_RIGHT)
        setAnimating(true)
        setTimeout(() => {
          console.log('Timeout end')
          setPositionA(Slide.LEFT)
          setPositionB(Slide.RIGHT)
          setAnimating(false)
          if (callback) {
            callback()
          }
        }, timeout)
      }
      setContentA(<Step1 mode={newMode} setMode={_setMode} />)
    }
    if (newMode === '2') {
      if (!from || from === 'none') {
        setPositionA(Slide.ALT_LEFT)
        setPositionB(Slide.ALT_RIGHT)
        if (callback) {
          callback()
        }
      }
      if (from === 'forward') {
        setPositionA(Slide.A_GOING_TO_LEFT)
        setPositionB(Slide.B_GOING_TO_LEFT)
        setAnimating(true)
        setTimeout(() => {
          console.log('Timeout end')
          setPositionA(Slide.ALT_LEFT)
          setPositionB(Slide.ALT_RIGHT)
          setAnimating(false)
          if (callback) {
            callback()
          }
        }, timeout)
      }
      setContentB(<Step2 mode={newMode} setMode={_setMode} />)
    }
  }, [animating, dispatch])//, allowFullScreen, onFullFocus, onRestoreFocus])

  useEffect(() => {
    if (!_mounted) {
      const params: URLSearchParams = new URLSearchParams(location.search)
      const rinasaksnummerParam: string | null = params.get('rinasaksnummer')

      const fnrParam : string | null = params.get('fnr')
      if (rinasaksnummerParam || fnrParam) {
        setStatusParam('rinasaksnummerOrFnr', rinasaksnummerParam || fnrParam || undefined)
        dispatch(svarpasedActions.querySaksnummerOrFnr(rinasaksnummerParam || fnrParam || undefined))
      }

      setContentA(<Step1 mode='1' setMode={_setMode} />)
      _setMode('1', 'none')
      setMounted(true)
    }
  }, [dispatch, _mounted, _setMode, WaitingDiv, location.search])


  if (!_mounted) {
    return WaitingDiv
  }

  const cls = (position: Slide) => ({
    animate: ![Slide.LEFT, Slide.RIGHT, Slide.ALT_LEFT, Slide.ALT_RIGHT].includes(position),
    A_going_to_left: Slide.A_GOING_TO_LEFT === position,
    A_going_to_right: Slide.A_GOING_TO_RIGHT === position,
    B_going_to_left: Slide.B_GOING_TO_LEFT === position,
    B_going_to_right: Slide.B_GOING_TO_RIGHT === position,
    alt_left: Slide.ALT_LEFT === position,
    alt_right: Slide.ALT_RIGHT === position,
    right: Slide.RIGHT === position,
    left: Slide.LEFT === position
  })

  return (
    <TopContainer>
      <Container>
        <Margin />
        <Content>
          <Systemtittel>
            {t('ui:title-svarpased')}
          </Systemtittel>
          <VerticalSeparatorDiv data-size='2' />
          <div>
            <VerticalSeparatorDiv />
            <ContainerDiv className={classNames({ shrink: animating })}>
              <WindowDiv>
                <AnimatableDiv
                  key='animatableDivA'
                  className={classNames(cls(positionA))}
                >
                  {contentA}
                </AnimatableDiv>
                <AnimatableDiv
                  key='animatableDivB'
                  className={classNames(cls(positionB))}
                >
                  {contentB}
                </AnimatableDiv>
              </WindowDiv>
            </ContainerDiv>
          </div>
        </Content>
        <Margin />
      </Container>
    </TopContainer>
  )
}

SvarPaSedPage.propTypes = {
  allowFullScreen: PT.bool.isRequired,
  onFullFocus: PT.func.isRequired,
  onRestoreFocus: PT.func.isRequired,
  waitForMount: PT.bool
}

export default SvarPaSedPage
