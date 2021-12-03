import { toggleHighContrast } from 'actions/ui'
import { HorizontalSeparatorDiv } from 'nav-hoykontrast'
import { State } from 'declarations/reducers'
import { Saksbehandler } from 'declarations/types'
import { Link, Heading } from '@navikt/ds-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link as DomLink } from 'react-router-dom'
import NEESSILogo from 'assets/logos/nEESSI'
import styled from 'styled-components'
import PT from 'prop-types'
import { cleanData } from 'actions/app'

const HeaderContent = styled.header<{highContrast: boolean}>`
  background-color: ${({ highContrast }) => highContrast
  ? 'var(--navds-semantic-color-component-background-alternate)'
  : 'var(--navds-color-blue-20)'};
  color: var(--navds-color-text-primary);
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
  border-left: 1px solid var(--navds-color-border);
  display: flex;
  height: 30px;
  margin-left: 1rem;
  margin-right: 1rem;
`
const Title = styled.div`
  color: var(--navds-color-text-primary);
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
  color: var(--navds-color-text-primary);
  font-weight: bold;
  display: flex;
  margin: auto 0;
  padding: 0.3em;
`

export interface HeaderSelector {
  saksbehandler: Saksbehandler | undefined
}

export interface HeaderProps {
  highContrast: boolean;
  title: string
}

export const mapState = (state: State): HeaderSelector => ({
  saksbehandler: state.app.saksbehandler
})

const Header: React.FC<HeaderProps> = ({
  highContrast,
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
    <HeaderContent highContrast={highContrast}>
      <Brand>
        <DomLink to='/' onClick={_cleanData}>
          <NEESSILogo />
        </DomLink>
        <Skillelinje />
        <Title>
          {t('app:name')}
        </Title>
      </Brand>
      <Heading size='small'>
        {title}
      </Heading>
      <SaksbehandlerDiv>
        <Link
          data-test-id='header__highcontrast-link'
          href='#highContrast'
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            handleHighContrastToggle()
          }}
        >
          {t('label:høy-kontrast')}
        </Link>
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
