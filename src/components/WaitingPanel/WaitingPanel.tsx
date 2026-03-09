import classNames from 'classnames'
import {BodyLong, Box, Loader} from '@navikt/ds-react'
import React from 'react'
import styles from './WaitingPanel.module.css'

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
  <div
    style={style}
    className={classNames(styles.waitingPanelDiv, className, { [styles.rowDirection]: oneLine })}
  >
    <Loader type={size} />
    {message && (
      <>
        <Box paddingInline="space-8">
          <BodyLong
            className={classNames({ [styles.oneLine]: oneLine })}
            data-testid='c-waitingpanel__text-id'
          >
            {message}
          </BodyLong>
        </Box>
      </>
    )}
  </div>
)

WaitingPanel.displayName = 'WaitingPanel'
export default WaitingPanel
