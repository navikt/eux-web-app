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
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { F002Sed, PersonInfo, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
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
import Familieytelser from './Familieytelser/Familieytelser'
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
    background-color: ${({theme}: any) => theme[themeKeys.ALTERNATIVE_HOVER_COLOR]};
  }
  &.selected {
    font-weight: bold;
    background-color: ${({theme}: any) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
    border-left: 6px solid ${({theme}: any) => theme[themeKeys.MAIN_INTERACTIVE_COLOR]};
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
   background-color: ${({theme}: any) => theme[themeKeys.ALTERNATIVE_HOVER_COLOR]};
  }
`
const CheckboxDiv = styled.div`
  transition: all 0.3s ease-in-out;
  &:hover {
   background-color: ${({theme}: any) => theme[themeKeys.ALTERNATIVE_HOVER_COLOR]};
  }
`
const RightDiv = styled.div`
  flex: 3;
  border-left: 1px solid ${({theme}: any) => theme[themeKeys.MAIN_BORDER_COLOR]};
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

export interface PersonManagerSelector {
  gettingPerson: boolean
  replySed: ReplySed | undefined
  validation: Validation
  viewValidation: boolean
}

const mapState = (state: State): PersonManagerSelector => ({
  gettingPerson: state.loading.gettingPerson,
  replySed: state.svarpased.replySed,
  validation: state.validation.status,
  viewValidation: state.validation.view
})

const PersonManager: React.FC = () => {
  const { t } = useTranslation()
  const {
    gettingPerson,
    replySed,
    validation,
    viewValidation
  }: any = useSelector<State, PersonManagerSelector>(mapState)
  const namespace = 'personmanager'

  const brukerNr = 1
  const initialSelectedMenus = ['bruker']
  const ektefelleNr = brukerNr + ((replySed as F002Sed).ektefelle ? 1 : 0)
  if (ektefelleNr > 0) initialSelectedMenus.push('ektefelle')
  const annenPersonNr = ektefelleNr + ((replySed as F002Sed).annenPerson ? 1 : 0)
  if (annenPersonNr > 0) initialSelectedMenus.push('annenPerson')
  const barnNr = annenPersonNr + ((replySed as F002Sed).barn ? 1 : 0)
  const totalPeopleNr = annenPersonNr + ((replySed as F002Sed).barn ? (replySed as F002Sed).barn.length : 0)
  if ((replySed as F002Sed).barn) {
    (replySed as F002Sed).barn.forEach((b, i) => initialSelectedMenus.push(`barn[${i}]`))
  }
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
  const [currentMenuOption, setCurrentMenuOption] = useState<string | undefined>(totalPeopleNr === 1
    ? (isFSed(replySed) ? 'personopplysninger' : 'person')
    : undefined)
  const alreadyOpenMenu = (menu: string) => _.find(openMenus, _id => _id === menu) !== undefined

  const menuRef = useRef(currentMenu + '|' + currentMenuOption)

  const options: Options = [
    { label: t('el:option-personmanager-1'), value: 'personopplysninger', type: 'F', normal: true, barn: true, family: false },
    { label: t('el:option-personmanager-2'), value: 'nasjonaliteter', type: 'F', normal: true, barn: true, family: false },
    { label: t('el:option-personmanager-3'), value: 'adresser', type: 'F', normal: true, barn: true, family: false },
    { label: t('el:option-personmanager-4'), value: 'kontaktinformasjon', type: 'F', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-5'), value: 'trygdeordninger', type: 'F', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-6'), value: 'familierelasjon', type: 'F', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-7'), value: 'personensstatus', type: 'F', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-8'), value: 'relasjon', type: 'F', normal: false, barn: true, family: false },
    { label: t('el:option-personmanager-9'), value: 'grunnlagforbosetting', type: 'F', normal: false, barn: true, family: false },
    { label: t('el:option-personmanager-10'), value: 'beløpnavnogvaluta', type: 'F', normal: false, barn: true, family: false },
    { label: t('el:option-personmanager-11'), value: 'familieytelser', type: 'F', normal: false, barn: false, family: true },
    { label: t('el:option-personmanager-12'), value: 'person', type: 'U', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-13'), value: 'referanseperiode', type: 'U', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-14'), value: 'arbeidsforhold/arbeidsgivere', type: 'U002', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-15'), value: 'inntekt', type: 'U004', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-16'), value: 'retttilytelser', type: 'U017', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-17'), value: 'forsikring', type: 'U', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-18'), value: 'sisteansettelsesforhold', type: 'U', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-19'), value: 'grunntilopphør', type: 'U', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-20'), value: 'periodefordagpenger', type: 'U', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-12'), value: 'person', type: 'H', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-3'), value: 'adresser', type: 'H', normal: true, barn: true, family: false },
    { label: t('el:option-personmanager-21'), value: 'svarpåforespørsel', type: 'H', normal: true, barn: true, family: false }
  ]

  const getForm = (option: string): JSX.Element => (
    <>
      {(option === 'personopplysninger' || option === 'person') && (
        <PersonOpplysninger
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'nasjonaliteter' && (
        <Nasjonaliteter
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'adresser' && (
        <Adresser
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'kontaktinformasjon' && (
        <Kontaktinformasjon
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'trygdeordninger' && (
        <Trygdeordning
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'familierelasjon' && (
        <Familierelasjon
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'relasjon' && (
        <Relasjon
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'personensstatus' && (
        <PersonensStatus
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'grunnlagforbosetting' && (
        <GrunnlagForBosetting
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'beløpnavnogvaluta' && (
        <BeløpNavnOgValuta
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'familieytelser' && (
        <Familieytelser
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'referanseperiode' && (
        <Referanseperiode
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'arbeidsforhold/arbeidsgivere' && (
        <Arbeidsforhold
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'forsikring' && (
        <Forsikring
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'sisteansettelsesforhold' && (
        <SisteAnsettelsesForhold
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'grunntilopphør' && (
        <GrunnTilOpphør
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'periodefordagpenger' && (
        <PeriodeForDagpenger
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'inntekt' && (
        <InntektForm
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'retttilytelser' && (
        <RettTilYtelser
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
      {option === 'svarpåforespørsel' && (
        <SvarPåForespørsel
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
        />
      )}
    </>
  )

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
              <MenuLabelText className={classNames({ selected: selected })}>
                {personId === 'familie'
                  ? t('label:hele-familien')
                  : personInfo?.fornavn + ' ' + personInfo?.etternavn}
              </MenuLabelText>
              <HorizontalSeparatorDiv size='0.5' />
              {personInfo?.statsborgerskap && (
                <LandSpan>
                  {' (' + personInfo?.statsborgerskap.map(s => s.land).join(', ') + ')'}
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
                aria-label={t('label:velg-person', {person: personInfo?.fornavn + ' ' + personInfo?.etternavn})}
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
          .filter(o => replySed.sedType.startsWith(o.type))
          .filter(o => personId.startsWith('barn')
            ? o.barn
            : personId === 'familie'
              ? o.family
              : o.normal
          )
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
                    ? <GreenCircle />
                    : <RemoveCircle color='red' />
                )}
                <HorizontalSeparatorDiv size='0.5' />
                {`${i + 1}. ${o.label}`}
              </OptionDiv>
            )
          })}
      </PileDiv>
    )
  }

  const handleEvent = (e: any) => {
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

  useEffect(() => {
    document.addEventListener('feillenke', handleEvent)
    return () => {
      document.removeEventListener('feillenke', handleEvent)
    }
  }, [])

  return (
    <PileDiv>
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
        className={classNames({ feil: validation[namespace]?.feilmelding })}>
        <FlexCenterSpacedDiv>
          <LeftDiv className='left'>
            {replySed.bruker && renderMenu(replySed, 'bruker', brukerNr)}
            {(replySed as F002Sed).ektefelle && renderMenu(replySed, 'ektefelle', ektefelleNr)}
            {(replySed as F002Sed).annenPerson && renderMenu(replySed, 'annenPerson', annenPersonNr)}
            {(replySed as F002Sed).barn && (replySed as F002Sed).barn.map((b: any, i: number) => renderMenu(replySed, `barn[${i}]`, barnNr + i))}
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