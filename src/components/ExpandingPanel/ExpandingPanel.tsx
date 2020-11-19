import classNames from 'classnames'
import { animationClose, animationOpen } from 'components/keyframes'
import { guid } from 'nav-frontend-js-utils'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Collapse, UnmountClosed } from 'react-collapse'
import { useTranslation } from 'react-i18next'
import styled, { ThemeProvider } from 'styled-components'

export const ExpandingPanelDiv = styled.div`
  &.ekspanderbartPanel--apen .ReactCollapse--collapse {
    will-change: max-height, height;
    max-height: 150em;
    animation: ${animationOpen} 250ms ease;
  }
  &.ekspanderbartPanel--lukket .ReactCollapse--collapse {
    will-change: max-height, height;
    max-height: 0;
    animation: ${animationClose} 250ms ease;
  }
`

export interface ExpandingPanelProps {
  ariaTittel?: string
  border?: boolean
  children : JSX.Element
  className?: string
  collapseProps?: any
  highContrast: boolean
  heading?: JSX.Element | string
  id?: string
  onClose?: () => void
  onOpen?: () => void
  open?: boolean
  renderContentWhenClosed?: boolean
  style?: React.CSSProperties
}

const ExpandingPanel: React.FC<ExpandingPanelProps> = ({
  ariaTittel, border = false, children, className, collapseProps, highContrast, heading, id,
  onClose = () => {}, onOpen = () => {}, open = false, renderContentWhenClosed, style = {}
}: ExpandingPanelProps): JSX.Element => {
  const [_open, setOpen] = useState<boolean>(open)
  const { t } = useTranslation()
  const [_isCloseAnimation, setIsCloseAnimation] = useState<boolean>(false)
  const contentId: string = (collapseProps && collapseProps.id) || guid()

  useEffect(() => {
    if (!open && _open) {
      setIsCloseAnimation(true)
    }
  }, [open, _open])

  const handleOnClick = (e: React.MouseEvent): void => {
    e.preventDefault()
    handleOpenToggle()
  }

  const handleKeyboard = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleOpenToggle()
    }
  }

  const handleOpenToggle = (): void => {
    setOpen(!_open)
    if (!_open) {
      onClose()
    } else {
      onOpen()
    }
  }

  const onRestProxy = (): void => {
    setIsCloseAnimation(false)
    if (collapseProps && collapseProps.onRest) {
      collapseProps.onRest()
    }
  }

  const tabHandler = (e: React.KeyboardEvent) => {
    const { keyCode } = e
    const isTab = keyCode === 9

    if (isTab && _isCloseAnimation) {
      e.preventDefault()
    }
  }

  const showContentId: boolean = !(!renderContentWhenClosed && !_open)
  const ariaControls: {[k: string]: string} | undefined = showContentId ? { 'aria-controls': contentId } : undefined
  const CollapseComponent: any = renderContentWhenClosed ? Collapse : UnmountClosed

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <ExpandingPanelDiv
        id={id}
        style={style}
        className={classNames('ekspanderbartPanel', className, {
          'ekspanderbartPanel--lukket': !_open,
          'ekspanderbartPanel--apen': _open,
          'ekspanderbartPanel--border': border
        })}
      >
        <div
          aria-expanded={_open}
          data-test-id='c-expandingpanel__head-id'
          className='ekspanderbartPanel__hode'
          onClick={handleOnClick}
          onKeyDown={handleKeyboard}
          role='button'
          tabIndex={0}
          {...ariaControls}
        >
          <div
            className='ekspanderbartPanel__flex-wrapper'
            data-test-id='c-expandingpanel__body-id'
          >
            {heading}
            <button
              aria-expanded={_open}
              aria-label={t('ui:open')}
              className='ekspanderbartPanel__knapp'
              data-test-id='c-expandingpanel__button-id'
              onKeyDown={tabHandler}
              onClick={handleOnClick}
              type='button'
            >
              <span className='ekspanderbartPanel__indikator' />
            </button>
          </div>
        </div>
        <CollapseComponent
          id={contentId}
          isOpened={_open}
          onRest={onRestProxy}
          {...collapseProps}
        >
          <article
            aria-label={ariaTittel}
            className='ekspanderbartPanel__innhold'
            data-test-id='c-expandingpanel__content-id'
          >
            {children}
          </article>
        </CollapseComponent>
      </ExpandingPanelDiv>
    </ThemeProvider>
  )
}

ExpandingPanel.propTypes = {
  ariaTittel: PT.string,
  border: PT.bool,
  children: PT.any.isRequired,
  className: PT.string,
  collapseProps: PT.object,
  highContrast: PT.bool.isRequired,
  heading: PT.oneOfType([PT.string, PT.element]),
  id: PT.string,
  onClose: PT.func,
  onOpen: PT.func,
  open: PT.bool,
  renderContentWhenClosed: PT.bool,
  style: PT.object
}

export default ExpandingPanel
