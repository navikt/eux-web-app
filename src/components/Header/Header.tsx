import { ChevronLeftIcon, ExternalLinkIcon, MenuGridIcon } from '@navikt/aksel-icons'
import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { State } from 'declarations/reducers'
import {Enhet, Enheter, Saksbehandler} from 'declarations/types'
import {BodyShort, Button, Detail, Dropdown, Heading, HStack, InternalHeader, Spacer} from '@navikt/ds-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import PT from 'prop-types'
import { appReset } from 'actions/app'

const HeaderContent = styled.header`
  background-color: var(--a-bg-subtle);
  color: var(--a-text-default);
  display: flex;
  flex-direction: row;
  height: 3rem;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
`

const MyInternalHeader = styled(InternalHeader)`
  > button > div {
    width: max-content;
  }
`

export interface HeaderSelector {
  saksbehandler: Saksbehandler | undefined
  enheter: Enheter | null | undefined
  selectedEnhet: Enhet | null | undefined
  favouriteEnhet: Enhet | null | undefined
}

export interface HeaderProps {
  title: string
  backButton?: boolean
  onGoBackClick?: () => void
  unsavedDoc?: boolean
}

export const mapState = (state: State): HeaderSelector => ({
  saksbehandler: state.app.saksbehandler,
  enheter: state.app.enheter,
  selectedEnhet: state.app.selectedEnhet,
  favouriteEnhet: state.app.favouriteEnhet
})

const Header: React.FC<HeaderProps> = ({
  backButton,
  onGoBackClick,
  title
}: HeaderProps): JSX.Element => {
  const { saksbehandler, enheter, selectedEnhet }: HeaderSelector = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const resetApp = () => {
    dispatch(appReset())
  }

  return (
    <>
      <MyInternalHeader>
        <InternalHeader.Title href="/" onClick={resetApp}>
          nEESSI
        </InternalHeader.Title>
        <HStack align="center" paddingInline="4 0" width="100%">
          <Heading size='small'>
            {title}
          </Heading>
        </HStack>
        <Spacer/>
        <Dropdown>
          <InternalHeader.Button as={Dropdown.Toggle}>
            <MenuGridIcon
              style={{fontSize: "1.5rem"}}
              title="Systemer og oppslagsverk"
            />
          </InternalHeader.Button>
          <Dropdown.Menu>
            <Dropdown.Menu.GroupedList>
              <Dropdown.Menu.GroupedList.Heading>
                Systemer og oppslagsverk
              </Dropdown.Menu.GroupedList.Heading>
              <Dropdown.Menu.GroupedList.Item as="a" target="_blank" href="https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Brukerveiledning-nEESSI.aspx">
                {t('label:brukerveiledning')} <ExternalLinkIcon aria-hidden/>
              </Dropdown.Menu.GroupedList.Item>
              <Dropdown.Menu.GroupedList.Item as="a" target="_blank" href="https://ec.europa.eu/social/social-security-directory/cai/select-country/language/en">
                {t('label:cai')}<ExternalLinkIcon aria-hidden/>
              </Dropdown.Menu.GroupedList.Item>
            </Dropdown.Menu.GroupedList>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <InternalHeader.UserButton
            name={saksbehandler && saksbehandler.navn ? saksbehandler.navn : ""}
            description={selectedEnhet ? "Enhet: " + selectedEnhet.enhetId + ' - ' + selectedEnhet.navn : ""}
            as={Dropdown.Toggle}
          />
          <Dropdown.Menu>
            <dl>
              <BodyShort as="dt" size="small">
                {saksbehandler && saksbehandler.navn ? saksbehandler.navn : ""}
              </BodyShort>
              <Detail as="dd">{selectedEnhet ? "Enhet: " + selectedEnhet.enhetId + ' - ' + selectedEnhet.navn : ""}</Detail>
            </dl>
            <Dropdown.Menu.Divider />
            <Dropdown.Menu.List>
              {enheter?.map((e) => {
                return(<Dropdown.Menu.List.Item>{e.navn}</Dropdown.Menu.List.Item>)
              })}
            </Dropdown.Menu.List>
          </Dropdown.Menu>
        </Dropdown>
      </MyInternalHeader>
      {backButton && (
        <HeaderContent>
          <Button
            variant='secondary'
            onClick={onGoBackClick}
            icon={<ChevronLeftIcon/>}
            size="small"
          >
            <HorizontalSeparatorDiv size='0.5'/>
            {t('label:tilbake')}
          </Button>
        </HeaderContent>
      )}
    </>
  )
}

Header.propTypes = {
  title: PT.string.isRequired
}

export default Header
