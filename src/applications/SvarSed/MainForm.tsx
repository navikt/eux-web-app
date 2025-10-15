import {
  PlusCircleIcon,
  ChildEyesIcon,
  MenuElipsisHorizontalCircleIcon,
  XMarkOctagonFillIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckmarkCircleFillIcon
} from '@navikt/aksel-icons'

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
import AddPersonModal from 'applications/SvarSed/AddPersonModal/AddPersonModal'
import classNames from 'classnames'
import { HorizontalLineSeparator, WithErrorPanel } from 'components/StyledComponents'
import { Option } from 'declarations/app'
import { ErrorElement } from 'declarations/app.d'
import { PDU1, Pdu1Person } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { F002Sed, PersonInfo, ReplySed } from 'declarations/sed'
import { StorageTypes, UpdateReplySedPayload, Validation } from 'declarations/types'
import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import {isF001Sed, isF002Sed, canAddPerson} from 'utils/sed'

const LeftDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  min-width: 300px;
  max-width: 300px;
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
  border-color: var(--a-border-strong);
  background-color: var(--a-bg-default);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  height: 100%;
  margin-left: -1px;
`
const NameAndOptionsDiv = styled(PileDiv)`
 &.selected {
   border-right: 1px solid var(--a-bg-default);
   background-image: linear-gradient(to right, var(--a-bg-subtle), var(--a-bg-default));
 }
 background-color: var(--a-bg-default);
 border-top: 1px solid var(--a-border-strong);
 border-right: 1px solid var(--a-border-strong);
 border-width: 1px;
 border-bottom-width: 0px;
 border-style: solid;
 border-color: var(--a-border-strong);
`

const NameDiv = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 1rem 0.5rem;
  transition: all 0.2s ease-in-out;
  &:hover {
   color: var(--a-text-on-inverted);
   background-color: var(--a-surface-action-hover);
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
  &:hover:not(.selected) {
    color: var(--a-text-on-inverted);
    background-color: var(--a-surface-action-hover);
  }
  &.selected {
    font-weight: bold;
    border-top: 1px solid var(--a-border-strong);
    border-bottom: 1px solid var(--a-border-strong);
    background-image: linear-gradient(to right, var(--a-bg-subtle), var(--a-bg-default));
  }
  &.selected {
    border-right: 1px solid var(--a-bg-default);
    margin-right: -1px;
  }
  &.first {
    margin-top: -1px;
  }
`

const OptionWithIconDiv = styled(OptionDiv)`
  white-space: wrap;
  align-items: start;
`

const LastDivWithButton = styled.div`
  flex: 1;
  padding: 1rem 0.5rem;
  border-top: 1px solid var(--a-border-strong);
  border-right: 1px solid var(--a-border-strong);
  border-right-width: 1px;
`
const LastDiv = styled.div`
  flex: 1;
  border-top: 1px solid var(--a-border-strong);
  border-right: 1px solid var(--a-border-strong);
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
const BlankDiv = styled(PileCenterDiv)`
  border-width: 1px;
  border-style: solid;
  border-color: var(--a-border-strong);
  background-color: var(--a-bg-default);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  margin-left: -1px;
  height: 100%;
`
const BlankContentDiv = styled(FlexCenterDiv)`
  flex: 1;
  align-self: center;
  background-color: var(--a-bg-default);
