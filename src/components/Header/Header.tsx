import { toggleHighContrast } from 'actions/ui'
import { HorizontalSeparatorDiv } from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { Saksbehandler } from 'declarations/types'
import Lenke from 'nav-frontend-lenker'
import { Undertittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import NEESSILogo from 'resources/images/nEESSI'
import styled from 'styled-components'

export interface HeaderSelector {
  saksbehandler: Saksbehandler | undefined
}

export interface HeaderProps {
  className?: string;
}

export const mapState = (state: State): HeaderSelector => ({
  saksbehandler: state.app.saksbehandler
})

const HeaderContent = styled.header`
  background-color: #99c2e8;
  display: flex;
  flex-direction: row;
  height: 4rem;
  justify-content: space-between;
  align-items: center;
`
const Brand = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`
const Skillelinje = styled.div`
  border-left: 1px solid #02329c;
  display: flex;
  height: 30px;
`
const Title = styled.div`
  color: #02329c;
  display: flex;
  font-size: 14pt;
  font-weight: bold;
  padding-left: 15px;
`
const SaksbehandlerDiv = styled.div`
  align-items: flex-end;
  display: flex;
  flex-direction: row;
  margin-right: 1rem;
  align-items: center;
`
const Name = styled.div`
  color: #02329c;
  font-weight: bold;
  display: flex;
  margin: auto 0;
  padding: 0.3em;
`

const Header: React.FC<HeaderProps> = ({ className }: HeaderProps): JSX.Element => {
  const { saksbehandler }: HeaderSelector = useSelector<State, HeaderSelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleHighContrastToggle = (): void => {
    dispatch(toggleHighContrast())
  }

  const cleanData = () => {
    dispatch({
      type: types.APP_CLEAN_DATA
    })
  }

  return (
    <HeaderContent className={className}>
      <Brand>
        <Link to='/' onClick={cleanData} className='ml-2 mr-2'>
          <NEESSILogo />
        </Link>
        <Skillelinje />
        <Title>
          {t('ui:app-name')}
        </Title>
      </Brand>
      <Undertittel>
        {t('ui:app-title')}
      </Undertittel>
      <SaksbehandlerDiv>
        <Lenke
          data-testid='c-header__highcontrast-link'
          href='#highContrast'
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            handleHighContrastToggle()
          }}
        >
          {t('ui:label-highContrast')}
        </Lenke>
        <HorizontalSeparatorDiv />
        {saksbehandler && saksbehandler.navn && (
          <Name>
            {saksbehandler.navn}
          </Name>
        )}
      </SaksbehandlerDiv>
    </HeaderContent>
  )
}

Header.propTypes = {
  className: PT.string
}

export default Header
