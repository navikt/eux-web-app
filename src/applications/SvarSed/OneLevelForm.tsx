import { ActionWithPayload } from '@navikt/fetch'
import { finishMenuStatistic, logMenuStatistic, startMenuStatistic } from 'actions/statistics'
import Kontoopplysning from 'applications/SvarSed/BottomForm/Kontoopplysning/Kontoopplysning'
import KravOmRefusjon from 'applications/SvarSed/BottomForm/KravOmRefusjon/KravOmRefusjon'
import Motregning from 'applications/SvarSed/BottomForm/Motregning/Motregning'
import ProsedyreVedUenighet from 'applications/SvarSed/BottomForm/ProsedyreVedUenighet/ProsedyreVedUenighet'
import Vedtak from 'applications/SvarSed/BottomForm/Vedtak/Vedtak'
import { NextFilled, ErrorFilled, SuccessFilled } from '@navikt/ds-icons'
import { BodyLong, Heading } from '@navikt/ds-react'
import classNames from 'classnames'
import { WithErrorPanel } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { FSed, ReplySed } from 'declarations/sed'
import { UpdateReplySedPayload, Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import {
  FlexCenterDiv,
  FlexCenterSpacedDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes } from 'styled-components'

const transitionTime = 0.3

const LeftDiv = styled.div`
  flex: 1;
  align-self: stretch;
  min-width: 300px;
  border-right: 1px solid var(--navds-semantic-color-border);
  border-width: 1px;
  border-style: solid;
  border-color: var(--navds-panel-color-border);
  background-color: var(--navds-semantic-color-component-background-alternate);
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
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
   background-color: var(--navds-semantic-color-interaction-primary-hover);
  }
   &.selected {
    font-weight: bold;
    background-color: var(--navds-semantic-color-component-background-alternate);
     border-left: 6px solid var(--navds-semantic-color-interaction-primary);
  }
`
const RightDiv = styled.div`
  flex: 3;
  border-left: 1px solid var(--navds-panel-color-border);
  margin-left: -1px;
  align-self: stretch;
  position: relative;
  overflow: hidden;
`
const RightActiveDiv = styled.div`
  border-width: 1px;
  border-style: solid;
  border-left-width: 0;
  border-color: var(--navds-panel-color-border);
  background-color: var(--navds-semantic-color-component-background-alternate);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: var(--navds-semantic-color-component-background-alternate);
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
const MenuLabelText = styled(BodyLong)`
  &.selected {
    font-weight: bold;
  }
`

export interface _OneLevelFormProps {
  replySed: ReplySed | null | undefined
  setReplySed: (replySed: ReplySed) => ActionWithPayload<ReplySed>
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
  viewValidation: boolean
}

export interface OneLevelFormSelector {
  validation: Validation
}

export interface OneLevelFormProps {
  parentNamespace: string
  replySed: ReplySed | null | undefined
  setReplySed: (replySed: ReplySed) => ActionWithPayload<ReplySed>
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
  seeKontoopplysninger?: () => void
}

export const mapState = (state: State): OneLevelFormSelector => ({
  validation: state.validation.status
})

const OneLevelForm: React.FC<_OneLevelFormProps> = ({
  replySed,
  setReplySed,
  updateReplySed,
  viewValidation
}: _OneLevelFormProps) => {
  const { t } = useTranslation()
  const {
    validation
  }: any = useSelector<State, OneLevelFormSelector>(mapState)

  const dispatch = useDispatch()
  const namespace = 'BottomForm'
  const target = 'formaal'
  const initialSelectedMenus: Array<string> = _.get(replySed, target)

  const [animatingMenus, setAnimatingMenus] = useState<boolean>(false)
  const initialMenu: string | undefined = initialSelectedMenus.length === 1 ? initialSelectedMenus[0] : undefined
  const [currentMenu, _setCurrentMenu] = useState<string | undefined>(initialMenu)
  const [previousMenu, setPreviousMenu] = useState<string | undefined>(undefined)
  const [_viewKontoopplysninger, setViewKontoopplysninger] = useState<boolean>(false)

  useEffect(() => {
    if (!_.isNil(initialMenu)) {
      dispatch(startMenuStatistic('formalmanager', initialMenu))
    }
    return () => {
      dispatch(finishMenuStatistic('formalmanager'))
    }
  }, [])

  const setCurrentMenu = (newMenu: string | undefined) => {
    dispatch(logMenuStatistic('formalmanager', currentMenu, newMenu))
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
        replySed={replySed}
        setReplySed={setReplySed}
        updateReplySed={updateReplySed}
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
    const error: ErrorElement = e.detail
    const namespaceBits = error.skjemaelementId.split('-')
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
        const element = document.getElementById(error.skjemaelementId)
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
      <Heading size='small'>
        {t('label:BottomForm')}
      </Heading>
      <VerticalSeparatorDiv />
      <WithErrorPanel border className={classNames({ error: validation[namespace]?.feilmelding })}>
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
                    className={classNames({
                      selected: currentMenu === menu
                    })}
                  >
                    <NextFilled />
                    <HorizontalSeparatorDiv size='0.5' />
                    {viewValidation && (
                      validation[namespace + '-' + menu]
                        ? (
                          <>
                            <ErrorFilled color='red' />
                            <HorizontalSeparatorDiv size='0.5' />
                          </>
                          )
                        : (
                          <>
                            <SuccessFilled color='green' height={20} />
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

export default OneLevelForm
