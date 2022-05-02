import { ErrorFilled, NextFilled, SuccessFilled } from '@navikt/ds-icons'
import { BodyLong } from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import { FlexCenterDiv, FlexCenterSpacedDiv, HorizontalSeparatorDiv, PileCenterDiv, PileDiv } from '@navikt/hoykontrast'
import { finishMenuStatistic, logMenuStatistic, startMenuStatistic } from 'actions/statistics'
import { Form } from 'applications/SvarSed/TwoLevelForm'
import classNames from 'classnames'
import { WithErrorPanel } from 'components/StyledComponents'
import { ErrorElement } from 'declarations/app.d'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { UpdateReplySedPayload, Validation } from 'declarations/types'
import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled, { keyframes } from 'styled-components'

const transitionTime = 0.3

const LeftDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  min-width: 300px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`
const RightDiv = styled.div`
  flex: 3;
  align-self: stretch;
  position: relative;
  overflow: hidden;
  width: 780px;
`
const RightActiveDiv = styled.div`
  border-width: 1px;
  border-style: solid;
  border-color: var(--navds-panel-color-border);
  background-color: var(--navds-semantic-color-canvas-background-light);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  height: 100%;
  margin-left: -1px;
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
const NameAndOptionsDiv = styled(PileDiv)`
 &.whiteborder {
    border-right: 1px solid var(--navds-panel-color-background);
    margin-right: -1px;
 }
 background-color: var(--navds-semantic-color-canvas-background-light);
 border-top: 1px solid var(--navds-panel-color-border);
 border-right: 1px solid var(--navds-panel-color-border);
 border-width: 1px;
 border-bottom-width: 0px;
 border-style: solid;
 border-color: var(--navds-panel-color-border);
`
const MenuLabelText = styled(BodyLong)`
  font-weight: bold;
`
const NameDiv = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 1rem 0.5rem;
  transition: all 0.2s ease-in-out;
  &:hover {
   color: var(--navds-semantic-color-text-inverted);
   background-color: var(--navds-semantic-color-interaction-primary-hover);
  }
`
const NameLabelDiv = styled(FlexCenterDiv)`
  flex: 1;
`
const MenuArrowDiv = styled.div`
 padding: 0rem 0.5rem;
`
const LastDiv = styled.div`
  flex: 1;
  border-top: 1px solid var(--navds-panel-color-border);
  border-right: 1px solid var(--navds-panel-color-border);
`
const BlankDiv = styled(PileCenterDiv)`
  border-width: 1px;
  border-style: solid;
  border-color: var(--navds-panel-color-border);
  background-color: var(--navds-semantic-color-canvas-background-light);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  margin-left: -1px;
  height: 100%;
`
const BlankContentDiv = styled(FlexCenterDiv)`
  flex: 1;
  align-self: center;
`
export interface _OneLevelFormProps {
  forms: Array<Form>
  replySed: ReplySed | null | undefined
  setReplySed: (replySed: ReplySed) => ActionWithPayload<ReplySed>
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
  viewValidation: boolean
  target?: string
  loggingTarget?: string
}

export interface OneLevelFormSelector {
  validation: Validation
}

export interface OneLevelFormProps {
  parentNamespace: string
  replySed: ReplySed | null | undefined
  setReplySed: (replySed: ReplySed) => ActionWithPayload<ReplySed>
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
}

export const mapState = (state: State): OneLevelFormSelector => ({
  validation: state.validation.status
})

const OneLevelForm: React.FC<_OneLevelFormProps> = ({
  forms,
  replySed,
  setReplySed,
  updateReplySed,
  viewValidation,
  loggingTarget
}: _OneLevelFormProps) => {
  const { t } = useTranslation()
  const { validation }: any = useAppSelector(mapState)

  const dispatch = useAppDispatch()
  const namespace = 'MainForm'

  const [animatingMenus, setAnimatingMenus] = useState<boolean>(false)
  const initialMenu: string | undefined = forms.length === 1 ? forms[0].value : undefined
  const [currentMenu, _setCurrentMenu] = useState<string | undefined>(initialMenu)
  const [previousMenu, setPreviousMenu] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (loggingTarget && !_.isNil(initialMenu)) {
      dispatch(startMenuStatistic(loggingTarget, initialMenu))
    }
    return () => {
      if (loggingTarget) {
        dispatch(finishMenuStatistic(loggingTarget))
      }
    }
  }, [])

  const setCurrentMenu = (newMenu: string | undefined) => {
    if (loggingTarget) {
      dispatch(logMenuStatistic(loggingTarget, currentMenu, newMenu))
    }
    _setCurrentMenu(newMenu)
  }

  const menuRef = useRef(currentMenu)

  const getForm = (value: string): JSX.Element | null => {
    const form: Form | undefined = _.find(forms, o => o.value === value)
    if (form) {
      const Component = form.component
      return (
        <Component
          parentNamespace={namespace}
          replySed={replySed}
          setReplySed={setReplySed}
          updateReplySed={updateReplySed}
        />
      )
    }
    return null
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

  return (
    <WithErrorPanel border className={classNames({ error: validation[namespace]?.feilmelding })}>
      <FlexCenterSpacedDiv>
        <LeftDiv>
          {forms.filter(o => _.isFunction(o.condition) ? o.condition() : true).map((form) => {
            const selected: boolean = currentMenu === form.value
            return (
              <NameAndOptionsDiv
                key={form.value}
                className={classNames({ whiteborder: selected })}
              >
                <NameDiv>
                  <NameLabelDiv
                    onClick={() => {
                      changeMenu(form.value)
                      return false
                    }}
                    className={classNames({ selected })}
                  >
                    {viewValidation && (
                      validation[namespace + '-' + form.value]
                        ? (
                          <>
                            <ErrorFilled height={20} color='red' />
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
                      <MenuLabelText className={classNames({ selected })}>
                        {t('label:' + form.value.replaceAll('_', '-'))}
                      </MenuLabelText>
                    </>
                  </NameLabelDiv>
                  <MenuArrowDiv>
                    <NextFilled />
                  </MenuArrowDiv>
                </NameDiv>
              </NameAndOptionsDiv>
            )
          }
          )}
          <LastDiv />
        </LeftDiv>
        <RightDiv className='mainright'>
          {!currentMenu && (
            <BlankDiv>
              <BlankContentDiv>
                {t('label:velg-formål')}
              </BlankContentDiv>
            </BlankDiv>
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
  )
}

export default OneLevelForm
