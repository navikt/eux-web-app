import Select from 'components/Select/Select'
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper'
import Lenke from 'nav-frontend-lenker'
import Panel from 'nav-frontend-paneler'
import { Input, Radio, RadioGruppe } from 'nav-frontend-skjema'
import { themeKeys } from 'nav-styled-component-theme'
import styled from 'styled-components'
import { animationClose, animationLeft, animationOpen, animationRight } from './keyframes'

export const AlignedSelect = styled(Select)`
  margin-bottom: 3rem;
  &.feil {
    margin-bottom: 0rem !important;
  }
`
export const Margin = styled.div`
  flex: 1;
`
export const Content = styled.div`
  flex: 6;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
`
export const SideBar = styled.div`
  display: flex;
  min-width: 21.5rem;
`
export const Container = styled.div`
  display: flex;
  margin: 0px;
  margin-top: 3rem;
`
export const VerticalSeparatorDiv = styled.div`
  margin-bottom: ${(props: any) => props['data-size'] || 1}rem;
`
export const HorizontalSeparatorDiv = styled.div`
  margin-left: ${(props: any) => props['data-size'] || 1}rem;
`
export const Row = styled.div`
  display: flex;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`
export const AlignedRow = styled(Row)`
  align-items: flex-end;
  &.feil {
    align-items: center !important;
  }
`
export const Column = styled.div`
  flex: 1;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`
export const AlignCenterColumn = styled(Column)`
  display: flex;
  align-items: center;
`
export const HighContrastLink = styled(Lenke)`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
  line-height: ${({ theme }) => theme.type === 'themeHighContrast' ? '1.5rem' : 'inherit'};
  color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]} !important;
  svg {
    fill: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]} !important;
    stroke: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]} !important;
  }
`
export const HighContrastInput = styled(Input)`
  input {
    border-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
    border-style: solid;
    border-radius: ${({ theme }) => theme[themeKeys.MAIN_BORDER_RADIUS]};
    border-color: ${({ theme }) => theme.type === 'themeHighContrast' ? theme.white : theme.navGra60};
    background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
    color:  ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
  }
`
export const HighContrastHovedknapp = styled(Hovedknapp)`
  align-items: baseline;
  background-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  color: ${({ theme }) => theme[themeKeys.INVERTED_FONT_COLOR]};
  border-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
    border-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
    color: ${({ theme }) => theme[themeKeys.INVERTED_FONT_COLOR]};
    svg path {
      stroke: ${({ theme }) => theme[themeKeys.INVERTED_FONT_COLOR]};
    }
  }
  &:disabled {
    color: ${({ theme }) => theme[themeKeys.INVERTED_FONT_COLOR]};
    background-color: ${({ theme }) => theme[themeKeys.MAIN_DISABLED_COLOR]};
  }
  svg path {
    stroke: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  }
`
export const AlignedInput = styled(HighContrastInput)`
  margin-bottom: 3rem;
  &.feil {
    margin-bottom: 0rem !important;
  }
`
export const RadioGroup = styled(RadioGruppe)`
`
export const RadioEl = styled(Radio)`
  flex: 1;
  border-radius: 4px;
  border: 1px solid ${({ checked, theme }: any) => checked ? theme[themeKeys.MAIN_INTERACTIVE_COLOR] : theme[themeKeys.MAIN_DISABLED_COLOR]};
  box-shadow: 0px 3px 5px ${({ checked, theme }: any) => checked ? theme[themeKeys.MAIN_INTERACTIVE_COLOR] : theme[themeKeys.MAIN_DISABLED_COLOR]};
  background-color: ${({ checked, theme }: any) => checked ? theme[themeKeys.MAIN_BACKGROUND_COLOR] : theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  animation-delay: ${props => ((0.2 * parseInt('' + props.step || '0')) + 's')};
  .skjemaelement__label {
    display: block;
    height: 100%;
    padding: 1rem;
    padding-left: 3rem;
    &:before {
     margin: 1rem;
    }
  }
`
export const RadioEls = styled.div`
  display: flex;
  flex-wrap: wrap;
`
export const HighContrastPanel = styled(Panel)`
  border-width: ${({ theme }) => theme.type === 'themeHighContrast' ? '2px' : '1px'};
  border-style: solid;
  border-color: ${({ theme }) => theme.type === 'themeHighContrast' ? theme.white : theme.navGra60};
  background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  border-radius: ${({ theme }) => theme[themeKeys.MAIN_BORDER_RADIUS]};
`
export const HighContrastKnapp = styled(Knapp)`
  background-color: ${({ theme }) => theme.type === 'themeHighContrast' ? theme.black : 'inherit'};
  color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  border-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
    color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
    svg path {
      stroke: ${({ theme }) => theme[themeKeys.INVERTED_FONT_COLOR]};
    }
  }
  svg path {
    stroke: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  }
`
export const HiddenFormContainer = styled.div`
  overflow: hidden;
  &.slideOpen {
    will-change: max-height, height;
    max-height: 10em;
    height: 100%;
    animation: ${animationOpen} 0.3s ease;
  }
  &.slideClose {
    will-change: max-height, height;
    max-height: 0;
    height: 0%;
    animation: ${animationClose} 0.3s ease;
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
    animation: ${animationLeft} 0.5s ease;
  }
  &.slideClose {
    will-change: margin-left;
    margin-left: 21.5rem;
    animation: ${animationRight} 0.5s ease;
  }
  &.closed {
    margin-left: 21.5rem;
  }
`

export const HighContrastFlatknapp = styled(Flatknapp)`
  color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  background-color: transparent;
  &:hover:not(:disabled) {
    color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
    border-color: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
    svg path {
      stroke: ${({ theme }) => theme[themeKeys.INVERTED_FONT_COLOR]};
    }
  }
   &:disabled {
    background-color: ${({ theme }) => theme[themeKeys.MAIN_DISABLED_COLOR]};
    color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
    border: none;
  }
  svg path {
    stroke: ${({ theme }) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  }
`
