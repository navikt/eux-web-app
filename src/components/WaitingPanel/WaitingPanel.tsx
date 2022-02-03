import classNames from 'classnames'
import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { BodyLong, Loader } from '@navikt/ds-react'
import PT from 'prop-types'
import React from 'react'
import styled from 'styled-components'

export const WaitingPanelDiv = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  &.rowDirection {
     flex-direction: row;
  }
  .oneLine {
    display: inline-block;
    vertical-align: top;
  }
`

export type WaitingPanelSize = 'xsmall'| 'small' | 'medium'| 'large' | 'xlarge'| '2xlarge'

export interface WaitingPanelProps {
  className?: string
  size?: WaitingPanelSize
  style?: React.CSSProperties
  message?: string,
  oneLine?: boolean
}

const WaitingPanel: React.FC<WaitingPanelProps> = ({
  className, size = 'medium', style = {}, message = 'Vennligst vent...', oneLine = false
}: WaitingPanelProps): JSX.Element | null => (
  <WaitingPanelDiv
    style={style}
    className={classNames(className, { rowDirection: oneLine })}
  >
    <Loader type={size} />
    {message && (
      <>
        <HorizontalSeparatorDiv />
        <BodyLong
          className={classNames({ oneLine: oneLine })}
          data-test-id='c-waitingpanel__text-id'
        >
          {message}
        </BodyLong>
      </>
    )}
  </WaitingPanelDiv>
)

WaitingPanel.propTypes = {
  className: PT.string,
  message: PT.string,
  oneLine: PT.bool,
  size: PT.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge', '2xlarge']),
  style: PT.object
}
WaitingPanel.displayName = 'WaitingPanel'
export default WaitingPanel
