import { toggleHighContrast } from 'actions/ui'
import NavHighContrast, { HighContrastLink, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { Saksbehandler } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import { themeKeys } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import NEESSILogo from 'resources/images/nEESSI'
import styled from 'styled-components'

const HeaderContent = styled.header`
  background-color: ${({ theme }: any) => theme.type === 'themeHighContrast' ? theme[themeKeys.MAIN_BACKGROUND_COLOR] : '#99c2e8'};
  color: ${({ theme }: any) => theme[themeKeys.MAIN_FONT_COLOR]};
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
  margin-left: 1rem;
`
const Skillelinje = styled.div`
  border-left: 1px solid ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_COLOR]};
  display: flex;
  height: 30px;
  margin-left: 1rem;
  margin-right: 1rem;
`
const Title = styled.div`
  color: ${({ theme }: any) => theme.type === 'themeHighContrast' ? theme[themeKeys.MAIN_FONT_COLOR] : '#02329c'};
  display: flex;
  font-size: 14pt;
  font-weight: bold;
`
const SaksbehandlerDiv = styled.div`
  align-items: flex-end;
  display: flex;
  flex-direction: row;
  margin-right: 1rem;
  align-items: center;
`
const Name = styled.div`
  color: ${({ theme }: any) => theme.type === 'themeHighContrast' ? theme[themeKeys.MAIN_FONT_COLOR] : '#02329c'};
  font-weight: bold;
  display: flex;
  margin: auto 0;
  padding: 0.3em;
`

export interface HeaderSelector {
  saksbehandler: Saksbehandler | undefined
}

export interface HeaderProps {
  highContrast: boolean
}

export const mapState = (state: State): HeaderSelector => ({
  saksbehandler: state.app.saksbehandler
})

const Header: React.FC<HeaderProps> = ({ highContrast }: HeaderProps): JSX.Element => {
  const { saksbehandler }: HeaderSelector = useSelector<State, HeaderSelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleHighContrastToggle = (): void => {
    dispatch(toggleHighContrast())
  }

  const cleanData = () => dispatch({ type: types.APP_CLEAN_DATA })

  return (
    <NavHighContrast highContrast={highContrast}>
      <HeaderContent>
        <Brand>
          <Link to='/' onClick={cleanData}>
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
          <HighContrastLink
            data-test-id='c-header__highcontrast-link'
            href='#highContrast'
            onClick={(e: React.MouseEvent) => {
              e.preventDefault()
              e.stopPropagation()
              handleHighContrastToggle()
            }}
          >
            {t('ui:label-highContrast')}
          </HighContrastLink>
          <HorizontalSeparatorDiv />
          {saksbehandler && saksbehandler.navn && (
            <Name>
              {saksbehandler.navn}
            </Name>
          )}
        </SaksbehandlerDiv>
      </HeaderContent>
    </NavHighContrast>
  )
}

Header.propTypes = {
  highContrast: PT.bool.isRequired
}

export default Header
