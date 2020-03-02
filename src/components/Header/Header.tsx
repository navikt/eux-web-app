import classNames from 'classnames'
import { State } from 'declarations/reducers'
import { Saksbehandler } from 'declarations/types'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
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
  return (
    <header className={classNames(className, 'c-header')}>
      <div className='c-header__brand'>
        <Link to='/' className='ml-2 mr-2'>
          <NEESSILogo />
        </Link>
        <div className='c-header__skillelinje' />
        <div className='c-header__tittel'><span>{t('ui:app-name')}</span></div>
      </div>
      <div className='c-header__saksbehandler'>
        {saksbehandler && saksbehandler.navn ? (
          <div className='saksbehandler__navn'>
            {saksbehandler.navn}
          </div>
        ): null}
      </div>
    </header>
  )
}

Header.propTypes = {
  className: PT.string
}

export default Header
