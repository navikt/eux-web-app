import classNames from 'classnames'
import SEDDetails from 'components/SEDDetails/SEDDetails'
import { FadingLineSeparator, HiddenSidebar } from 'components/StyledComponents'
import NavHighContrast, { HorizontalSeparatorDiv } from 'nav-hoykontrast'
import { State } from 'declarations/reducers'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const mapState = (state: State): any => ({
  previousReplySed: state.svarpased.previousReplySed,
  replySed: state.svarpased.replySed
})

const SideBar = ({ highContrast }: any) => {
  const { replySed, previousReplySed } = useSelector<State, any>(mapState)

  const [_replySed, setReplySed] = useState(replySed)

  useEffect(() => {
    if (replySed && !previousReplySed) {
      setReplySed(replySed)
    }
  }, [replySed, previousReplySed])

  return (
    <NavHighContrast highContrast={highContrast}>
      <FadingLineSeparator
        className={classNames({
          fadeIn: replySed && !previousReplySed,
          fadeOut: previousReplySed && !replySed
        })}
      >
        &nbsp;
      </FadingLineSeparator>
      <HorizontalSeparatorDiv data-size='1.5' />
      <div
        style={{
          overflow: 'hidden',
          width: '21.5rem'
        }}
      >
        <HiddenSidebar
          className={classNames('z', {
            slideOpen: replySed && !previousReplySed,
            slideClose: previousReplySed && !replySed,
            closed: !replySed && !previousReplySed
          })}
        >
          {_replySed && <SEDDetails highContrast={highContrast} replySed={_replySed} />}
        </HiddenSidebar>
      </div>
      <HorizontalSeparatorDiv data-size='1.5' />
    </NavHighContrast>
  )
}

export default SideBar
