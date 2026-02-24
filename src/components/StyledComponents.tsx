import styled from 'styled-components'
import {Box} from '@navikt/ds-react'

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
