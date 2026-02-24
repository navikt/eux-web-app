import styled from 'styled-components'
import {Box} from '@navikt/ds-react'

export const Hr = styled.div`
   background: var(--a-border-strong);
   width: 100%;
   height: 1px;
`

export const SpacedHr = styled(Hr)`
   margin-top: 0.5rem;
   margin-bottom: 0.5rem;
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
    background-color: var(--a-surface-subtle);
  }
`

export const RepeatableBox = styled(Box)`
  &.new {
    background-color: rgba(236, 243, 153, 0.5);
  };
  &.error {
    background-color: rgba(255, 0, 0, 0.2);
  };
  &.original {
    background-color: var(--a-blue-100);
  };
  &.errorBorder {
    border: 1px solid var(--a-border-danger);
  }
  &:hover:not(.new):not(.error) {
    background-color: var(--a-gray-100);
  }
  &:not(:hover) .control-buttons {
    visibility: hidden;
  }
`
