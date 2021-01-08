import Select from 'components/Select/Select'
import styled from 'styled-components'
import { animationClose,  animationOpen,  animationLeft, animationRight } from 'nav-hoykontrast'

export const AlignedSelect = styled(Select)`
  margin-bottom: 3rem;
  &.feil {
    margin-bottom: 0rem !important;
  }
`
export const SideBar = styled.div`
  display: flex;
  min-width: 21.5rem;
`
export const HiddenFormContainer = styled.div`
  overflow: hidden;
  &.slideOpen {
    will-change: max-height, height;
    max-height: 10em;
    height: 100%;
    animation: ${animationOpen(10)} 0.3s ease;
  }
  &.slideClose {
    will-change: max-height, height;
    max-height: 0;
    height: 0%;
    animation: ${animationClose(10)} 0.3s ease;
  }
  &.closed {
    height: 0%;
    max-height: 0;
  }
`
export const HiddenSidebar = styled.div`
  min-width: 21.5rem;
  &.slideOpen {
    will-change: margin-left;
    margin-left: 0px;
    animation: ${animationLeft(21.5)} 0.5s ease;
  }
  &.slideClose {
    will-change: margin-left;
    margin-left: 21.5rem;
    animation: ${animationRight(21.5)} 0.5s ease;
  }
  &.closed {
    margin-left: 21.5rem;
  }
`


