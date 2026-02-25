import React from 'react'
import classNames from 'classnames'
import styles from './ProgressBar.module.css'

export type ProgressBarStatus = 'todo' | 'inprogress' | 'done' | 'error'

export interface ProgressBarProps {
  className?: string
  now?: number
  border ?: boolean
  status?: ProgressBarStatus
  children?: JSX.Element
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  now = 0,
  status = 'inprogress',
  children,
  border = true
}: ProgressBarProps): JSX.Element => (
  <div className={classNames(
    className,
    styles.progressBarDiv,
    {[styles.border]: border===true}
  )}
  >
    <div
      role='progressbar'
      className={classNames(
        styles.bar,
        {
          [styles.inprogress]: status === 'inprogress',
          [styles.done]: status === 'done',
          [styles.error]: status === 'error',
          [styles.todo]: status === 'todo',
        }
      )}
      style={{ width: (now) + '%' }}
      aria-valuenow={now}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {children}
    </div>
  </div>
)

export default ProgressBar