`
export interface MainFormFCProps<T> {
  menuItems?: Array<MenuItem>
  forms: Array<Form>
  type: 'onelevel' | 'twolevel' | 'menuitems'
  firstForm?: string
  replySed: T | null | undefined
  setReplySed: (replySed: T) => ActionWithPayload<T>
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
  namespace: string
  loggingNamespace: string
  deselectedMenu?: string | undefined
  deselectedMenuOption?: string | undefined
  menuDefaultClosed?: boolean
}

export interface MainFormProps {
  replySed: ReplySed | PDU1 | null | undefined
  parentNamespace: string
  parentTarget?: string
  personID?: string | undefined
  personName?: string
  label?: string
  setReplySed: (replySed: ReplySed | PDU1) => ActionWithPayload<ReplySed | PDU1>
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
  options ?: any
}

export interface MainFormSelector {
  validation: Validation
}

export interface Form extends Option {
  component: any
  type?: string | Array<string>
  barn?: boolean
  family?: boolean
  adult?: boolean
  other?: boolean
  user?: boolean
  spouse?: boolean
  condition ?: () => void
  options?: any
}

export interface MenuItem {
  key: string
  label: string
  condition?: () => void
}

export const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const MainForm = <T extends StorageTypes>({
  menuItems,
  forms,
  firstForm,
  type,
  replySed,
  setReplySed,
  updateReplySed,
  namespace,
  loggingNamespace,
  deselectedMenu,
  deselectedMenuOption,
  menuDefaultClosed = false
}: MainFormFCProps<T>) => {
  const { t } = useTranslation()
  const { validation }: any = useAppSelector(mapState)

  const dispatch = useAppDispatch()

  const brukerNr = 1
  const ektefelleNr = brukerNr + ((replySed as F002Sed)?.ektefelle ? 1 : 0)
  const annenPersonNr = ektefelleNr + ((replySed as F002Sed)?.annenPerson ? 1 : 0)
  const totalPeopleNr = annenPersonNr + ((replySed as F002Sed)?.barn?.length ?? 0) + ((replySed as F002Sed)?.andrePersoner?.length ?? 0)

  // list of open menus (= persons, on two-level menus).
  // If SED only has one person (bruker), open it by default
  const [openMenus, setOpenMenus] = useState<Array<string>>(() => totalPeopleNr === 1 ? ['bruker'] : [])

  const initialMenu = type === 'twolevel'
    ? totalPeopleNr === 1 ? 'bruker' : undefined
    : forms.length === 1 ? menuDefaultClosed ? undefined : forms[0].value : undefined
  const initialMenuOption = (type === 'twolevel' && totalPeopleNr === 1) ? firstForm : undefined

  const [_seeNewPersonModal, setSeeNewPersonModal] = useState<boolean>(false)

  const [currentMenu, _setCurrentMenu] = useState<string | undefined>(initialMenu)
  const [focusedMenu, setFocusedMenu] = useState<string | undefined>(initialMenu)
  const [currentMenuOption, _setCurrentMenuOption] = useState<string | undefined>(initialMenuOption)

  const alreadyOpenMenu = (menu: string) => _.find(openMenus, _id => _id === menu) !== undefined


  const visibleMenu = menuItems && type === "menuitems" ? menuItems?.filter(menuItem => _.isFunction(menuItem.condition) ? menuItem.condition() : true).length > 0 : true

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

  const setCurrentMenu = (newMenu: string | undefined) => {
    dispatch(logMenuStatistic(loggingNamespace, currentMenu, newMenu))
    _setCurrentMenu(newMenu)
  }

  const menuRef = useRef(currentMenu + (currentMenuOption ? '|' + currentMenuOption : ''))

  const getForm = (menu: string, menuOption: string | undefined): JSX.Element | null => {
    let personName
    if (type === 'twolevel') {
      if (menu !== 'familie') {
        personName = getPersonName(replySed, menu)
      } else {
        personName = t('label:hele-familien')
      }
    }

    let form: Form | undefined
    if (type === 'twolevel' || type === 'menuitems') {
      form = _.find(forms, o => o.value === menuOption)
    } else {
      form = _.find(forms, o => o.value === menu)
    }

    if (form) {
      const Component = form.component
      return (
        <Component
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={personName}
          label={form.label}
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
    if (type === 'onelevel') {
      if (currentMenu !== menu) {
        setCurrentMenu(menu)
      } else if (currentMenu === menu){
        setCurrentMenu(undefined)
      }
      menuRef.current = menu
      return
    }

    const changedMenu: boolean = currentMenu !== menu
    const sameMenu: boolean = currentMenu === menu

    const changedMenuOption: boolean =
      !_.isNil(menuOption)
        ? ((menuOption !== currentMenuOption) || (menuOption === currentMenuOption && changedMenu))
        : false

    if (changedMenu) {
      setFocusedMenu(menu)
      if (changedMenuOption) {
        setCurrentMenu(menu)
      }
    } else if(sameMenu){
      if (!changedMenuOption){
        setCurrentMenu(undefined)
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

  const handleFeilLenke = (e: any) => {
    const error: ErrorElement = e.detail
    const namespaceBits = error.skjemaelementId.split('-')
    if (namespaceBits[0] === namespace) {
      const newMenu = namespaceBits[1]
      const newOption = namespaceBits[2]?.split('[')?.[0]
      const [currentMenu, currentMenuOption] = menuRef.current.split('|')
      if (!(newMenu === currentMenu && newOption === currentMenuOption)) {
        changeMenu(newMenu, newOption, 'event')
      }
      setTimeout(() => {
        const element = document.getElementById(error.skjemaelementId)
        if (element) {
          element?.focus()
          element?.closest('.mainform')?.scrollIntoView({
            block: 'start',
            inline: 'start',
            behavior: 'smooth'
          })
          element?.focus()
        }
      }, 200)
    }
  }

  const onAddNewPerson = () => {
    setSeeNewPersonModal(true)
  }

  const renderOneLevelMenu = (forms: Array<Form>) => {
    if(currentMenu && deselectedMenu && currentMenu === deselectedMenu){
      setCurrentMenu(initialMenu)
    }
    const filteredForms = forms.filter(o => _.isFunction(o.condition) ? o.condition() : true)
    return filteredForms.map((form) => {
      const selected: boolean = currentMenu === form.value
      const validationKeys = Object.keys(validation).filter(k => k.startsWith(namespace + '-' + form.value))
      const isValidated = validationKeys.length > 0
      const validationHasErrors = isValidated && _.some(validationKeys, v => validation[v]?.feilmelding !== 'ok')
      return (
        <NameAndOptionsDiv
          key={form.value}
          className={classNames({ selected })}
        >
          <NameDiv
            onClick={() => {
              changeMenu(form.value, form.value, 'click')
              return false
            }}
          >
            <NameLabelDiv
              className={classNames({ selected })}
            >
              <div>
              {!isValidated
                ? null
                : validationHasErrors
                  ? <XMarkOctagonFillIcon height={20} color='red' />
                  : <CheckmarkCircleFillIcon color='green' height={20} />
              }
              </div>
              <HorizontalSeparatorDiv size='0.5' />
              <MenuLabelText className={classNames({ selected })}>
                {form.label}
              </MenuLabelText>
            </NameLabelDiv>
            <MenuArrowDiv>
              <ChevronRightIcon />
            </MenuArrowDiv>
          </NameDiv>
        </NameAndOptionsDiv>
      )
    })
  }

  const renderTwoLevelMenu = (replySed: ReplySed | PDU1, personId: string) => {
    if(currentMenuOption && deselectedMenuOption && currentMenuOption === deselectedMenuOption){
      setCurrentMenuOption(initialMenuOption)
    }
    const personInfo: PersonInfo | undefined = _.get(replySed, `${personId}.personInfo`) // undefined for family pr pdu1
    const personName = personId === 'familie'
      ? t('label:hele-familien')
      : personInfo
        ? personInfo?.fornavn + ' ' + (personInfo?.etternavn ?? '')
        : (replySed as PDU1).bruker.fornavn + ' ' + ((replySed as PDU1).bruker.etternavn ?? '')

    const open: boolean = _.find(openMenus, _id => _id === personId) !== undefined
    const validationKeys = Object.keys(validation).filter(k => k.startsWith(namespace + '-' + personId))
    const isValidated = validationKeys.length > 0
    const validationHasErrors = isValidated && _.some(validationKeys, v => validation[v]?.feilmelding !== 'ok')

    return (
      <NameAndOptionsDiv className={classNames({ selected: !open && currentMenu === personId })}>
        <NameDiv
          onClick={() => {
            changeMenu(personId, undefined, 'click')
            return false
          }}
        >
          <NameLabelDiv
            className={classNames({
              selected: focusedMenu === personId
            })}
          >
            {isValidated
              ? validationHasErrors
                  ? <XMarkOctagonFillIcon height={20} color='red' />
                  : <CheckmarkCircleFillIcon color='green' height={20} />
              : null}
            <>
              <HorizontalSeparatorDiv size='0.5' />
              <MenuLabelText>
                {personName}
              </MenuLabelText>
              <HorizontalSeparatorDiv size='0.5' />
              {personInfo?.statsborgerskap && !_.isEmpty(personInfo?.statsborgerskap) && (
                <LandSpan>
                  {' (' + (personInfo?.statsborgerskap?.map(s => s.landkode)?.join(', ') ?? '-') + ')'}
                </LandSpan>
              )}
            </>
            {personId.startsWith('barn[') && (
              <>
                <HorizontalSeparatorDiv size='0.5' />
                <ChildEyesIcon />
              </>
            )}
          </NameLabelDiv>
          <MenuArrowDiv>
            {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
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
          .filter(o => {
            // if we are in F SED, check restritions for kind of person
            if (
              Object.prototype.hasOwnProperty.call(o, 'adult') ||
              Object.prototype.hasOwnProperty.call(o, 'barn') ||
              Object.prototype.hasOwnProperty.call(o, 'family')
            ) {
              if (personId.startsWith('barn')) {
                return !!o.barn
              }
              if (personId === 'familie') {
                return !!o.family
              }
              return !!o.adult
            } else if (Object.prototype.hasOwnProperty.call(o, 'user')) {
              if (personId === 'bruker') {
                return !!o.user
              }
            } else if (Object.prototype.hasOwnProperty.call(o, 'spouse')) {
              if (personId === 'ektefelle') {
                return !!o.spouse
              }
            } else if (Object.prototype.hasOwnProperty.call(o, 'other')) {
              if (personId === 'annenPerson') {
                return !!o.other
              }
              if (personId.startsWith("andrePersoner")) {
                return !!o.other
              }
            } else {
              return true
            }
          })
          .filter(o => _.isFunction(o.condition) ? o.condition() : true)
          .map((o, i) => {
            const validationKeys = Object.keys(validation).filter(k => k.startsWith(namespace + '-' + personId + '-' + o.value))
            const isValidated = validationKeys.length > 0
            const validationHasErrors = isValidated && _.some(validationKeys, v => validation[v]?.feilmelding !== 'ok')
            return (
              <OptionDiv
                className={classNames({
                  selected: currentMenu === personId && currentMenuOption === o.value,
                  first: i === 0
                })}
                key={namespace + '-' + personId + '-' + o.value}
                onClick={() => changeMenu(personId, o.value, 'click')}
                role='button'
              >
                {isValidated
                  ? validationHasErrors
                      ? <XMarkOctagonFillIcon color='red' height={20} />
                      : <CheckmarkCircleFillIcon color='green' height={20} />
                  : <MenuElipsisHorizontalCircleIcon height={20} />}
                <HorizontalSeparatorDiv size='0.5' />
                {o.label}
              </OptionDiv>
            )
          })}
      </NameAndOptionsDiv>
    )
  }

  useEffect(() => {
    // Close all submenus if checkbox for menu is deselected
    if(type === 'menuitems' && deselectedMenu){
      // @ts-ignore
      const formsInDeSelectedMenu: Array<Form> = _.filter(forms, (f) => {
        if(f.type){
          return _.isString(f.type) ? f.type === deselectedMenu : f.type.includes(deselectedMenu)
        }
      })

      setOpenMenus(_.filter(openMenus, _id => _id !== deselectedMenu))

      if(deselectedMenu === currentMenu && formsInDeSelectedMenu?.length > 0){
        const isCurrentMenuOptionInFormsInDeSelectedMenu = _.find(formsInDeSelectedMenu, (f) => f.value === currentMenuOption)
        if(isCurrentMenuOptionInFormsInDeSelectedMenu){
          setCurrentMenuOption(initialMenuOption)
        }
      }
    }
  }, [deselectedMenu])

  const renderMenuItems = (menuItem: MenuItem, forms: Array<Form>) => {
    const open: boolean = _.find(openMenus, _id => _id === menuItem.key) !== undefined
    const validationKeys = Object.keys(validation).filter(k => k.startsWith(namespace + '-' + menuItem.key.toLowerCase()))
    const isValidated = validationKeys.length > 0
    const validationHasErrors = isValidated && _.some(validationKeys, v => validation[v]?.feilmelding !== 'ok')

    const menuItemForms = forms
      .filter((f) => _.isFunction(f.condition) ? f.condition() : true)
      .filter((f) => {
        if(f.type){
          return _.isString(f.type) ? f.type === menuItem.key : f.type.includes(menuItem.key)
        }
      })

    if(menuItemForms.length === 1){
      return renderOneLevelMenu(menuItemForms as Array<Form>)
    }


    return(
      <NameAndOptionsDiv className={classNames({ selected: !open && currentMenu === menuItem.key })}>
        <NameDiv
          onClick={() => {
            changeMenu(menuItem.key, undefined, 'click')
            return false
          }}
        >
          <NameLabelDiv
            className={classNames({
              selected: focusedMenu === menuItem.key
            })}
          >
            <div>
            {isValidated
              ? validationHasErrors
                ? <XMarkOctagonFillIcon height={20} color='red' />
                : <CheckmarkCircleFillIcon color='green' height={20} />
              : null}
            </div>
            <HorizontalSeparatorDiv size='0.5' />
            <MenuLabelText>
              {menuItem.label}
            </MenuLabelText>
          </NameLabelDiv>
          <MenuArrowDiv>
            {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </MenuArrowDiv>
        </NameDiv>
        {open && <PaddedHorizontallyDiv><HorizontalLineSeparator /></PaddedHorizontallyDiv>}
        {open && forms
          .filter(o => {
            const _type = menuItem.key
            return _.isString(o.type)
              ? _type.startsWith(o.type)
              : _.find(o.type, (t: string) => _type.startsWith(t)) !== undefined
          })
          .filter(o => _.isFunction(o.condition) ? o.condition() : true)
          .map((o, i) => {
            const validationKeys = Object.keys(validation).filter(k => k.startsWith(namespace + '-' + menuItem.key + '-' + o.value))
            const isValidated = validationKeys.length > 0
            const validationHasErrors = isValidated && _.some(validationKeys, v => validation[v]?.feilmelding !== 'ok')
            return (
              <OptionWithIconDiv
                className={classNames({
                  selected: currentMenu === menuItem.key && currentMenuOption === o.value,
                  first: i === 0
                })}
                key={namespace + '-' + menuItem.key + '-' + o.value}
                onClick={() => changeMenu(menuItem.key, o.value, 'click')}
                role='button'
              >
                <div>
                  {isValidated
                    ? validationHasErrors
                      ? <XMarkOctagonFillIcon color='red' height={20} />
                      : <CheckmarkCircleFillIcon color='green' height={20} />
                    : <MenuElipsisHorizontalCircleIcon height={20} />
                  }
                </div>
                <HorizontalSeparatorDiv size='0.5' />
                {o.label}
              </OptionWithIconDiv>
            )
          })}
      </NameAndOptionsDiv>
    )
  }

  useEffect(() => {
    document.addEventListener('feillenke', handleFeilLenke)
    return () => {
      document.removeEventListener('feillenke', handleFeilLenke)
    }
  }, [])

  const panelError = _.some(Object.keys(validation), k => k.startsWith(namespace) && validation[k]?.feilmelding !== 'ok')

  return (
    <PileDiv className='mainform'>
      <AddPersonModal<T>
        open={_seeNewPersonModal}
        replySed={replySed}
        setReplySed={setReplySed!}
        parentNamespace={namespace}
        onModalClose={() => setSeeNewPersonModal(false)}
      />
      <WithErrorPanel
        border
        className={classNames({ error: panelError })}
      >
        <FlexCenterSpacedDiv>
          <LeftDiv className='left'>
            {type === 'twolevel' && (
              <>
                {type === 'twolevel' && replySed?.bruker && renderTwoLevelMenu(replySed, 'bruker')}
                {type === 'twolevel' && (replySed as F002Sed)?.ektefelle && renderTwoLevelMenu(replySed!, 'ektefelle')}
                {type === 'twolevel' && (replySed as F002Sed)?.annenPerson && renderTwoLevelMenu(replySed!, 'annenPerson')}
                {type === 'twolevel' && (replySed as F002Sed)?.andrePersoner?.map((ap: any, i: number) => renderTwoLevelMenu(replySed!, `andrePersoner[${i}]`))}
                {type === 'twolevel' && (replySed as F002Sed)?.barn?.map((b: any, i: number) => renderTwoLevelMenu(replySed!, `barn[${i}]`))}
                {type === 'twolevel' && (isF001Sed(replySed) || isF002Sed(replySed)) && renderTwoLevelMenu(replySed!, 'familie')}
                <LastDivWithButton>
                  {canAddPerson(replySed) && (
                    <Button
                      variant='tertiary'
                      onClick={onAddNewPerson}
                      icon={<PlusCircleIcon/>}
                    >
                      {t('el:button-add-new-x', { x: t('label:person') })}
                    </Button>
                  )}
                </LastDivWithButton>
              </>
            )}
            {type === 'menuitems' && (
              <>
                {menuItems
                  ?.filter(menuItem => _.isFunction(menuItem.condition) ? menuItem.condition() : true)
                  ?.map((menuItem) => {
                    return renderMenuItems(menuItem, forms)
                  })
                }
                {visibleMenu && <LastDiv />}
              </>
            )}
            {type === 'onelevel' && (
              <>
                {renderOneLevelMenu(forms)}
                <LastDiv />
              </>
            )}
          </LeftDiv>

          {visibleMenu &&
            <RightDiv>
              {!currentMenu
                ? (
                  <BlankDiv>
                    <BlankContentDiv>
                      {t('label:velg-meny')}
                    </BlankContentDiv>
                  </BlankDiv>
                  )
                : (
                  <RightActiveDiv
                    key={`active-${currentMenu}${currentMenuOption ? '-' + currentMenuOption : ''}`}
                    className={classNames(`active-${currentMenu}${currentMenuOption ? '-' + currentMenuOption : ''}`, 'right')}
                  >
                    {getForm(currentMenu, currentMenuOption)}
                  </RightActiveDiv>
                  )}
            </RightDiv>
          }
        </FlexCenterSpacedDiv>
      </WithErrorPanel>
    </PileDiv>
  )
}

export default MainForm
