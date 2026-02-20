import {
  PlusCircleIcon,
  PersonIcon,
  PersonGroupIcon,
  PersonPlusIcon,
  ChildEyesIcon,
  MenuElipsisHorizontalCircleIcon,
  XMarkOctagonFillIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckmarkCircleFillIcon
} from '@navikt/aksel-icons'

import { BodyLong, Box, Button, HStack, VStack } from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
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
import {isF001Sed, isF002Sed, canAddPerson} from 'utils/sed'
import styles from './MainForm.module.css'

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
  CDM_VERSION?: number
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
  CDM_VERSION?: number
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
  menuDefaultClosed = false,
  CDM_VERSION
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
          CDM_VERSION={CDM_VERSION}
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
        <div
          key={form.value}
          className={classNames(styles.nameAndOptionsDiv, { [styles.selected]: selected })}
        >
          <div
            className={styles.nameDiv}
            onClick={() => {
              changeMenu(form.value, form.value, 'click')
              return false
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                changeMenu(form.value, form.value, 'click')
              }
            }}
            role="button"
            tabIndex={0}
          >
            <HStack gap="2" align="center" className={classNames(styles.nameLabelDiv, { [styles.selected]: selected })}>
              {!isValidated
                ? null
                : validationHasErrors
                  ? <XMarkOctagonFillIcon height={20} color='red' />
                  : <CheckmarkCircleFillIcon color='green' height={20} />
              }
              <BodyLong className={classNames(styles.menuLabelText, { [styles.selected]: selected })}>
                {form.label}
              </BodyLong>
            </HStack>
            <Box paddingInline="2">
              <ChevronRightIcon />
            </Box>
          </div>
        </div>
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
        ? (personInfo as PersonInfo).fornavn + ' ' + ((personInfo as PersonInfo).etternavn ?? '')
        : (replySed as PDU1).bruker.fornavn + ' ' + ((replySed as PDU1).bruker.etternavn ?? '')

    const open: boolean = _.find(openMenus, _id => _id === personId) !== undefined
    const validationKeys = Object.keys(validation).filter(k => k.startsWith(namespace + '-' + personId))
    const isValidated = validationKeys.length > 0
    const validationHasErrors = isValidated && _.some(validationKeys, v => validation[v]?.feilmelding !== 'ok')

    return (
      <div className={classNames(styles.nameAndOptionsDiv, { [styles.selected]: !open && currentMenu === personId })}>
        <div
          className={styles.nameDiv}
          onClick={() => {
            changeMenu(personId, undefined, 'click')
            return false
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              changeMenu(personId, undefined, 'click')
            }
          }}
          role="button"
          tabIndex={0}
        >
          <HStack gap="2" align="center" className={classNames(styles.nameLabelDiv, { [styles.selected]: focusedMenu === personId })}>
            {isValidated
              ? validationHasErrors
                  ? <XMarkOctagonFillIcon height={20} color='red' />
                  : <CheckmarkCircleFillIcon color='green' height={20} />
              : null}
            <BodyLong className={styles.menuLabelText}>
              {personName}
            </BodyLong>
            {personId.startsWith('bruker') && (
              <PersonIcon title="Søker"/>
            )}
            {personId.startsWith('ektefelle') && (
              <PersonGroupIcon title="Ektefelle"/>
            )}
            {(personId.startsWith('andrePersoner') || personId.startsWith('annenPerson')) && (
              <PersonPlusIcon title="Annen person"/>
            )}
            {personId.startsWith('barn') && (
              <ChildEyesIcon title="Barn"/>
            )}
          </HStack>
          <Box paddingInline="2">
            {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </Box>
        </div>
        {open && <Box paddingInline="2"><HorizontalLineSeparator /></Box>}
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
              <HStack
                gap="2"
                align="center"
                className={classNames(styles.optionDiv, {
                  [styles.selected]: currentMenu === personId && currentMenuOption === o.value,
                  [styles.first]: i === 0
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
                {o.label}
              </HStack>
            )
          })}
      </div>
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
      <div className={classNames(styles.nameAndOptionsDiv, { [styles.selected]: !open && currentMenu === menuItem.key })}>
        <div
          className={styles.nameDiv}
          onClick={() => {
            changeMenu(menuItem.key, undefined, 'click')
            return false
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              changeMenu(menuItem.key, undefined, 'click')
            }
          }}
          role="button"
          tabIndex={0}
        >
          <HStack gap="2" align="center" className={classNames(styles.nameLabelDiv, { [styles.selected]: focusedMenu === menuItem.key })}>
            <div>
            {isValidated
              ? validationHasErrors
                ? <XMarkOctagonFillIcon height={20} color='red' />
                : <CheckmarkCircleFillIcon color='green' height={20} />
              : null}
            </div>
            <BodyLong className={styles.menuLabelText}>
              {menuItem.label}
            </BodyLong>
          </HStack>
          <Box paddingInline="2">
            {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </Box>
        </div>
        {open && <Box paddingInline="2"><HorizontalLineSeparator /></Box>}
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
              <HStack
                gap="2"
                align="start"
                className={classNames(styles.optionWithIconDiv, {
                  [styles.selected]: currentMenu === menuItem.key && currentMenuOption === o.value,
                  [styles.first]: i === 0
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
                {o.label}
              </HStack>
            )
          })}
      </div>
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
    <VStack className='mainform'>
      <AddPersonModal<T>
        open={_seeNewPersonModal}
        replySed={replySed}
        setReplySed={setReplySed!}
        parentNamespace={namespace}
        onModalClose={() => setSeeNewPersonModal(false)}
      />
      <WithErrorPanel
        className={classNames({ error: panelError })}
      >
        <HStack justify="space-between" align="center">
          <div className={classNames(styles.leftDiv, 'left')}>
            {type === 'twolevel' && (
              <>
                {type === 'twolevel' && replySed?.bruker && renderTwoLevelMenu(replySed, 'bruker')}
                {type === 'twolevel' && (replySed as F002Sed)?.ektefelle && renderTwoLevelMenu(replySed!, 'ektefelle')}
                {type === 'twolevel' && (replySed as F002Sed)?.annenPerson && renderTwoLevelMenu(replySed!, 'annenPerson')}
                {type === 'twolevel' && (replySed as F002Sed)?.andrePersoner?.map((ap: any, i: number) => renderTwoLevelMenu(replySed!, `andrePersoner[${i}]`))}
                {type === 'twolevel' && (replySed as F002Sed)?.barn?.map((b: any, i: number) => renderTwoLevelMenu(replySed!, `barn[${i}]`))}
                {type === 'twolevel' && (isF001Sed(replySed) || isF002Sed(replySed)) && renderTwoLevelMenu(replySed!, 'familie')}
                <div className={styles.lastDivWithButton}>
                  {canAddPerson(replySed) && (
                    <Button
                      variant='tertiary'
                      onClick={onAddNewPerson}
                      icon={<PlusCircleIcon/>}
                    >
                      {t('el:button-add-new-x', { x: t('label:person') })}
                    </Button>
                  )}
                </div>
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
                {visibleMenu && <div className={styles.lastDiv} />}
              </>
            )}
            {type === 'onelevel' && (
              <>
                {renderOneLevelMenu(forms)}
                <div className={styles.lastDiv} />
              </>
            )}
          </div>

          {visibleMenu &&
            <div className={styles.rightDiv}>
              {!currentMenu
                ? (
                  <div className={styles.blankDiv}>
                    <div className={styles.blankContentDiv}>
                      {t('label:velg-meny')}
                    </div>
                  </div>
                  )
                : (
                  <div
                    className={classNames(styles.rightActiveDiv, `active-${currentMenu}${currentMenuOption ? '-' + currentMenuOption : ''}`, 'right')}
                    key={`active-${currentMenu}${currentMenuOption ? '-' + currentMenuOption : ''}`}
                  >
                    {getForm(currentMenu, currentMenuOption)}
                  </div>
                  )}
            </div>
          }
        </HStack>
      </WithErrorPanel>
    </VStack>
  )
}

export default MainForm
