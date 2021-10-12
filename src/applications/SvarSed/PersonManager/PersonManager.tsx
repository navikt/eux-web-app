import AddPersonModal from 'applications/SvarSed/PersonManager/AddPersonModal/AddPersonModal'
import Arbeidsforhold from 'applications/SvarSed/PersonManager/Arbeidsforhold/Arbeidsforhold'
import GrunnTilOpphør from 'applications/SvarSed/PersonManager/GrunnTilOpphør/GrunnTilOpphør'
import SisteAnsettelsesForhold from 'applications/SvarSed/PersonManager/SisteAnsettelsesForhold/SisteAnsettelsesForhold'
import Add from 'assets/icons/Add'
import ChildIcon from 'assets/icons/Child'
import GreenCircle from 'assets/icons/GreenCircle'
import RemoveCircle from 'assets/icons/RemoveCircle'
import classNames from 'classnames'
import { WithErrorPanel } from 'components/StyledComponents'
import { Option } from 'declarations/app'
import { State } from 'declarations/reducers'
import { Barn, F002Sed, FSed, PersonInfo, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import Chevron from 'nav-frontend-chevron'
import { Checkbox, FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  FlexCenterDiv,
  FlexCenterSpacedDiv,
  HighContrastFlatknapp,
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
import { isFSed } from 'utils/sed'
import Adresser from './Adresser/Adresser'
import BeløpNavnOgValuta from './BeløpNavnOgValuta/BeløpNavnOgValuta'
import Familierelasjon from './Familierelasjon/Familierelasjon'
import Forsikring from './Forsikring/Forsikring'
import GrunnlagForBosetting from './GrunnlagForBosetting/GrunnlagForBosetting'
import InntektForm from './InntektForm/InntektForm'
import Kontaktinformasjon from './Kontaktinformasjon/Kontaktinformasjon'
import Nasjonaliteter from './Nasjonaliteter/Nasjonaliteter'
import PeriodeForDagpenger from './PeriodeForDagpenger/PeriodeForDagpenger'
import PersonensStatus from './PersonensStatus/PersonensStatus'
import PersonOpplysninger from './PersonOpplysninger/PersonOpplysninger'
import Referanseperiode from './Referanseperiode/Referanseperiode'
import Relasjon from './Relasjon/Relasjon'
import RettTilYtelser from './RettTilYtelser/RettTilYtelser'
import SvarPåForespørsel from './SvarPåForespørsel/SvarPåForespørsel'
import Trygdeordning from './Trygdeordning/Trygdeordning'

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
const OptionDiv = styled.div`
  transition: all 0.2s ease-in-out;
  padding: 0.5rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }: any) => theme[themeKeys.ALTERNATIVE_HOVER_COLOR]};
  }
  &.selected {
    font-weight: bold;
    background-color: ${({ theme }: any) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
    border-left: 6px solid ${({ theme }: any) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
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
  padding: 1rem 0.5rem;
`
const MenuLabelDiv = styled(FlexCenterDiv)`
  cursor: pointer;
  padding: 1rem 0.5rem;
  flex: 1;
  transition: all 0.2s ease-in-out;
  &:hover {
   background-color: ${({ theme }: any) => theme[themeKeys.ALTERNATIVE_HOVER_COLOR]};
  }
`
const CheckboxDiv = styled.div`
  transition: all 0.3s ease-in-out;
  &:hover {
   background-color: ${({ theme }: any) => theme[themeKeys.ALTERNATIVE_HOVER_COLOR]};
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

const RightFlexCenterSpacedDiv = styled.div`
  text-align: center;
`
const MarginDiv = styled.div`
  padding: 1rem 0.5rem;
`
const LandSpan = styled.span`
  color: grey;
  white-space: nowrap;
`
const MenuLabelText = styled(Normaltekst)`
  &.selected {
    font-weight: bold;
  }
`

export interface PersonManagerProps {
  viewValidation: boolean
}

export interface PersonManagerSelector extends PersonManagerFormSelector {
  gettingPerson: boolean
}

export interface PersonManagerFormProps {
  parentNamespace: string
  personID: string | undefined
  personName: string
}

export interface PersonManagerFormSelector {
  replySed: ReplySed | null | undefined
  validation: Validation
}

export interface PersonManagerOption extends Option {
  component: any
  type: string | Array<string>
  normal: boolean
  barn: boolean
  family: boolean
  condition ?: () => void
}

const mapState = (state: State): PersonManagerSelector => ({
  gettingPerson: state.loading.gettingPerson,
  replySed: state.svarpased.replySed,
  validation: state.validation.status
})

const PersonManager: React.FC<PersonManagerProps> = ({viewValidation}: PersonManagerProps) => {
  const { t } = useTranslation()
  const {
    gettingPerson,
    replySed,
    validation
  }: any = useSelector<State, PersonManagerSelector>(mapState)
  const namespace = 'personmanager'

  const brukerNr = 1
  const initialSelectedMenus = ['bruker']
  const ektefelleNr = brukerNr + ((replySed as F002Sed).ektefelle ? 1 : 0)
  if (ektefelleNr > 0) initialSelectedMenus.push('ektefelle')
  const annenPersonNr = ektefelleNr + ((replySed as F002Sed).annenPerson ? 1 : 0)
  if (annenPersonNr > 0) initialSelectedMenus.push('annenPerson')
  const barnNr = annenPersonNr + ((replySed as F002Sed).barn ? 1 : 0)
  const totalPeopleNr = annenPersonNr + ((replySed as F002Sed).barn?.length ?? 0);
  (replySed as F002Sed).barn?.forEach((b: Barn, i: number) => initialSelectedMenus.push(`barn[${i}]`))
  let familieNr: number | undefined
  if ((replySed as F002Sed).sedType.startsWith('F')) {
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
  const initialMenuOption = totalPeopleNr === 1
    ? (isFSed(replySed) ? 'personopplysninger' : 'person')
    : undefined
  const [currentMenuOption, _setCurrentMenuOption] = useState<string | undefined>(initialMenuOption)
  const alreadyOpenMenu = (menu: string) => _.find(openMenus, _id => _id === menu) !== undefined

  const [statistics, _setStatistics] = useState<any>({})

  useEffect(() => {
    if (!_.isNil(initialMenuOption)) {
      _setStatistics({
        [initialMenuOption]: { total: 0, status: 'stop' }
      })
    }
    return () => {
      standardLogger('svarsed.editor.personmanager.time', statistics)
    }
  }, [])

  const setCurrentMenuOption = (newMenu: string | undefined) => {
    const previousMenu = currentMenuOption
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
    _setCurrentMenuOption(newMenu)
  }

  const menuRef = useRef(currentMenu + '|' + currentMenuOption)

  const options: Array<PersonManagerOption> = [
    { label: t('el:option-personmanager-1'), value: 'personopplysninger', component: PersonOpplysninger, type: 'F', normal: true, barn: true, family: false },
    { label: t('el:option-personmanager-2'), value: 'nasjonaliteter', component: Nasjonaliteter, type: 'F', normal: true, barn: true, family: false },
    { label: t('el:option-personmanager-3'), value: 'adresser', component: Adresser, type: 'F', normal: true, barn: true, family: false },
    { label: t('el:option-personmanager-4'), value: 'kontaktinformasjon', component: Kontaktinformasjon, type: 'F', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-5'), value: 'trygdeordninger', component: Trygdeordning, type: 'F', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-6'), value: 'familierelasjon', component: Familierelasjon, type: 'F', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-7'), value: 'personensstatus', component: PersonensStatus, type: 'F', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-8'), value: 'relasjon', component: Relasjon, type: 'F', normal: false, barn: true, family: false },
    { label: t('el:option-personmanager-9'), value: 'grunnlagforbosetting', component: GrunnlagForBosetting, type: 'F', normal: false, barn: true, family: false },
    {
      label: t('el:option-personmanager-10'),
      value: 'beløpnavnogvaluta',
      component: BeløpNavnOgValuta,
      type: 'F',
      normal: false,
      barn: true,
      family: false,
      condition: () => {
        console.log((replySed as FSed)?.formaal?.indexOf('vedtak') >= 0 ?? false)
        return (replySed as FSed)?.formaal?.indexOf('vedtak') >= 0 ?? false
      }
    },
    { label: t('el:option-personmanager-11'), value: 'familieytelser', component: BeløpNavnOgValuta, type: 'F', normal: false, barn: false, family: true },
    { label: t('el:option-personmanager-12'), value: 'personopplysninger', component: PersonOpplysninger, type: 'U', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-13'), value: 'referanseperiode', component: Referanseperiode, type: 'U', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-14'), value: 'arbeidsforhold/arbeidsgivere', component: Arbeidsforhold, type: 'U002', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-15'), value: 'inntekt', component: InntektForm, type: 'U004', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-16'), value: 'retttilytelser', component: RettTilYtelser, type: 'U017', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-17'), value: 'forsikring', component: Forsikring, type: ['U002', 'U017'], normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-18'), value: 'sisteansettelsesforhold', component: SisteAnsettelsesForhold, type: ['U002', 'U017'], normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-19'), value: 'grunntilopphør', component: GrunnTilOpphør, type: ['U002', 'U017'], normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-20'), value: 'periodefordagpenger', component: PeriodeForDagpenger, type: ['U002', 'U017'], normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-12'), value: 'personopplysninger', component: PersonOpplysninger, type: 'H', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-3'), value: 'adresser', component: Adresser, type: 'H', normal: true, barn: true, family: false },
    { label: t('el:option-personmanager-21'), value: 'svarpåforespørsel', component: SvarPåForespørsel, type: 'H', normal: true, barn: true, family: false }
  ]

  const getForm = (value: string): JSX.Element | null => {
    const option: PersonManagerOption | undefined = _.find(options, o => o.value === value)
    if (option) {
      const Component = option.component
      return (
        <Component
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )
    }
    return null
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
        const p = _.get(replySed, menu)
        const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn
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
          ? _.find(options, o => o.family === true)?.value
          : options[0].value
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

  const renderMenu = (replySed: ReplySed, personId: string, totalIndex: number) => {
    const personInfo: PersonInfo | undefined = _.get(replySed, `${personId}.personInfo`) // undefined for family
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
            <Chevron type={open ? 'ned' : 'høyre'} />
            <HorizontalSeparatorDiv size='0.5' />
            {viewValidation && (
              validation[namespace + '-' + personId]
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
              <MenuLabelText className={classNames({ selected: selected })}>
                {personId === 'familie'
                  ? t('label:hele-familien')
                  : personInfo?.fornavn + ' ' + personInfo?.etternavn}
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
                <ChildIcon />
              </>
            )}
          </MenuLabelDiv>
          {isFSed(replySed) && (
            <CheckboxDiv>
              <MenuCheckbox
                aria-label={t('label:velg-person', { person: personInfo?.fornavn + ' ' + personInfo?.etternavn })}
                aria-checked={selected}
                checked={selected}
                label=''
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.stopPropagation()
                  onSelectMenu(personId, e.target.checked)
                }}
              />
            </CheckboxDiv>
          )}
        </MenuDiv>
        {open && options
          .filter(o => {
            return _.isString(o.type)
              ? replySed.sedType.startsWith(o.type)
              : o.type.indexOf(replySed.sedType) >= 0
          })
          .filter(o => personId.startsWith('barn')
            ? o.barn
            : personId === 'familie'
              ? o.family
              : o.normal
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
                    ? <GreenCircle height={20} />
                    : <RemoveCircle height={20} color='red' />
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
    const feil: FeiloppsummeringFeil = e.detail
    const namespaceBits = feil.skjemaelementId.split('-')
    if (namespaceBits[0] === namespace) {
      const newMenu = namespaceBits[1]
      const newOption = namespaceBits[2].split('[')[0]
      const [currentMenu, currentMenuOption] = menuRef.current.split('|')
      if (!(newMenu === currentMenu && newOption === currentMenuOption)) {
        changeMenu(newMenu, newOption, 'event')
      }
      setTimeout(() => {
        const element = document.getElementById(feil.skjemaelementId)
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
    setCurrentMenuOption(totalPeopleNr === 1 ? (isFSed(replySed) ? 'personopplysninger' : 'person') : undefined)
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
    <PileDiv key={replySed.sedType + '-' + ((replySed as FSed)?.formaal?.join(',') ?? '')}>
      {_seeNewPersonModal && (
        <AddPersonModal
          parentNamespace={namespace}
          onModalClose={() => setSeeNewPersonModal(false)}
        />
      )}
      <Undertittel>
        {t('label:personmanager')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <WithErrorPanel
        border
        className={classNames({ feil: validation[namespace]?.feilmelding })}
      >
        <FlexCenterSpacedDiv>
          <LeftDiv className='left'>
            {replySed.bruker && renderMenu(replySed, 'bruker', brukerNr)}
            {(replySed as F002Sed).ektefelle && renderMenu(replySed, 'ektefelle', ektefelleNr)}
            {(replySed as F002Sed).annenPerson && renderMenu(replySed, 'annenPerson', annenPersonNr)}
            {(replySed as F002Sed).barn?.map((b: any, i: number) => renderMenu(replySed, `barn[${i}]`, barnNr + i))}
            {isFSed(replySed) && renderMenu(replySed, 'familie', familieNr as number)}
            {isFSed(replySed) && (
              <MarginDiv>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={onAddNewPerson}
                >
                  <Add />
                  <HorizontalSeparatorDiv size='0.5' />
                  {t('el:button-add-new-x', { x: t('label:person') })}
                </HighContrastFlatknapp>
              </MarginDiv>
            )}
            <VerticalSeparatorDiv />
          </LeftDiv>
          <RightDiv className='mainright'>
            {gettingPerson && (
              <RightFlexCenterSpacedDiv>
                {t('message:loading-getting-person')}
              </RightFlexCenterSpacedDiv>
            )}
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
