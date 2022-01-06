import { Add, Child, ErrorFilled, ExpandFilled, NextFilled, SuccessFilled } from '@navikt/ds-icons'
import { BodyLong, Button, Checkbox } from '@navikt/ds-react'
import { finishMenuStatistic, logMenuStatistic, startMenuStatistic } from 'actions/statistics'
import AddPersonModal from 'applications/SvarSed/PersonManager/AddPersonModal/AddPersonModal'
import classNames from 'classnames'
import { WithErrorPanel } from 'components/StyledComponents'
import { Option } from 'declarations/app'
import { ErrorElement } from 'declarations/app.d'
import { PDU1, Pdu1Person } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { Barn, F002Sed, FSed, PersonInfo, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import {
  FlexCenterDiv,
  FlexCenterSpacedDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import { isFSed } from 'utils/sed'

const transitionTime = 0.3

const LeftDiv = styled.div`
  flex: 1;
  align-self: stretch;
  min-width: 300px;
  border-right: 1px solid var(--navds-semantic-color-border);
  border-width: 1px;
  border-style: solid;
  border-color: var(--navds-semantic-color-border);
  background-color: var(--navds-semantic-color-canvas-background-light);
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
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
    border-left: 6px solid var(--navds-semantic-color-interaction-primary-selected);
  }
`

const MenuDiv = styled.div`
  display: flex;
  justify-content: space-between;
  .skjemaelement {
     display: flex;
  }
`
const MenuCheckbox = styled(Checkbox)`
  padding: 0rem 0.5rem;
`
const MenuLabelDiv = styled(FlexCenterDiv)`
  cursor: pointer;
  padding: 1rem 0.5rem;
  flex: 1;
  transition: all 0.2s ease-in-out;
  &:hover {
   color: var(--navds-semantic-color-text-inverted);
   background-color: var(--navds-semantic-color-interaction-primary-hover);
  }
`
const CheckboxDiv = styled.div`
  transition: all 0.3s ease-in-out;
  &:hover {
   background-color: var(--navds-semantic-color-interaction-primary-hover);
  }
`
const RightDiv = styled.div`
  flex: 3;
  border-left: 1px solid var(--navds-semantic-color-border);
  margin-left: -1px;
  align-self: stretch;
  position: relative;
  overflow: hidden;
  width: 780px;
`
const RightActiveDiv = styled.div`
  border-width: 1px;
  border-style: solid;
  border-left-width: 0;
  border-color: var(--navds-semantic-color-border);
  background-color: var(--navds-semantic-color-canvas-background-light);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
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
const MarginDiv = styled.div`
  padding: 1rem 0.5rem;
`
const LandSpan = styled.span`
  color: grey;
  white-space: nowrap;
`
const MenuLabelText = styled(BodyLong)`
  &.selected {
    font-weight: bold;
  }
`

export interface PersonManagerProps {
  forms: Array<Form>
  replySed: ReplySed | PDU1 | null | undefined
  viewValidation: boolean
  setReplySed: (replySed: ReplySed) => void
  updateReplySed: (needle: string, value: any) => void
}

export interface PersonManagerFormProps {
  replySed: ReplySed | PDU1 | null | undefined
  parentNamespace: string
  personID: string | undefined
  personName: string
  setReplySed: (replySed: ReplySed | PDU1) => void
  updateReplySed: (needle: string, value: any) => void
  options ?: any
}

export interface PersonManagerFormSelector {
  validation: Validation
}

export interface Form extends Option {
  component: any
  type: string | Array<string>
  barn?: boolean
  family?: boolean
  condition ?: () => void
  options?: any
}

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const PersonManager: React.FC<PersonManagerProps> = ({
  forms,
  replySed,
  setReplySed,
  updateReplySed,
  viewValidation
}: PersonManagerProps) => {
  const { t } = useTranslation()
  const { validation }: any = useSelector<State, PersonManagerFormSelector>(mapState)
  const namespace = 'personmanager'

  const dispatch = useDispatch()
  const brukerNr = 1
  const initialSelectedMenus = ['bruker']
  const ektefelleNr = brukerNr + ((replySed as F002Sed)?.ektefelle ? 1 : 0)
  if (ektefelleNr > 0) initialSelectedMenus.push('ektefelle')
  const annenPersonNr = ektefelleNr + ((replySed as F002Sed)?.annenPerson ? 1 : 0)
  if (annenPersonNr > 0) initialSelectedMenus.push('annenPerson')
  const barnNr = annenPersonNr + ((replySed as F002Sed)?.barn ? 1 : 0)
  const totalPeopleNr = annenPersonNr + ((replySed as F002Sed)?.barn?.length ?? 0);
  (replySed as F002Sed)?.barn?.forEach((b: Barn, i: number) => initialSelectedMenus.push(`barn[${i}]`))
  let familieNr: number | undefined
  if ((replySed as F002Sed)?.sedType?.startsWith('F')) {
    familieNr = barnNr + 1
    initialSelectedMenus.push('familie')
  }

  // list of open menus (= persons). If SED only has one person (bruker), open it by default
  const [openMenus, setOpenMenus] = useState<Array<string>>(totalPeopleNr === 1 ? ['bruker'] : [])

  const [_seeNewPersonModal, setSeeNewPersonModal] = useState<boolean>(false)
  const [animatingMenus, setAnimatingMenus] = useState<boolean>(false)

  // list of selected menus (with checkbox)
  const [selectedMenus, setSelectedMenus] = useState<Array<string>>(initialSelectedMenus)

  const [previousMenu, setPreviousMenu] = useState<string | undefined>(undefined)
  const [currentMenu, setCurrentMenu] = useState<string | undefined>(totalPeopleNr === 1 ? 'bruker' : undefined)
  const [focusedMenu, setFocusedMenu] = useState<string | undefined>(totalPeopleNr === 1 ? 'bruker' : undefined)
  const [currentMenuLabel, setCurrentMenuLabel] = useState<string | undefined>(undefined)
  const [previousMenuOption, setPreviousMenuOption] = useState<string | undefined>(undefined)
  const initialMenuOption = (() => {
    if (totalPeopleNr !== 1) return undefined
    const _type = (replySed as ReplySed)?.sedType ?? 'PDU1'
    if (_type.startsWith('F')) return 'personopplysninger'
    if (_type.startsWith('P')) return 'person_pd'
    return 'person_h'
  })()
  const [currentMenuOption, _setCurrentMenuOption] = useState<string | undefined>(initialMenuOption)
  const alreadyOpenMenu = (menu: string) => _.find(openMenus, _id => _id === menu) !== undefined

  useEffect(() => {
    if (!_.isNil(initialMenuOption)) {
      dispatch(startMenuStatistic('personmanager', initialMenuOption))
    }
    return () => {
      dispatch(finishMenuStatistic('personmanager'))
    }
  }, [])

  const setCurrentMenuOption = (newMenu: string | undefined) => {
    dispatch(logMenuStatistic('personmanager', currentMenuOption, newMenu))
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

  const onSelectMenu = (menu: string, checked: boolean) => {
    setSelectedMenus(checked
      ? selectedMenus.concat(menu)
      : _.filter(selectedMenus, _id => _id !== menu)
    )
  }

  const onAddNewPerson = () => {
    setSeeNewPersonModal(true)
  }

  const renderMenu = (replySed: ReplySed | PDU1, personId: string, totalIndex: number) => {
    const personInfo: PersonInfo | undefined = _.get(replySed, `${personId}.personInfo`) // undefined for family pr pdu1
    const personName = personId === 'familie'
      ? t('label:hele-familien')
      : personInfo
        ? personInfo?.fornavn + ' ' + (personInfo?.etternavn ?? '')
        : (replySed as PDU1).bruker.fornavn + ' ' + ((replySed as PDU1).bruker.etternavn ?? '')

    const open: boolean = _.find(openMenus, _id => _id === personId) !== undefined
    const selected: boolean = _.find(selectedMenus, _id => _id === personId) !== undefined
    return (
      <PileDiv>
        <MenuDiv>
          <MenuLabelDiv
            onClick={() => {
              changeMenu(personId, undefined, 'click')
              return false
            }}
            style={{ animationDelay: totalIndex * 0.03 + 's' }}
            className={classNames({
              slideInFromLeft: true,
              selected: focusedMenu === personId
            })}
          >
            {open ? <ExpandFilled /> : <NextFilled />}
            <HorizontalSeparatorDiv size='0.5' />
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
              <MenuLabelText className={classNames({ selected: selected })}>
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
          </MenuLabelDiv>
          {isFSed(replySed) && (
            <CheckboxDiv>
              <MenuCheckbox
                aria-label={t('label:velg-person', { person: personInfo?.fornavn + ' ' + (personInfo?.etternavn ?? '') })}
                aria-checked={selected}
                checked={selected}
                hideLabel
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.stopPropagation()
                  onSelectMenu(personId, e.target.checked)
                }}
              >&nbsp;
              </MenuCheckbox>

            </CheckboxDiv>
          )}
        </MenuDiv>
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
                  slideInFromLeft: true,
                  selected: currentMenu === personId && currentMenuOption === o.value
                })}
                key={o.value}
                onClick={() => changeMenu(personId, o.value, 'click')}
                role='button'
                style={{ animationDelay: i * 0.03 + 's' }}
              >
                {viewValidation && (
                  validation[namespace + '-' + personId + '-' + o.value] === undefined
                    ? <SuccessFilled color='green' height={20} />
                    : <ErrorFilled height={20} color='red' />
                )}
                <HorizontalSeparatorDiv size='0.5' />
                {`${i + 1}. ${o.label}`}
              </OptionDiv>
            )
          })}
      </PileDiv>
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
        <AddPersonModal
          replySed={replySed as ReplySed}
          setReplySed={setReplySed}
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
            {replySed?.bruker && renderMenu(replySed, 'bruker', brukerNr)}
            {(replySed as F002Sed)?.ektefelle && renderMenu(replySed!, 'ektefelle', ektefelleNr)}
            {(replySed as F002Sed)?.annenPerson && renderMenu(replySed!, 'annenPerson', annenPersonNr)}
            {(replySed as F002Sed)?.barn?.map((b: any, i: number) => renderMenu(replySed!, `barn[${i}]`, barnNr + i))}
            {isFSed(replySed) && renderMenu(replySed!, 'familie', familieNr as number)}
            {isFSed(replySed) && (
              <MarginDiv>
                <Button
                  variant='tertiary'
                  onClick={onAddNewPerson}
                >
                  <Add />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-add-new-x', { x: t('label:person') })}
                </Button>
              </MarginDiv>
            )}
            <VerticalSeparatorDiv />
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

export default PersonManager
