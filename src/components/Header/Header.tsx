import { ChevronLeftIcon, ExternalLinkIcon, MenuGridIcon, StarFillIcon, StarIcon } from '@navikt/aksel-icons'
import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { State } from 'declarations/reducers'
import {Enhet, Enheter, Saksbehandler} from 'declarations/types'
import {ActionMenu, BodyShort, Button, Detail, Heading, HStack, InternalHeader, Spacer} from '@navikt/ds-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import PT from 'prop-types'
import {appReset, setFavouriteEnhet, setSelectedEnhet} from 'actions/app'
import {NavLink} from "react-router-dom";


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

const ActionMenuItem = styled(ActionMenu.Item)`
  &.selectedEnhet {
    background-color: var(--a-surface-selected);
  }
`

export interface HeaderSelector {
  saksbehandler: Saksbehandler | undefined
  enheter: Enheter | null | undefined
  selectedEnhet: Enhet | null | undefined
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

  const setSelected = (enhet: Enhet) => {
    dispatch(setSelectedEnhet(enhet))
  }

  const setFavourite = (enhet: Enhet | undefined | null) => {
    dispatch(setFavouriteEnhet(enhet))
  }

  return (
    <>
      <MyInternalHeader>
        <InternalHeader.Title as={NavLink} to="/" onClick={resetApp}>
          nEESSI
        </InternalHeader.Title>
        <HStack align="center" paddingInline="4 0" width="100%">
          <Heading size='small'>
            {title}
          </Heading>
        </HStack>
        <Spacer/>
        <ActionMenu>
          <ActionMenu.Trigger>
            <InternalHeader.Button>
              <MenuGridIcon
                style={{fontSize: "1.5rem"}}
                title="Systemer og oppslagsverk"
              />
            </InternalHeader.Button>
          </ActionMenu.Trigger>
          <ActionMenu.Content>
            <ActionMenu.Group label="Systemer og oppslagsverk">
              <ActionMenu.Item as="a" target="_blank" href="https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Brukerveiledning-nEESSI.aspx" icon={<ExternalLinkIcon aria-hidden/>}>
                {t('label:brukerveiledning')}
              </ActionMenu.Item>
              <ActionMenu.Item as="a" target="_blank" href="https://ec.europa.eu/social/social-security-directory/cai/select-country/language/en" icon={<ExternalLinkIcon aria-hidden/>}>
                {t('label:cai')}
              </ActionMenu.Item>
            </ActionMenu.Group>
          </ActionMenu.Content>
        </ActionMenu>

        <ActionMenu>
          <ActionMenu.Trigger>
            <InternalHeader.UserButton
              name={saksbehandler && saksbehandler.navn ? saksbehandler.navn : ""}
              description={selectedEnhet ? "Enhet: " + selectedEnhet.enhetNr + ' - ' + selectedEnhet.navn : ""}
            />
          </ActionMenu.Trigger>
          <ActionMenu.Content>
            <BodyShort size="small">
              {saksbehandler && saksbehandler.navn ? saksbehandler.navn : ""}
            </BodyShort>
            <Detail>{selectedEnhet ? "Enhet: " + selectedEnhet.enhetNr + ' - ' + selectedEnhet.navn : ""}</Detail>
            <ActionMenu.Divider/>
            {enheter?.map((e) => {
              return(
                <ActionMenuItem
                  onSelect={() => setSelected(e)}
                  className={e.enhetNr === selectedEnhet?.enhetNr ? "selectedEnhet" : ""}
                  icon={e.erFavoritt ? <StarFillIcon/> : <StarIcon/>}
                >
                  {e.enhetNr + " - " + e.navn}
                </ActionMenuItem>)
            })}
          </ActionMenu.Content>
        </ActionMenu>
        <InternalHeader.Button>
          {selectedEnhet?.erFavoritt &&
            <StarFillIcon
              style={{fontSize: "1.5rem"}}
              title={"Fjern som favorittenhet"}
              onClick={() => setFavourite(undefined)}
            />
          }
          {!selectedEnhet?.erFavoritt &&
            <StarIcon
              style={{fontSize: "1.5rem"}}
              title={"Merk enheten som favorittenhet"}
              onClick={() => setFavourite(selectedEnhet)}
            />
          }
        </InternalHeader.Button>
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
