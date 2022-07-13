import { BackFilled, FileContentFilled } from '@navikt/ds-icons'
import { toggleHighContrast } from 'actions/ui'
import { FlexCenterDiv, HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { State } from 'declarations/reducers'
import { Saksbehandler } from 'declarations/types'
import { Button, Heading, Link } from '@navikt/ds-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as DomLink } from 'react-router-dom'
import NEESSILogo from 'assets/logos/nEESSI'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import PT from 'prop-types'
import { appReset } from 'actions/app'

const HeaderContent = styled.header<{highContrast: boolean}>`
  background-color: ${({ highContrast }) => highContrast
  ? 'var(--navds-semantic-color-component-background-alternate)'
  : 'var(--navds-global-color-blue-200)'};
  color: var(--navds-color-text-primary);
  display: flex;
  flex-direction: row;
  height: 4rem;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
`
const SaksbehandlerDiv = styled.div`
  align-items: flex-end;
  display: flex;
  flex-direction: row;
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
  highContrast: boolean
  title: string
  backButton?: boolean
  onGoBackClick?: () => void
  unsavedDoc?: boolean
}

export const mapState = (state: State): HeaderSelector => ({
  saksbehandler: state.app.saksbehandler
})

const Header: React.FC<HeaderProps> = ({
  backButton,
  highContrast,
  onGoBackClick,
  title,
  unsavedDoc = false
}: HeaderProps): JSX.Element => {
  const { saksbehandler }: HeaderSelector = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const handleHighContrastToggle = (): void => {
    dispatch(toggleHighContrast())
  }

  const resetApp = () => {
    dispatch(appReset())
  }

  return (
    <HeaderContent highContrast={highContrast}>
      <div>
        {backButton && (
          <Button
            variant='secondary'
            onClick={onGoBackClick}
          >
            <BackFilled />
            <HorizontalSeparatorDiv size='0.5' />
            {t('label:tilbake')}
          </Button>
        )}
      </div>
      <div />
      <FlexCenterDiv>
        <DomLink to='/' onClick={resetApp}>
          <NEESSILogo />
        </DomLink>
        <HorizontalSeparatorDiv />
        <Heading size='small'>
          {title}
        </Heading>
      </FlexCenterDiv>
      <div>
        {unsavedDoc && (
          <FlexCenterDiv>
            {t('label:utkast')}
            <HorizontalSeparatorDiv size='0.5' />
            <FileContentFilled />
          </FlexCenterDiv>
        )}
      </div>
      <SaksbehandlerDiv>
        <Link
          data-testid='header__highcontrast-link'
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
