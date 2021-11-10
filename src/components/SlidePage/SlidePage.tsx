
import { finishPageStatistic, logPageStatistics, startPageStatistic } from 'actions/statistics'

import { setMode } from 'actions/svarpased'
import classNames from 'classnames'
import { FadingLineSeparator } from 'components/StyledComponents'
import TopContainer from 'components/TopContainer/TopContainer'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Container, Content, fadeIn, fadeOut, Margin } from 'nav-hoykontrast'
import PT from 'prop-types'
import React, { MutableRefObject, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
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

export type ChangeModeFunction = (page: string, direction: string, callback?: () => void) => void

export interface SlidePageProps {
  waitForMount?: boolean
  initialPage: string
  initialDirection: string
  changeModeFunc: MutableRefObject<ChangeModeFunction | null>
  divA1: JSX.Element
  divA2: JSX.Element
  divB1: JSX.Element
  divB2: JSX.Element
}

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

export const SlidePage: React.FC<SlidePageProps> = ({
  waitForMount = true,
  initialPage,
  initialDirection,
  changeModeFunc,
  divA1,
  divA2,
  divB1,
  divB2
}: SlidePageProps): JSX.Element => {
  const dispatch = useDispatch()

  const location = useLocation()
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


  const changeMode = (page: string, direction: string, callback?: () => void) => {
    dispatch(setMode(page))
    if (animating) {
      return
    }

    if (page === 'A') {
      if (!direction || direction === 'none') {
        dispatch(startPageStatistic(page))
        setPositionContentA(Slide.LEFT)
        setPositionContentB(Slide.RIGHT)
        setPositionSidebarA(Slide.ALT_LEFT)
        setPositionSidebarB(Slide.ALT_RIGHT)
        if (callback) {
          callback()
        }
      }
      if (direction === 'back') {
        dispatch(logPageStatistics('editor', 'selection'))
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
      setContentA(divA1)
      setSidebarB(divA2)
    }
    if (page === 'B') {
      if (!direction || direction === 'none') {
        dispatch(startPageStatistic('editor'))
        setPositionContentA(Slide.ALT_LEFT)
        setPositionContentB(Slide.ALT_RIGHT)
        setPositionSidebarA(Slide.LEFT)
        setPositionSidebarB(Slide.RIGHT)
        if (callback) {
          callback()
        }
      }
      if (direction === 'forward') {
        dispatch(logPageStatistics('selection', 'editor'))
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
      setContentB(divB1)
      setSidebarA(divB2)
    }
  }

  useEffect(() => {
    changeModeFunc!.current = changeMode
  }, [])

  useEffect(() => {
    if (!_mounted) {
      setContentA(divA1)
      setSidebarB(divA2)
      changeMode(initialPage, initialDirection)
      setMounted(true)
    }
  }, [dispatch, _mounted, WaitingDiv, location.search])

  useEffect(() => {
    dispatch(startPageStatistic('total'))
    return () => {
      dispatch(finishPageStatistic('total'))
    }
  }, [])

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

SlidePage.propTypes = {
  waitForMount: PT.bool
}

export default SlidePage
