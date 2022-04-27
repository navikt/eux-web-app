import {
  AddCircle,
  Child,
  EllipsisCircleH,
  ErrorFilled,
  ExpandFilled,
  NextFilled,
  SuccessFilled
} from '@navikt/ds-icons'
import { BodyLong, Button } from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import {
  FlexCenterDiv,
  FlexCenterSpacedDiv,
  HorizontalSeparatorDiv,
  PaddedHorizontallyDiv,
  PileCenterDiv,
  PileDiv
} from '@navikt/hoykontrast'
import { finishMenuStatistic, logMenuStatistic, startMenuStatistic } from 'actions/statistics'
import AddPersonModal from 'applications/SvarSed/MainForm/AddPersonModal/AddPersonModal'
import classNames from 'classnames'
import { HorizontalLineSeparator, WithErrorPanel } from 'components/StyledComponents'
import { Option } from 'declarations/app'
import { ErrorElement } from 'declarations/app.d'
import { PDU1, Pdu1Person } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { F002Sed, FSed, PersonInfo, ReplySed } from 'declarations/sed'
import { StorageTypes, UpdateReplySedPayload, Validation } from 'declarations/types'
import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled, { keyframes } from 'styled-components'
import { isFSed } from 'utils/sed'

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
 }
 background-color: var(--navds-semantic-color-canvas-background-light);
 border-top: 1px solid var(--navds-panel-color-border);
 border-right: 1px solid var(--navds-panel-color-border);
 border-width: 1px;
 border-bottom-width: 0px;
 border-style: solid;
 border-color: var(--navds-panel-color-border);
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
const OptionDiv = styled.div`
  transition: all 0.2s ease-in-out;
  padding: 0.5rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    color: var(--navds-semantic-color-text-inverted);
    background-color: var(--navds-semantic-color-interaction-primary-hover);
  }
  &.selected {
    font-weight: bold;
    border-top: 1px solid var(--navds-panel-color-border);
    border-bottom: 1px solid var(--navds-panel-color-border);
    border-left: 6px solid var(--navds-semantic-color-interaction-primary-selected);
  }
  &.whiteborder {
    border-right: 1px solid var(--navds-panel-color-background);
    margin-right: -1px;
  }
  &.first {
    margin-top: -1px;
  }
`
const LastDiv = styled.div`
  flex: 1;
  padding: 1rem 0.5rem;
  border-top: 1px solid var(--navds-panel-color-border);
  border-right: 1px solid var(--navds-panel-color-border);
  border-right-width: ${(props: any) => props['data-empty-right-div'] === true ? '0px' : '1px'};
`
const LandSpan = styled.span`
  color: grey;
  white-space: nowrap;
`
const MenuLabelText = styled(BodyLong)`
  font-weight: bold;
`
const MenuArrowDiv = styled.div`
 padding: 0rem 0.5rem;
`

export interface _TwoLevelFormProps<T> {
  forms: Array<Form>
  replySed: T | null | undefined
  viewValidation: boolean
  setReplySed: (replySed: T, flagItAsUnsaved?: boolean) => ActionWithPayload<T>
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
  namespace: string
  loggingNamespace: string
}

export interface TwoLevelFormProps {
  replySed: ReplySed | PDU1 | null | undefined
  parentNamespace: string
  personID: string | undefined
  personName: string
  setReplySed: (replySed: ReplySed | PDU1, flagItAsUnsaved?: boolean) => ActionWithPayload<ReplySed | PDU1>
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
  options ?: any
}

export interface TwoLevelFormSelector {
  validation: Validation
}

export interface Form extends Option {
  component: any
  type?: string | Array<string>
  barn?: boolean
  family?: boolean
  condition ?: () => void
  options?: any
}

export const mapState = (state: State): TwoLevelFormSelector => ({
  validation: state.validation.status
})

