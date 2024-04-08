import { ChevronLeftIcon, ExternalLinkIcon } from '@navikt/aksel-icons'
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

const HeaderContent = styled.header`
  background-color: var(--a-blue-200);
  color: var(--a-text-default);
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
  color: var(--a-text-default);
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
  backButton?: boolean
  onGoBackClick?: () => void
  unsavedDoc?: boolean
}

export const mapState = (state: State): HeaderSelector => ({
  saksbehandler: state.app.saksbehandler
})

const Header: React.FC<HeaderProps> = ({
  backButton,
  onGoBackClick,
  title
}: HeaderProps): JSX.Element => {
  const { saksbehandler }: HeaderSelector = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const resetApp = () => {
    dispatch(appReset())
  }

  return (
    <HeaderContent>
      <div>
        {backButton && (
          <Button
            variant='secondary'
            onClick={onGoBackClick}
            icon={<ChevronLeftIcon/>}
          >
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
      <SaksbehandlerDiv>
        {saksbehandler && saksbehandler.navn && (
          <Name>
            {saksbehandler.navn}
          </Name>
        )}
        <Link
          target='_blank'
          href='https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Brukerveiledning-nEESSI.aspx'
        >
          {t('label:brukerveiledning')}
          <ExternalLinkIcon />
        </Link>
        <HorizontalSeparatorDiv />
        <Link
          target='_blank'
          href='https://ec.europa.eu/social/social-security-directory/cai/select-country/language/en'
        >
          {t('label:cai')}
          <ExternalLinkIcon />
        </Link>

      </SaksbehandlerDiv>
    </HeaderContent>
  )
}

Header.propTypes = {
  title: PT.string.isRequired
}

export default Header
