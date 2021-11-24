import { toggleHighContrast } from 'actions/ui'
import { themeKeys, HighContrastLink, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import { State } from 'declarations/reducers'
import { Saksbehandler } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import NEESSILogo from 'assets/logos/nEESSI'
import styled from 'styled-components'
import PT from 'prop-types'
import { cleanData } from 'actions/app'

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
  title: string
}

export const mapState = (state: State): HeaderSelector => ({
  saksbehandler: state.app.saksbehandler
})

const Header: React.FC<HeaderProps> = ({
  title
}: HeaderProps): JSX.Element => {
  const { saksbehandler }: HeaderSelector = useSelector<State, HeaderSelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleHighContrastToggle = (): void => {
    dispatch(toggleHighContrast())
  }

  const _cleanData = () => {
    dispatch(cleanData())
  }

  return (
    <HeaderContent>
      <Brand>
        <Link to='/' onClick={_cleanData}>
          <NEESSILogo />
        </Link>
        <Skillelinje />
        <Title>
          {t('app:name')}
        </Title>
      </Brand>
      <Undertittel>
        {title}
      </Undertittel>
      <SaksbehandlerDiv>
        <HighContrastLink
          data-test-id='header__highcontrast-link'
          href='#highContrast'
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            handleHighContrastToggle()
          }}
        >
          {t('label:høy-kontrast')}
        </HighContrastLink>
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
  title: PT.string.isRequired
}

export default Header
