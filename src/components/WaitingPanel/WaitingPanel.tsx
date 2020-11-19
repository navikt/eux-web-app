import classNames from 'classnames'
import { HorizontalSeparatorDiv } from 'components/StyledComponents'
import Spinner from 'nav-frontend-spinner'
import { Normaltekst } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const WaitingPanelDiv = styled.div`
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

export interface WaitingPanelProps {
  className?: string;
  size?: 'XXS'| 'XS' | 'S'| 'M' | 'L'| 'XL'| 'XXL' | 'XXXL';
  style?: React.CSSProperties;
  message?: string,
  oneLine?: boolean
}

const WaitingPanel: React.FC<WaitingPanelProps> = ({
  size = 'M', style = {}, message = 'Vennligst vent...', oneLine = false
}: WaitingPanelProps): JSX.Element | null => (
  <WaitingPanelDiv
    style={style}
    className={classNames({ rowDirection: oneLine })}
  >
    <Spinner type={size} />
    {message && (
      <>
        <HorizontalSeparatorDiv />
        <Normaltekst
          className={classNames({ oneLine: oneLine })}
        >
          {message}
        </Normaltekst>
      </>
    )}
  </WaitingPanelDiv>
)

WaitingPanel.propTypes = {
  className: PT.string,
  message: PT.string,
  oneLine: PT.bool,
  size: PT.oneOf(['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']),
  style: PT.object
}
WaitingPanel.displayName = 'WaitingPanel'
export default WaitingPanel
