import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import styled, { keyframes } from 'styled-components'

export type ProgressBarStatus = 'todo' | 'inprogress' | 'done' | 'error'

export interface ProgressBarProps {
  className?: string
  now?: number
  border ?: boolean
  status?: ProgressBarStatus
  children?: JSX.Element
}

const progressBarAnimation = keyframes`
  0% {background-position: 1rem 0;} to {background-position: 0 0;}
`

export const ProgressBarDiv = styled.div`
  background-color: var(--a-bg-default);
  width: 100%;
  display: block;
  border-radius: 4px;
  border-color: var(--a-border-default);
  border-width: 1px;
  &.border {
    border-style: solid;
  }
`

export const Bar = styled.div`
  border-radius: 4px;
  line-height: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
  transition: width .3s ease;
  background-size: 1rem 1rem;
  animation: ${progressBarAnimation} 1s linear infinite;
  &.inprogress {
    background-color: var(--a-blue-500);
    color: var(--a-white);
    background-image: linear-gradient(45deg, hsla(0, 0%, 100%, .15) 25%, transparent 0, transparent 50%, hsla(0, 0%, 100%, .15) 0, hsla(0, 0%, 100%, .15) 75%, transparent 0, transparent);
  }
  &.done {
    background-color: var(--a-green-500);
    color: var(--a-white);
  }
  &.error {
    background-color: var(--a-red-500);
    color: var(--a-white);
  }
  &.todo {
     background-color: var(--a-border-divider);
  }
`

const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  now = 0,
  status = 'inprogress',
  children,
  border = true
}: ProgressBarProps): JSX.Element => (
  <ProgressBarDiv className={classNames(className, {border})}>
    <Bar
      role='progressbar'
      className={classNames(status)}
      style={{ width: (now) + '%' }}
      aria-valuenow={now}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {children}
    </Bar>
  </ProgressBarDiv>
)

ProgressBar.propTypes = {
  className: PT.string,
  now: PT.number.isRequired,
  status: PT.oneOf(['todo', 'inprogress', 'done', 'error'])
}

export default ProgressBar
