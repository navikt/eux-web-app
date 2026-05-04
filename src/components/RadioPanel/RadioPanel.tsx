import { Radio, RadioProps } from '@navikt/ds-react'
import React from 'react'
import styles from './RadioPanel.module.css'

export interface RadioPanelProps extends RadioProps {
  wrapperClassName?: string
}

const RadioPanel: React.FC<RadioPanelProps> = ({
  wrapperClassName,
  children,
  ...radioProps
}) => {
  const className = wrapperClassName
    ? `${styles.radioPanel} ${wrapperClassName}`
    : styles.radioPanel
  return (
    <div className={className}>
      <Radio {...radioProps}>{children}</Radio>
    </div>
  )
}

export default RadioPanel
