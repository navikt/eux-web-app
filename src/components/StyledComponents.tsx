import styled from 'styled-components'
import {
  animationClose,
  animationOpen,
  fadeIn,
  fadeOut, PaddedHorizontallyDiv
} from '@navikt/hoykontrast'
import { Panel, Tag } from '@navikt/ds-react'

export const FadingLineSeparator = styled.div`
   border-left-width: 1px;
   border-left-style: solid;
   border-image: linear-gradient(
    to bottom,
     var(--navds-semantic-color-canvas-background) 0%,
     var(--navds-semantic-color-border) 5%,
     var(--navds-semantic-color-border) 95%,
     var(--navds-semantic-color-canvas-background) 100%
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
    var(--navds-semantic-color-canvas-background) 0%,
    var(--navds-semantic-color-border) 5%,
    var(--navds-semantic-color-border) 95%,
    var(--navds-semantic-color-canvas-background) 100%
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
export const MyTag = styled(Tag)`
  padding: 0.25rem 0.5rem;
  margin-left: -0.15rem;
  color: var(--navds-semantic-color-text) !important;
  background-color: var(--navds-semantic-color-component-background-alternate);
  border: ${(props: any) => props['data-border'] === true ? '1px solid var(--navds-semantic-color-border)' : 'none'};
  border-radius: 5px;
  display: inline-block;
`

export const WithErrorPanel = styled(Panel)`
  padding: 0rem;
  background-color: transparent;
  &.error {
    border-color: var(--navds-select-color-border-error);
    border-width: 3px;
    .left, .right {
       border: none;
    }
  }
  &:not(.error) {
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
    background-color: var(--navds-semantic-color-component-background-alternate);
  }
`
export const RepeatableRow = styled(PaddedHorizontallyDiv)`
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  &.new {
    background-color: rgba(236, 243, 153, 0.5);
  };
  &:hover:not(.new) {
    background-color: var(--navds-global-color-gray-100);
  }
`

export const CustomLabel = (props: any) => (<label className='navds-text-field__label navds-label'>{props.children}</label>)
