import classNames from 'classnames'
import { fadeIn, fadeOut } from 'components/keyframes'
import SEDPanel from 'components/SEDPanel/SEDPanel'
import { HiddenSidebar, HorizontalSeparatorDiv } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { theme, themeHighContrast, themeKeys } from 'nav-styled-component-theme'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'

const FadingLineSeparator = styled.div`
   border-left: 1px solid ${({ theme }) => theme[themeKeys.MAIN_BORDER_COLOR]};
   opacity: 0;
   &.fadeIn {
     animation: ${fadeIn} 0.5s forwards;
   }
   &.fadeOut {
     animation: ${fadeOut} 0.5s forwards;
   }
`

const mapState = (state: State): any => ({
  previousReplySed: state.svarpased.previousReplySed,
  replySed: state.svarpased.replySed
})

const SEDDetails = ({ highContrast }: any) => {
  const { replySed, previousReplySed } = useSelector<State, any>(mapState)

  const [_replySed, setReplySed] = useState(replySed)

  useEffect(() => {
    if (replySed && !previousReplySed) {
      setReplySed(replySed)
    }
  }, [replySed, previousReplySed])

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
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
          {_replySed && <SEDPanel replySed={_replySed} />}
        </HiddenSidebar>
      </div>
    </ThemeProvider>
  )
}

export default SEDDetails
