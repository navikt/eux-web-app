import Select from 'components/Forms/Select'
import styled from 'styled-components'
import {
  themeKeys,
  animationClose,
  animationOpen,
  fadeIn,
  fadeOut,
  Row
} from 'nav-hoykontrast'

export const AlignedSelect = styled(Select)`
  margin-bottom: 3rem;
  &.feil {
    margin-bottom: 0rem !important;
  }
`
export const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
`
export const PileDiv = styled.div`
  display: flex;
  flex-direction: column;
`
export const FullWidthDiv = styled.div`
  width: 100%;
`
export const PileCenterDiv = styled(PileDiv)`
  align-items: center;
`
export const FlexBaseDiv = styled(FlexDiv)`
  align-items: baseline;
  justify-content: space-between;
`
export const FlexCenterDiv = styled(FlexDiv)`
  align-items: center;
  justify-content: space-between;
`
export const FlexStartDiv = styled(FlexDiv)`
  align-items: flex-start;
  justify-content: space-between;
`
export const PaddedDiv = styled.div`
  padding: 1rem;
`
export const PaddedFlexDiv = styled(FlexDiv)`
  padding: 1rem;
`
export const AlignEndRow = styled(Row)`
  align-items: flex-end;
`
export const AlignCenterRow = styled(Row)`
  align-items: center;
`
export const AlignStartRow = styled(Row)`
  align-items: flex-start;
`
export const FadingLineSeparator = styled.div`
   border-left: 1px solid ${({ theme }) => theme[themeKeys.MAIN_BORDER_COLOR]};
   opacity: 0;
   &.fadeIn {
     opacity: 1;
     animation: ${fadeIn} 0.5s forwards;
   }
   &.fadeOut {
     opacity: 0;
     animation: ${fadeOut} 0.5s forwards;
   }
`
export const SideBarDiv = styled.div`
  display: flex;
  flex: 0 0 21.5rem;
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
  padding: 0.25rem;
  color:  ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]} !important;
  background-color: ${({ theme }) => theme[themeKeys.MAIN_BACKGROUND_COLOR]};
  border: ${(props: any) => props['data-border'] === true ? '1px solid ' + props.theme[themeKeys.MAIN_BORDER_COLOR] : 'none'};
  border-radius: 5px;
  display: inline-block;
`
