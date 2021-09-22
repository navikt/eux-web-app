import Select from 'components/Forms/Select'
import styled from 'styled-components'
import {
  themeKeys,
  animationClose,
  animationOpen,
  fadeIn,
  fadeOut,
  HighContrastPanel
} from 'nav-hoykontrast'

export const AlignedSelect = styled(Select)`
  margin-bottom: 3rem;
  &.feil {
    margin-bottom: 0rem !important;
  }
`
export const FadingLineSeparator = styled.div`
   border-left-width: 1px;
   border-left-style: solid;
   border-image: linear-gradient(
    to bottom,
     ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]} 0%,
     ${({ theme }) => theme[themeKeys.MAIN_BORDER_COLOR]} 5%,
     ${({ theme }) => theme[themeKeys.MAIN_BORDER_COLOR]} 95%,
     ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]} 100%
    ) 1 100%;
   opacity: 0;
   &.fadeIn {
     opacity: 0;
     animation: ${fadeIn} 1s forwards;
   }
   &.fadeOut {
     opacity: 1;
     animation: ${fadeOut} 1s forwards;
   }
`
export const HorizontalLineSeparator = styled.div`
  height: 1px;
  background: linear-gradient(90deg,
    ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]} 0%,
    ${({ theme }) => theme[themeKeys.MAIN_BORDER_COLOR]} 5%,
    ${({ theme }) => theme[themeKeys.MAIN_BORDER_COLOR]} 95%,
    ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]} 100%
  );
  width: 100%;
`
export const SideBarDiv = styled.div`
  display: flex;
  flex: 0 0 21.5rem;
  padding-top: 4rem;
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
export const TextAreaDiv = styled.div`
  textarea {
    width: 100%;
  }
`
export const Etikett = styled.div`
  padding: 0.25rem 0.5rem;
  margin-left: -0.15rem;
  color:  ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]} !important;
  background-color: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  border: ${(props: any) => props['data-border'] === true ? '1px solid ' + props.theme[themeKeys.MAIN_BORDER_COLOR] : 'none'};
  border-radius: 5px;
  display: inline-block;
`
export const FlexEtikett = styled(Etikett)`
  padding: 0.5rem;
  display: flex;
`

export const WithErrorPanel = styled(HighContrastPanel)`
  padding: 0rem;
  background-color: transparent;
  &.feil {
    border-color: ${({ theme }) => theme[themeKeys.MAIN_ERROR_COLOR]};
    border-width: 3px;
    .left, .right {
       border: none;
    }
  }
  &:not(.feil) {
    border: none;
  }
`
export const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  min-width: 50%;
`

export const Dd = styled.dd`
  width: 60%;
  padding-bottom: 0.35rem;
  padding-top: 0.35rem;
  margin-bottom: 0;
  margin-inline-start: 0;
`
export const Dt = styled.dt`
  width: 40%;
  padding-bottom: 0.35rem;
  padding-top: 0.35rem;
  overflow: hidden;
  text-overflow: ellipsis;
  .typo-element {
    margin-left: 0.5rem;
  }
`
export const Dl = styled.dl`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .odd {
    background-color: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  }
`
