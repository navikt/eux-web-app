import { toggleHighContrast } from 'actions/ui'
import classNames from 'classnames'
import { State } from 'declarations/reducers'
import { Saksbehandler } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import NEESSILogo from 'resources/images/nEESSI'

import './Header.css'

export interface HeaderSelector {
  saksbehandler: Saksbehandler | undefined
}

export interface HeaderProps {
  className?: string;
}

export const mapState = (state: State): HeaderSelector => ({
  saksbehandler: state.app.saksbehandler
})

const Header: React.FC<HeaderProps> = ({ className }: HeaderProps): JSX.Element => {
  const { saksbehandler }: HeaderSelector = useSelector<State, HeaderSelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleHighContrastToggle = (): void => {
    dispatch(toggleHighContrast())
  }

  return (
    <header className={classNames(className, 'c-header')}>
      <div className='c-header__brand'>
        <Link to='/' className='ml-2 mr-2'>
          <NEESSILogo />
        </Link>
        <div className='c-header__skillelinje' />
        <div className='c-header__tittel'><span>{t('ui:app-name')}</span></div>
      </div>
      <Ui.Nav.Undertittel>
         {t('ui:app-title')}
      </Ui.Nav.Undertittel>
      <div className='c-header__saksbehandler'>
        <Ui.Nav.Lenke
                 className='c-header__highcontrast-link mr-3'
                  href='#highContrast'
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleHighContrastToggle()
                  }}
                >
                  {t('ui:label-highContrast')}
        </Ui.Nav.Lenke>
        {saksbehandler && saksbehandler.navn ? (
          <div className='saksbehandler__navn'>
            {saksbehandler.navn}
          </div>
        ) : null}
      </div>
    </header>
  )
}

Header.propTypes = {
  className: PT.string
}

export default Header
