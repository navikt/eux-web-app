import Kontoopplysning from 'applications/SvarSed/Formaal/Kontoopplysning/Kontoopplysning'
import KravOmRefusjon from 'applications/SvarSed/Formaal/KravOmRefusjon/KravOmRefusjon'
import Motregning from 'applications/SvarSed/Formaal/Motregning/Motregning'
import ProsedyreVedUenighet from 'applications/SvarSed/Formaal/ProsedyreVedUenighet/ProsedyreVedUenighet'
import Vedtak from 'applications/SvarSed/Formaal/Vedtak/Vedtak'
import GreenCircle from 'assets/icons/GreenCircle'
import RemoveCircle from 'assets/icons/RemoveCircle'
import classNames from 'classnames'
import { WithErrorPanel } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { FSed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import Chevron from 'nav-frontend-chevron'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  FlexCenterDiv,
  FlexCenterSpacedDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  themeKeys,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
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
   background-color: ${({ theme }: any) => theme[themeKeys.ALTERNATIVE_HOVER_COLOR]};
  }
   &.selected {
    font-weight: bold;
    background-color: ${({ theme }: any) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
     border-left: 6px solid ${({ theme }: any) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
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

export interface FormålManagerFormSelector {
  replySed: ReplySed | undefined
  validation: Validation
  viewValidation: boolean
}

export interface FormålManagerFormProps {
  parentNamespace: string
  seeKontoopplysninger: () => void
}

const mapState = (state: State): FormålManagerFormSelector => ({
  replySed: state.svarpased.replySed,
  validation: state.validation.status,
  viewValidation: state.validation.view
})

const FormålManager: React.FC = () => {
  const { t } = useTranslation()
  const {
    replySed,
    validation,
    viewValidation
  }: any = useSelector<State, FormålManagerFormSelector>(mapState)
  const namespace = 'formålmanager'
  const target = 'formaal'
  const initialSelectedMenus: Array<string> = _.get(replySed, target)

  const [animatingMenus, setAnimatingMenus] = useState<boolean>(false)
  const initialMenu: string | undefined = initialSelectedMenus.length === 1 ? initialSelectedMenus[0] : undefined
  const [currentMenu, _setCurrentMenu] = useState<string | undefined>(initialMenu)
  const [previousMenu, setPreviousMenu] = useState<string | undefined>(undefined)
  const [_viewKontoopplysninger, setViewKontoopplysninger] = useState<boolean>(false)

  const [statistics, _setStatistics] = useState<any>({})

  useEffect(() => {
    if (!_.isNil(initialMenu)) {
      _setStatistics({
        [initialMenu]: { total: 0, status: 'stop' }
      })
    }
    return () => {
      standardLogger('svarsed.editor.formålmanager.time', statistics)
    }
  }, [])

  const setCurrentMenu = (newMenu: string | undefined) => {
    const previousMenu = currentMenu
    const newStatistics = _.cloneDeep(statistics)

    if (!_.isNil(previousMenu) && newStatistics[previousMenu].status === 'start') {
      const diff = new Date().getTime() - newStatistics[previousMenu].date.getTime()
      const diffSeconds = Math.ceil(diff / 1000)
      newStatistics[previousMenu] = {
        date: undefined,
        status: 'stop',
        total: statistics[previousMenu].total += diffSeconds
      }
    }
    if (!_.isNil(newMenu)) {
      newStatistics[newMenu] = {
        date: new Date(),
        status: 'start',
        total: statistics[newMenu]?.total ?? 0
      }
    }
    _setStatistics(newStatistics)
    _setCurrentMenu(newMenu)
  }

  const menuRef = useRef(currentMenu)

  const options: any = {
    vedtak: Vedtak,
    motregning: Motregning,
    prosedyre_ved_uenighet: ProsedyreVedUenighet,
    refusjon_i_henhold_til_artikkel_58_i_forordningen: KravOmRefusjon,
    kontoopplysninger: Kontoopplysning
  }

  const getForm = (value: string): JSX.Element | null => {
    const Component = options[value]
    return (
      <Component
        parentNamespace={namespace}
        seeKontoopplysninger={() => {
          setViewKontoopplysninger(true)
          document.dispatchEvent(new CustomEvent('switch', { detail: namespace + '-kontoopplysninger' }))
        }}
      />
    )
  }

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
    menuRef.current = menu
  }

  const handleFeilLenkeEvent = (e: any) => {
    const feil: FeiloppsummeringFeil = e.detail
    const namespaceBits = feil.skjemaelementId.split('-')
    if (namespaceBits[0] === namespace) {
      const newMenu = namespaceBits[1]
      const currentMenu = menuRef.current
      if (newMenu === 'kontoopplysninger') {
        setViewKontoopplysninger(true)
      }
      if (newMenu !== currentMenu) {
        changeMenu(newMenu)
      }
      setTimeout(() => {
        const element = document.getElementById(feil.skjemaelementId)
        element?.focus()
        element?.closest('.mainright')?.scrollIntoView({
          behavior: 'smooth'
        })
        element?.focus()
      }, 200)
    }
  }

  const handleSwitchEvent = (e: any) => {
    const namespaceBits = e.detail.split('-')
    if (namespaceBits[0] === namespace) {
      const newMenu = namespaceBits[1]
      const currentMenu = menuRef.current
      if (newMenu === 'kontoopplysninger') {
        setViewKontoopplysninger(true)
      }
      if (newMenu !== currentMenu) {
        changeMenu(newMenu)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('feillenke', handleFeilLenkeEvent)
    document.addEventListener('switch', handleSwitchEvent)
    return () => {
      document.removeEventListener('feillenke', handleFeilLenkeEvent)
      document.removeEventListener('switch', handleSwitchEvent)
    }
  }, [])

  const menus: Array<string> = [];
  ((replySed as FSed)?.formaal).forEach(f => {
    if (Object.keys(options).indexOf(f) >= 0) {
      menus.push(f)
    }
  })

  if (_viewKontoopplysninger) {
    menus.push('kontoopplysninger')
  }

  return (
    <PileDiv>
      <Undertittel>
        {t('label:formålmanager')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <WithErrorPanel border className={classNames({ feil: validation[namespace]?.feilmelding })}>
        <FlexCenterSpacedDiv>
          <LeftDiv>
            {menus.map((menu, index) => (
              <PileDiv key={menu}>
                <MenuDiv>
                  <MenuLabelDiv
                    onClick={() => {
                      changeMenu(menu)
                      return false
                    }}
                    style={{ animationDelay: menu === 'kontoopplysninger' ? '0s' : index * 0.1 + 's' }}
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
                            <RemoveCircle height={20} color='red' />
                            <HorizontalSeparatorDiv size='0.5' />
                          </>
                          )
                        : (
                          <>
                            <GreenCircle height={20} />
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
          <RightDiv className='mainright'>
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
