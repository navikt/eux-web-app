import { setStatusParam } from 'actions/app'
import * as svarpasedActions from 'actions/svarpased'
import { setReplySed } from 'actions/svarpased'
import SEDDetails from 'applications/SvarSed/SEDDetails/SEDDetails'
import SEDLoadSave from 'applications/SvarSed/SEDLoadSave/SEDLoadSave'
import classNames from 'classnames'
import { FadingLineSeparator, SideBarDiv } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { ReplySed } from 'declarations/sed'
import { Container, Content, fadeIn, fadeOut, Margin } from 'nav-hoykontrast'
import SEDEditor from 'pages/SvarPaSed/SEDEditor'
import SEDSelection from 'pages/SvarPaSed/SEDSelection'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

const transition = 500
const timeout = 501

const AnimatableDiv = styled.div`
  flex: 1;
  background: inherit;
    will-change: transform;
  &.animate {
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
  perspective: 1000px;
`
export const ContentDiv = styled(Content)`
  flex: 1;
  max-width: 60vw;
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
  const [_mounted, setMounted] = useState<boolean>(!waitForMount)
  const [positionContentA, setPositionContentA] = useState<Slide>(Slide.LEFT)
  const [positionContentB, setPositionContentB] = useState<Slide>(Slide.RIGHT)
  const [positionSidebarA, setPositionSidebarA] = useState<Slide>(Slide.RIGHT)
  const [positionSidebarB, setPositionSidebarB] = useState<Slide>(Slide.LEFT)
  const [contentA, setContentA] = useState<any>(null)
  const [contentB, setContentB] = useState<any>(null)
  const [sidebarA, setSidebarA] = useState<any>(null)
  const [sidebarB, setSidebarB] = useState<any>(null)
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
        setPositionContentA(Slide.LEFT)
        setPositionContentB(Slide.RIGHT)
        setPositionSidebarA(Slide.ALT_LEFT)
        setPositionSidebarB(Slide.ALT_RIGHT)
        if (callback) {
          callback()
        }
      }
      if (from === 'back') {
        setPositionContentA(Slide.A_GOING_TO_RIGHT)
        setPositionContentB(Slide.B_GOING_TO_RIGHT)
        setPositionSidebarA(Slide.A_GOING_TO_LEFT)
        setPositionSidebarB(Slide.B_GOING_TO_LEFT)
        setAnimating(true)
        setTimeout(() => {
          console.log('Timeout end')
          setPositionContentA(Slide.LEFT)
          setPositionContentB(Slide.RIGHT)
          setPositionSidebarA(Slide.ALT_LEFT)
          setPositionSidebarB(Slide.ALT_RIGHT)
          setAnimating(false)
          if (callback) {
            callback()
          }
        }, timeout)
      }
      setContentA(<SEDSelection mode={newMode} setMode={_setMode} />)
      setSidebarB(
        <SideBarDiv>
          <SEDLoadSave
            storageKey='replysed'
            onLoad={(replySed: ReplySed) => {
              dispatch(setReplySed(replySed))
              _setMode('2', 'forward')
            }}
          />
        </SideBarDiv>
      )
    }
    if (newMode === '2') {
      if (!from || from === 'none') {
        setPositionContentA(Slide.ALT_LEFT)
        setPositionContentB(Slide.ALT_RIGHT)
        setPositionSidebarA(Slide.LEFT)
        setPositionSidebarB(Slide.RIGHT)
        if (callback) {
          callback()
        }
      }
      if (from === 'forward') {
        setPositionContentA(Slide.A_GOING_TO_LEFT)
        setPositionContentB(Slide.B_GOING_TO_LEFT)
        setPositionSidebarA(Slide.A_GOING_TO_RIGHT)
        setPositionSidebarB(Slide.B_GOING_TO_RIGHT)
        setAnimating(true)
        setTimeout(() => {
          console.log('Timeout end')
          setPositionContentA(Slide.ALT_LEFT)
          setPositionContentB(Slide.ALT_RIGHT)
          setPositionSidebarA(Slide.LEFT)
          setPositionSidebarB(Slide.RIGHT)
          setAnimating(false)
          if (callback) {
            callback()
          }
        }, timeout)
      }
      setContentB(<SEDEditor mode={newMode} setMode={_setMode} />)
      setSidebarA(
        <SideBarDiv>
          <SEDDetails />
        </SideBarDiv>
      )
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

      setContentA(<SEDSelection mode='1' setMode={_setMode} />)
      setSidebarB(
        <SideBarDiv>
          <SEDLoadSave
            storageKey='replysed'
            onLoad={(replySed: ReplySed) => {
              dispatch(setReplySed(replySed))
              _setMode('2', 'forward')
            }}
          />
        </SideBarDiv>
      )
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
        <Content style={{ flex: 3, maxWidth: '1100px' }}>
          <ContainerDiv>
            <WindowDiv>
              <AnimatableDiv
                key='animatableDivA'
                className={classNames(cls(positionContentA))}
              >
                {contentA}
              </AnimatableDiv>
              <AnimatableDiv
                key='animatableDivB'
                className={classNames(cls(positionContentB))}
              >
                {contentB}
              </AnimatableDiv>
            </WindowDiv>
          </ContainerDiv>
        </Content>
        <FadingLineSeparator className='fadeIn'>
          &nbsp;
        </FadingLineSeparator>
        <Content style={{ width: '23.5rem' }}>
          <ContainerDiv>
            <WindowDiv>
              <AnimatableDiv
                key='animatableDivA'
                className={classNames(cls(positionSidebarA))}
              >
                {sidebarA}
              </AnimatableDiv>
              <AnimatableDiv
                key='animatableDivB'
                className={classNames(cls(positionSidebarB))}
              >
                {sidebarB}
              </AnimatableDiv>
            </WindowDiv>
          </ContainerDiv>
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
