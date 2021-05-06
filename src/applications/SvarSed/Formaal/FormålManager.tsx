import Kontoopplysning from 'applications/SvarSed/Formaal/Kontoopplysning/Kontoopplysning'
import KravOmRefusjon from 'applications/SvarSed/Formaal/KravOmRefusjon/KravOmRefusjon'
import Motregning from 'applications/SvarSed/Formaal/Motregning/Motregning'
import ProsedyreVedUenighet from 'applications/SvarSed/Formaal/ProsedyreVedUenighet/ProsedyreVedUenighet'
import Vedtak from 'applications/SvarSed/Formaal/Vedtak/Vedtak'
import GreenCircle from 'assets/icons/GreenCircle'
import RemoveCircle from 'assets/icons/RemoveCircle'
import classNames from 'classnames'
import { WithErrorPanel } from 'components/StyledComponents'
import { FSed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import Chevron from 'nav-frontend-chevron'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst } from 'nav-frontend-typografi'
import { HorizontalSeparatorDiv, FlexCenterDiv, FlexCenterSpacedDiv, PileCenterDiv, PileDiv, theme, themeHighContrast, themeKeys, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { keyframes } from 'styled-components'

const transitionTime = 0.3

const LeftDiv = styled.div`
  flex: 1;
  align-self: stretch;
  min-width: 300px;
  border-right: 1px solid ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_COLOR]};
  border-width: ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_WIDTH]};
  border-style: solid;
  border-color: ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_COLOR]};
  background-color: ${({ theme }: any) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  border-top-left-radius: ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_RADIUS]};
  border-bottom-left-radius: ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_RADIUS]};
`
const MenuDiv = styled.div`
  display: flex;
  justify-content: space-between;
  .skjemaelement {
     display: flex;
  }
`
const MenuLabelDiv = styled(FlexCenterDiv)`
  cursor: pointer;
  padding: 1rem 0.5rem;
  flex: 1;
  transition: all 0.2s ease-in-out;
  &:hover {
   background-color: ${(props: any) => props['data-highContrast']
     ? themeHighContrast[themeKeys.ALTERNATIVE_HOVER_COLOR]
     : theme[themeKeys.ALTERNATIVE_HOVER_COLOR]};
  }
   &.selected {
    font-weight: bold;
    background-color: ${(props: any) => props['data-highContrast']
  ? themeHighContrast[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]
  : theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
     border-left: 6px solid ${(props: any) => props['data-highContrast']
  ? themeHighContrast[themeKeys.MAIN_INTERACTIVE_COLOR]
  : theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
  }
`
const RightDiv = styled.div`
  flex: 3;
  border-left: 1px solid ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_COLOR]};
  margin-left: -1px;
  align-self: stretch;
  position: relative;
  overflow: hidden;
`
const RightActiveDiv = styled.div`
  border-width: ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_WIDTH]};
  border-style: solid;
  border-left-width: 0;
  border-color: ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_COLOR]};
  background-color: ${({ theme }: any) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  border-top-right-radius: ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_RADIUS]};
  border-bottom-right-radius: ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_RADIUS]};
  background-color: ${({ theme }: any) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  height: 100%;
`
const slideIn = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0%);
  }
`

const slideOut = keyframes`
  100% {
    left: -100%;
    right: 100%;
  }
  0% {
    left: 0%;
    right: 0%;
  }
`
const ActiveFormDiv = styled(RightActiveDiv)`
  &.animating {
    will-change: transform;
    position: relative;
    transform: translateX(-100%);
    animation: ${slideIn} ${transitionTime}s forwards;
  }
`

const PreviousFormDiv = styled(RightActiveDiv)`
  &.animating {
    will-change: left, right;
    position: absolute;
    top: 0px;
    left: 0%;
    right: 0%;
    animation: ${slideOut} ${transitionTime}s forwards;
  }
  &:not(.animating) {
    display: none;
  }
`
const MenuLabelText = styled(Normaltekst)`
  &.selected {
    font-weight: bold;
  }
