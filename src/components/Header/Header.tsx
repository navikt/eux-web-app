import { ChevronLeftIcon, ExternalLinkIcon, MenuGridIcon, StarFillIcon, StarIcon, WrenchIcon } from '@navikt/aksel-icons'
import { State } from 'declarations/reducers'
import {Enhet, Enheter, Saksbehandler} from 'declarations/types'
import {ActionMenu, BodyShort, Button, Detail, Heading, HStack, InternalHeader, Spacer} from '@navikt/ds-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import {appReset, setFavouriteEnhet, setSelectedEnhet} from 'actions/app'
import {NavLink} from "react-router-dom";
import {FeatureToggles} from "../../declarations/app";
import styles from './Header.module.css';

export interface HeaderSelector {
  saksbehandler: Saksbehandler | undefined
  enheter: Enheter | null | undefined
  selectedEnhet: Enhet | null | undefined
  featureToggles: FeatureToggles | null | undefined
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
  featureToggles: state.app.featureToggles
})

const Header: React.FC<HeaderProps> = ({
  backButton,
  onGoBackClick,
  title
}: HeaderProps): JSX.Element => {
  const { saksbehandler, enheter, selectedEnhet, featureToggles }: HeaderSelector = useAppSelector(mapState)
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
      <InternalHeader className={styles.internalHeader}>
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
            {featureToggles?.featureAdmin &&
              <>
                <ActionMenu.Divider />
                <ActionMenu.Group label="Administrative verktøy">
                  <ActionMenu.Item as="a" href={"/admin"} icon={<WrenchIcon aria-hidden/>}>
                    Publiser SED hendelser
                  </ActionMenu.Item>
                </ActionMenu.Group>
              </>
            }
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
                <ActionMenu.Item
                  onSelect={() => setSelected(e)}
                  className={e.enhetNr === selectedEnhet?.enhetNr ? styles.selectedEnhet : ""}
                  icon={e.erFavoritt ? <StarFillIcon/> : <StarIcon/>}
                >
                  {e.enhetNr + " - " + e.navn}
                </ActionMenu.Item>)
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
      </InternalHeader>
      {backButton && (
        <header className={styles.headerContent}>
          <Button
            variant='secondary'
            onClick={onGoBackClick}
            icon={<ChevronLeftIcon/>}
            size="small"
          >
            {t('label:tilbake')}
          </Button>
        </header>
      )}
    </>
  )
}

export default Header
