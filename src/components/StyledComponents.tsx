import styled from 'styled-components'
import {
  fadeIn,
  fadeOut, PaddedHorizontallyDiv
} from '@navikt/hoykontrast'
import { Panel } from '@navikt/ds-react'

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
export const HorizontalLineSeparator = styled.div<{size?: string}>`
  height: 1px;
  margin-top: ${(props: any) => props.size || 0}rem;
  margin-bottom: ${(props: any) => props.size || 0}rem;
  background: linear-gradient(90deg,
    var(--navds-semantic-color-canvas-background) 0%,
    var(--navds-panel-color-border) 5%,
    var(--navds-panel-color-border) 95%,
    var(--navds-semantic-color-canvas-background) 100%
  );
  width: 100%;
`

export const Hr = styled.div`
   background: var(--navds-panel-color-border);
   width: 100%;
   height: 1px;
`

export const SpacedHr = styled(Hr)`
   margin-top: 0.5rem;
   margin-bottom: 0.5rem;
`

export const SideBarDiv = styled.div`
  display: flex;
  padding-top: 1.5rem;
`
export const TextAreaDiv = styled.div`
  textarea {
    width: 100%;
  }
`

export const WithErrorPanel = styled(Panel)`
  padding: 0rem;
  background-color: transparent;
  border: none;
  &.error {
    margin: -4px;
    border: 4px solid var(--navds-error-summary-color-border) !important;
  }
`

export const ShadowPanel = styled(Panel)`
 background-color: var(--navds-semantic-color-component-background-alternate);
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
  font-weight: bold;
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
  min-height: 3.6rem;
  &.new {
    background-color: rgba(236, 243, 153, 0.5);
  };
  &.error {
    background-color: rgba(255, 0, 0, 0.2);
  };
  &:hover:not(.new):not(.error) {
    background-color: var(--navds-global-color-gray-100);
  }
  &:not(:hover) .control-buttons {
    position: absolute;
    margin-left: -10000px;
  }
`
export const GrayPanel = styled(Panel)`
  background-color: var(--navds-semantic-color-canvas-background);
`
export const TransparentPanel = styled(Panel)`
  background-color: transparent;
`
export const CustomLabel = (props: any) => (<label className='navds-text-field__label navds-label'>{props.children}</label>)