const TwoLevelForm = <T extends StorageTypes>({
  forms,
  replySed,
  setReplySed,
  updateReplySed,
  viewValidation,
  namespace,
  loggingNamespace
}: _TwoLevelFormProps<T>) => {
  const { t } = useTranslation()
  const { validation }: any = useAppSelector(mapState)

  const dispatch = useAppDispatch()
  const brukerNr = 1
  const ektefelleNr = brukerNr + ((replySed as F002Sed)?.ektefelle ? 1 : 0)
  const annenPersonNr = ektefelleNr + ((replySed as F002Sed)?.annenPerson ? 1 : 0)
  const totalPeopleNr = annenPersonNr + ((replySed as F002Sed)?.barn?.length ?? 0)

  // list of open menus (= persons). If SED only has one person (bruker), open it by default
  const [openMenus, setOpenMenus] = useState<Array<string>>(() => totalPeopleNr === 1 ? ['bruker'] : [])

  const [_seeNewPersonModal, setSeeNewPersonModal] = useState<boolean>(false)
  const [animatingMenus, setAnimatingMenus] = useState<boolean>(false)

  const [previousMenu, setPreviousMenu] = useState<string | undefined>(undefined)
  const [currentMenu, setCurrentMenu] = useState<string | undefined>(totalPeopleNr === 1 ? 'bruker' : undefined)
  const [focusedMenu, setFocusedMenu] = useState<string | undefined>(totalPeopleNr === 1 ? 'bruker' : undefined)
  const [currentMenuLabel, setCurrentMenuLabel] = useState<string | undefined>(undefined)
  const [previousMenuOption, setPreviousMenuOption] = useState<string | undefined>(undefined)
  const [currentMenuOption, _setCurrentMenuOption] = useState<string | undefined>(undefined)
  const alreadyOpenMenu = (menu: string) => _.find(openMenus, _id => _id === menu) !== undefined

  useEffect(() => {
    dispatch(startMenuStatistic(loggingNamespace, undefined))
    return () => {
      dispatch(finishMenuStatistic(loggingNamespace))
    }
  }, [])

  const setCurrentMenuOption = (newMenu: string | undefined) => {
    dispatch(logMenuStatistic(loggingNamespace, currentMenuOption, newMenu))
    _setCurrentMenuOption(newMenu)
  }

  const menuRef = useRef(currentMenu + '|' + currentMenuOption)

  const getForm = (value: string): JSX.Element | null => {
    const form: Form | undefined = _.find(forms, o => o.value === value)
    if (form) {
      const Component = form.component
      return (
        <Component
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
          replySed={replySed}
          setReplySed={setReplySed}
          updateReplySed={updateReplySed}
          options={form.options ?? {}}
        />
      )
    }
    return null
  }

  const getPersonName = (replySed: ReplySed | PDU1 | null | undefined, personId: string) => {
    const p = _.get(replySed, personId)
    if (p) {
      if (p.personInfo) {
        return p.personInfo.fornavn + ' ' + (p.personInfo.etternavn ?? '')
      } else {
        return (replySed?.bruker as Pdu1Person)?.fornavn + ' ' + ((replySed?.bruker as Pdu1Person)?.etternavn ?? '')
      }
    }
    return '-'
  }

  const changeMenu = (menu: string, menuOption: string | undefined, from: 'event' | 'click') => {
    const changedMenu: boolean = currentMenu !== menu
    const changedMenuOption: boolean =
      !_.isNil(menuOption)
        ? ((menuOption !== currentMenuOption) || (menuOption === currentMenuOption && changedMenu))
        : false

    if (changedMenu) {
      setFocusedMenu(menu)
      if (changedMenuOption) {
        setPreviousMenu(currentMenu)
        setCurrentMenu(menu)
      }
    }

    if (!changedMenuOption) {
      if (!alreadyOpenMenu(menu)) {
        setOpenMenus(openMenus.concat(menu))
      } else {
        setOpenMenus(_.filter(openMenus, _id => _id !== menu))
      }
    } else {
      if (from === 'event') {
        if (!alreadyOpenMenu(menu)) {
          setOpenMenus(openMenus.concat(menu))
        }
      }

      if (menu !== 'familie') {
        const personName = getPersonName(replySed, menu)
        setCurrentMenuLabel(personName)
      } else {
        setCurrentMenuLabel(t('label:hele-familien'))
      }

      setPreviousMenuOption(currentMenuOption)
      setAnimatingMenus(true)
      setTimeout(() => {
        setPreviousMenuOption(menuOption)
        setAnimatingMenus(false)
      }, transitionTime * 1000)
      if (menuOption) {
        setCurrentMenuOption(menuOption)
      } else {
        setCurrentMenuOption(menu === 'familie'
          ? _.find(forms, o => o.family === true)?.value
          : forms[0].value
        )
      }
    }
    menuRef.current = menu + '|' + menuOption
  }

  const onAddNewPerson = () => {
    setSeeNewPersonModal(true)
  }

  const renderMenu = (replySed: ReplySed | PDU1, personId: string) => {
    const personInfo: PersonInfo | undefined = _.get(replySed, `${personId}.personInfo`) // undefined for family pr pdu1
    const personName = personId === 'familie'
      ? t('label:hele-familien')
      : personInfo
        ? personInfo?.fornavn + ' ' + (personInfo?.etternavn ?? '')
        : (replySed as PDU1).bruker.fornavn + ' ' + ((replySed as PDU1).bruker.etternavn ?? '')

    const open: boolean = _.find(openMenus, _id => _id === personId) !== undefined

    return (
      <NameAndOptionsDiv className={classNames({ whiteborder: !open && currentMenu === personId })}>
        <NameDiv>
          <NameLabelDiv
            onClick={() => {
              changeMenu(personId, undefined, 'click')
              return false
            }}
            className={classNames({
              selected: focusedMenu === personId
            })}
          >
            {viewValidation && (
              validation[namespace + '-' + personId]
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
              <MenuLabelText>
                {personName}
              </MenuLabelText>
              <HorizontalSeparatorDiv size='0.5' />
              {personInfo?.statsborgerskap && !_.isEmpty(personInfo?.statsborgerskap) && (
                <LandSpan>
                  {' (' + (personInfo?.statsborgerskap?.map(s => s.land)?.join(', ') ?? '-') + ')'}
                </LandSpan>
              )}
            </>
            {personId.startsWith('barn[') && (
              <>
                <HorizontalSeparatorDiv size='0.5' />
                <Child />
              </>
            )}
          </NameLabelDiv>
          <MenuArrowDiv>
            {open ? <ExpandFilled /> : <NextFilled />}
          </MenuArrowDiv>
        </NameDiv>
        {open && <PaddedHorizontallyDiv><HorizontalLineSeparator /></PaddedHorizontallyDiv>}
        {open && forms
          .filter(o => {
            const _type = (replySed as ReplySed)?.sedType ?? 'PDU1'
            return _.isString(o.type)
              ? _type.startsWith(o.type)
              : _.find(o.type, (t: string) => _type.startsWith(t)) !== undefined
          })
          .filter(o => personId.startsWith('barn')
            ? !!o.barn
            : personId === 'familie'
              ? !!o.family
              : true
          )
          .filter(o => _.isFunction(o.condition) ? o.condition() : true)
          .map((o, i) => {
            return (
              <OptionDiv
                className={classNames({
                  selected: currentMenu === personId && currentMenuOption === o.value,
                  whiteborder: currentMenu === personId && currentMenuOption === o.value,
                  first: i === 0
                })}
                key={o.value}
                onClick={() => changeMenu(personId, o.value, 'click')}
                role='button'
              >
                {viewValidation
                  ? (
                      validation[namespace + '-' + personId + '-' + o.value] === undefined
                        ? <SuccessFilled color='green' height={20} />
                        : <ErrorFilled color='red' height={20} />
                    )
                  : (
                    <EllipsisCircleH height={20} />
                    )}
                <HorizontalSeparatorDiv size='0.5' />
                {o.label}
              </OptionDiv>
            )
          })}
      </NameAndOptionsDiv>
    )
  }

  const handleFeilLenke = (e: any) => {
    const error: ErrorElement = e.detail
    const namespaceBits = error.skjemaelementId.split('-')
    if (namespaceBits[0] === namespace) {
      const newMenu = namespaceBits[1]
      const newOption = namespaceBits[2].split('[')[0]
      const [currentMenu, currentMenuOption] = menuRef.current.split('|')
      if (!(newMenu === currentMenu && newOption === currentMenuOption)) {
        changeMenu(newMenu, newOption, 'event')
      }
      setTimeout(() => {
        const element = document.getElementById(error.skjemaelementId)
        element?.focus()
        element?.closest('.mainright')?.scrollIntoView({
          behavior: 'smooth'
        })
      }, 200)
    }
  }

  const handleTilbake = () => {
    setPreviousMenu(undefined)
    setCurrentMenu(totalPeopleNr === 1 ? 'bruker' : undefined)
    setFocusedMenu(totalPeopleNr === 1 ? 'bruker' : undefined)
    setCurrentMenuLabel(undefined)
    setPreviousMenuOption(undefined)
    setCurrentMenuOption(undefined)
  }

  useEffect(() => {
    document.addEventListener('feillenke', handleFeilLenke)
    document.addEventListener('tilbake', handleTilbake)
    return () => {
      document.removeEventListener('feillenke', handleFeilLenke)
      document.removeEventListener('tilbake', handleTilbake)
    }
  }, [])

  return (
    <PileDiv key={(replySed as ReplySed)?.sedType + '-' + ((replySed as FSed)?.formaal?.join(',') ?? '')}>
      {_seeNewPersonModal && (
        <AddPersonModal<T>
          replySed={replySed}
          setReplySed={setReplySed!}
          parentNamespace={namespace}
          onModalClose={() => setSeeNewPersonModal(false)}
        />
      )}
      <WithErrorPanel
        border
        className={classNames({ error: validation[namespace]?.feilmelding })}
      >
        <FlexCenterSpacedDiv>
          <LeftDiv className='left'>
            {replySed?.bruker && renderMenu(replySed, 'bruker')}
            {(replySed as F002Sed)?.ektefelle && renderMenu(replySed!, 'ektefelle')}
            {(replySed as F002Sed)?.annenPerson && renderMenu(replySed!, 'annenPerson')}
            {(replySed as F002Sed)?.barn?.map((b: any, i: number) => renderMenu(replySed!, `barn[${i}]`))}
            {isFSed(replySed) && renderMenu(replySed!, 'familie')}
            <LastDiv data-empty-right-div={_.isNil(currentMenuOption)}>
              {isFSed(replySed) && (
                <Button
                  variant='tertiary'
                  onClick={onAddNewPerson}
                >
                  <AddCircle />
                  {t('el:button-add-new-x', { x: t('label:person') })}
                </Button>
              )}
            </LastDiv>
          </LeftDiv>
          <RightDiv className='mainright'>
            {!currentMenu && (
              <PileCenterDiv style={{ height: '100%' }}>
                <FlexCenterDiv style={{ flex: '1', alignSelf: 'center' }}>
                  {t('label:velg-personer')}
                </FlexCenterDiv>
              </PileCenterDiv>
            )}
            {previousMenuOption && (
              <PreviousFormDiv
                className={classNames('right', { animating: animatingMenus })}
                key={previousMenu + '-' + previousMenuOption}
              >
                {getForm(previousMenuOption)}
              </PreviousFormDiv>
            )}
            {currentMenuOption && (
              <ActiveFormDiv
                className={classNames('right', { animating: animatingMenus })}
                key={currentMenu + '-' + currentMenuOption}
              >
                {getForm(currentMenuOption)}
              </ActiveFormDiv>
            )}
          </RightDiv>
        </FlexCenterSpacedDiv>
      </WithErrorPanel>
    </PileDiv>
  )
}

export default TwoLevelForm
