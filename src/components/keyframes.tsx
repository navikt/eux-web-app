import { keyframes } from 'styled-components'

export const fadeIn = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 1; }
`
export const fadeOut = keyframes`
  0% { opacity: 1; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`
export const animationOpen = keyframes`
  0% {
    height: 0%;
    max-height: 0;
  }
  100% {
    max-height: 10em;
    height: 100%;
  }
`
export const animationClose = keyframes`
  0% {
    max-height: 10em;
    height: 100%;
  }
  100% {
    max-height: 0;
    height: 0%;
  }
`