`

export interface FormålManagerProps {
  fnr: string
  highContrast: boolean
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation,
  viewValidation: boolean
}

const FormålManager: React.FC<FormålManagerProps> = ({
  highContrast,
  replySed,
  resetValidation,
  updateReplySed,
  validation,
  viewValidation
}: FormålManagerProps) => {
  const { t } = useTranslation()
  const namespace = 'formålmanager'

  const initialSelectedMenus: Array<string> = _.get(replySed, 'formaal')

  const [animatingMenus, setAnimatingMenus] = useState<boolean>(false)

  const [previousMenu, setPreviousMenu] = useState<string | undefined>(undefined)
  const [currentMenu, setCurrentMenu] = useState<string | undefined>(initialSelectedMenus.length === 1 ? initialSelectedMenus[0] : undefined)

  const [_viewKontoopplysninger, setViewKontoopplysninger] = useState<boolean>(false)

  const getForm = (menu: string): JSX.Element => (
    <>
      {menu === 'vedtak' && (
        <>
          <Vedtak
            highContrast={highContrast}
            replySed={replySed}
            resetValidation={resetValidation}
            updateReplySed={updateReplySed}
            validation={validation}
          />
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      {menu === 'motregning' && (
        <>
          <Motregning
            highContrast={highContrast}
            replySed={replySed}
            resetValidation={resetValidation}
            seeKontoopplysninger={() => setViewKontoopplysninger(true)}
            updateReplySed={updateReplySed}
            validation={validation}
          />
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      {menu === 'prosedyre_ved_uenighet' && (
        <>
          <ProsedyreVedUenighet
            highContrast={highContrast}
            replySed={replySed}
            resetValidation={resetValidation}
            updateReplySed={updateReplySed}
            validation={validation}
          />
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      {menu === 'refusjon_i_henhold_til_artikkel_58_i_forordningen' && (
        <>
          <KravOmRefusjon
            highContrast={highContrast}
            replySed={replySed}
            resetValidation={resetValidation}
            seeKontoopplysninger={() => setViewKontoopplysninger(true)}
            updateReplySed={updateReplySed}
            validation={validation}
          />
          <VerticalSeparatorDiv size='2' />
        </>
      )}

      {menu === 'kontoopplysninger' && (
        <>
          <Kontoopplysning
            highContrast={highContrast}
            replySed={replySed}
            resetValidation={resetValidation}
            updateReplySed={updateReplySed}
            validation={validation}
          />
          <VerticalSeparatorDiv size='2' />
        </>
      )}
    </>
  )

  const changeMenu = (menu: string) => {
    if (currentMenu !== menu) {
      setPreviousMenu(currentMenu)
      setCurrentMenu(menu)
      setAnimatingMenus(true)
      setTimeout(() => {
        setPreviousMenu(menu)
        setAnimatingMenus(false)
      }, 1000)
    }
  }

  const handleEvent = (e: any) => {
    const feil: FeiloppsummeringFeil = e.detail
    const namespaceBits = feil.skjemaelementId.split('-')
    if (namespaceBits[0] === namespace) {
      const who = namespaceBits[1]
      changeMenu(who)
      setTimeout(() => {
        const element = document.getElementById(feil.skjemaelementId)
        element?.scrollIntoView({
          behavior: 'smooth'
        })
        element?.focus()
      }, 200)
    }
  }

  useEffect(() => {
    document.addEventListener('feillenke', handleEvent)
    return () => {
      document.removeEventListener('feillenke', handleEvent)
    }
  }, [])

  const menus: Array<string> = _.cloneDeep((replySed as FSed)?.formaal) || []
  if (_viewKontoopplysninger) {
    menus.push('kontoopplysninger')
  }

  return (
    <PileDiv>
      <VerticalSeparatorDiv />
      <WithErrorPanel className={classNames({ feil: validation[namespace]?.feilmelding })}>
        <FlexCenterSpacedDiv>
          <LeftDiv>
            {menus.map((menu, index) => (
              <PileDiv key={menu}>
                <MenuDiv
                  data-highContrast={highContrast}
                >
                  <MenuLabelDiv
                    onClick={() => {
                      changeMenu(menu)
                      return false
                    }}
                    style={{ animationDelay: index * 0.1 + 's' }}
                    className={classNames({
                      slideInFromLeft: true,
                      selected: currentMenu === menu
                    })}
                  >
                    <Chevron type='høyre' />
                    <HorizontalSeparatorDiv size='0.5' />
                    {viewValidation && (
                      validation[namespace + '-' + menu]
                        ? (
                          <>
                            <RemoveCircle color='red' />
                            <HorizontalSeparatorDiv size='0.5' />
                          </>
                          )
                        : (
                          <>
                            <GreenCircle />
                            <HorizontalSeparatorDiv size='0.5' />
                          </>
                          )
                    )}
                    <>
                      <MenuLabelText className={classNames({ selected: currentMenu === menu })}>
                        {t('label:' + menu.replaceAll('_', '-'))}
                      </MenuLabelText>
                    </>
                  </MenuLabelDiv>
                </MenuDiv>
              </PileDiv>
            ))}
            <VerticalSeparatorDiv />
          </LeftDiv>
          <RightDiv>
            {!currentMenu && (
              <PileCenterDiv style={{ height: '100%' }}>
                <FlexCenterDiv style={{ flex: '1', alignSelf: 'center' }}>
                  {t('label:velg-formål')}
                </FlexCenterDiv>
              </PileCenterDiv>
            )}
            {previousMenu && (
              <PreviousFormDiv
                className={classNames({ animating: animatingMenus })}
                key={previousMenu}
              >
                {getForm(previousMenu)}
              </PreviousFormDiv>
            )}
            {currentMenu && (
              <ActiveFormDiv
                className={classNames({ animating: animatingMenus })}
                key={currentMenu + '-' + currentMenu}
              >
                {getForm(currentMenu)}
              </ActiveFormDiv>
            )}
          </RightDiv>
        </FlexCenterSpacedDiv>
      </WithErrorPanel>
    </PileDiv>
  )
}

export default FormålManager
