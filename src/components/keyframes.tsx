import { keyframes } from 'styled-components'

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`
export const animationOpen = keyframes`
  0% {
    height: 0%;
    max-height: 0;
  }
  100% {
    max-height: 150em;
    height: 100%;
  }
`
export const animationClose = keyframes`
  0% {
    max-height: 150em;
    height: 100%;
  }
  100% {
    max-height: 0;
    height: 0%;
  }
`
