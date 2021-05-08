import { fetchInntekt, getArbeidsperioder, searchPerson } from 'actions/svarpased'
import AddPersonModal from 'applications/SvarSed/PersonManager/AddPersonModal/AddPersonModal'
import Arbeidsforhold from 'applications/SvarSed/PersonManager/Arbeidsforhold/Arbeidsforhold'
import GrunnTilOpphør from 'applications/SvarSed/PersonManager/GrunnTilOpphør/GrunnTilOpphør'
import SisteAnsettelsesForhold from 'applications/SvarSed/PersonManager/SisteAnsettelsesForhold/SisteAnsettelsesForhold'
import Add from 'assets/icons/Add'
import GreenCircle from 'assets/icons/GreenCircle'
import ChildIcon from 'assets/icons/Child'
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
  FlexCenterDiv, FlexCenterSpacedDiv, PileDiv, PileCenterDiv,
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  theme,
  themeHighContrast,
  themeKeys,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import { isFSed } from 'utils/sed'
import Adresser from './Adresser/Adresser'
import BeløpNavnOgValuta from './BeløpNavnOgValuta/BeløpNavnOgValuta'
import Familierelasjon from './Familierelasjon/Familierelasjon'
import Familieytelser from './Familieytelser/Familieytelser'
import GrunnlagForBosetting from './GrunnlagForBosetting/GrunnlagForBosetting'
import Kontaktinformasjon from './Kontaktinformasjon/Kontaktinformasjon'
import Nasjonaliteter from './Nasjonaliteter/Nasjonaliteter'
import PersonensStatus from './PersonensStatus/PersonensStatus'
import PersonOpplysninger from './PersonOpplysninger/PersonOpplysninger'
import Referanseperiode from './Referanseperiode/Referanseperiode'
import Relasjon from './Relasjon/Relasjon'
import Trygdeordning from './Trygdeordning/Trygdeordning'
import Forsikring from './Forsikring/Forsikring'
import PeriodeForDagpenger from './PeriodeForDagpenger/PeriodeForDagpenger'
import InntektForm from './InntektForm/InntektForm'
import RettTilYtelser from './RettTilYtelser/RettTilYtelser'
import SvarPåForespørsel from './SvarPåForespørsel/SvarPåForespørsel'

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
   background-color: ${(props: any) => props['data-highContrast']
     ? themeHighContrast[themeKeys.ALTERNATIVE_HOVER_COLOR]
     : theme[themeKeys.ALTERNATIVE_HOVER_COLOR]};
  }
`
const CheckboxDiv = styled.div`
  transition: all 0.3s ease-in-out;
  &:hover {
   background-color: ${(props: any) => props['data-highContrast']
  ? themeHighContrast[themeKeys.ALTERNATIVE_HOVER_COLOR]
  : theme[themeKeys.ALTERNATIVE_HOVER_COLOR]};
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
  fnr: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation,
  viewValidation: boolean
}

const mapState = (state: State): any => ({
  arbeidsperioder: state.svarpased.arbeidsperioder,
  familierelasjonKodeverk: state.app.familierelasjoner,
  highContrast: state.ui.highContrast,
  gettingArbeidsperioder: state.loading.gettingArbeidsperioder,
  gettingInntekter: state.loading.gettingInntekter,
  gettingPerson: state.loading.gettingPerson,
  inntekter: state.svarpased.inntekter,
  landkoderList: state.app.landkoder,
  searchingPerson: state.loading.searchingPerson,
  searchedPerson: state.svarpased.searchedPerson,
  valgteArbeidsgivere: state.svarpased.valgteArbeidsgivere
})

const PersonManager: React.FC<PersonManagerProps> = ({
  fnr,
  replySed,
  resetValidation,
  updateReplySed,
  validation,
  viewValidation
}: PersonManagerProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
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

  const {
    arbeidsperioder,
    familierelasjonKodeverk,
    gettingArbeidsperioder,
    gettingInntekter,
    gettingPerson,
    highContrast,
    inntekter,
    landkoderList,
    searchingPerson,
    searchedPerson
  }: any = useSelector<State, any>(mapState)

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
          highContrast={highContrast}
          landkoderList={landkoderList}
          parentNamespace={namespace}
          onSearchingPerson={(id: string) => dispatch(searchPerson(id))}
          personID={currentMenu!}
          resetValidation={resetValidation}
          replySed={replySed}
          searchingPerson={searchingPerson}
          searchedPerson={searchedPerson}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'nasjonaliteter' && (
        <Nasjonaliteter
          highContrast={highContrast}
          landkoderList={landkoderList}
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
          resetValidation={resetValidation}
          replySed={replySed}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'adresser' && (
        <Adresser
          highContrast={highContrast}
          landkoderList={landkoderList}
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'kontaktinformasjon' && (
        <Kontaktinformasjon
          highContrast={highContrast}
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'trygdeordninger' && (
        <Trygdeordning
          highContrast={highContrast}
          parentNamespace={namespace}
          personID={currentMenu!}
          personName={currentMenuLabel!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'familierelasjon' && (
        <Familierelasjon
          familierelasjonKodeverk={familierelasjonKodeverk}
          parentNamespace={namespace}
          highContrast={highContrast}
          personID={currentMenu!}
          personName={currentMenuLabel!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'relasjon' && (
        <Relasjon
          familierelasjonKodeverk={familierelasjonKodeverk}
          highContrast={highContrast}
          parentNamespace={namespace}
          personID={currentMenu!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'personensstatus' && (
        <PersonensStatus
          arbeidsperioder={arbeidsperioder}
          gettingArbeidsperioder={gettingArbeidsperioder}
          getArbeidsperioder={_getArbeidsperioder}
          highContrast={highContrast}
          parentNamespace={namespace}
          personID={currentMenu!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'grunnlagforbosetting' && (
        <GrunnlagForBosetting
          parentNamespace={namespace}
          personID={currentMenu!}
          replySed={replySed}
          resetValidation={resetValidation}
          standalone
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'beløpnavnogvaluta' && (
        <BeløpNavnOgValuta
          parentNamespace={namespace}
          highContrast={highContrast}
          personID={currentMenu!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'familieytelser' && (
        <Familieytelser
          highContrast={highContrast}
          parentNamespace={namespace}
          personID={currentMenu!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'referanseperiode' && (
        <Referanseperiode
          parentNamespace={namespace}
          personID={currentMenu!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'arbeidsforhold/arbeidsgivere' && (
        <Arbeidsforhold
          arbeidsperioder={arbeidsperioder}
          gettingArbeidsperioder={gettingArbeidsperioder}
          getArbeidsperioder={_getArbeidsperioder}
          inntekter={inntekter}
          gettingInntekter={gettingInntekter}
          getInntekter={_getInntekter}
          highContrast={highContrast}
          parentNamespace={namespace}
          personID={currentMenu!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'forsikring' && (
        <Forsikring
          arbeidsperioder={arbeidsperioder}
          gettingArbeidsperioder={gettingArbeidsperioder}
          getArbeidsperioder={_getArbeidsperioder}
          inntekter={inntekter}
          gettingInntekter={gettingInntekter}
          getInntekter={_getInntekter}
          highContrast={highContrast}
          parentNamespace={namespace}
          personID={currentMenu!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'sisteansettelsesforhold' && (
        <SisteAnsettelsesForhold
          highContrast={highContrast}
          parentNamespace={namespace}
          personID={currentMenu!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'grunntilopphør' && (
        <GrunnTilOpphør
          highContrast={highContrast}
          parentNamespace={namespace}
          personID={currentMenu!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'periodefordagpenger' && (
        <PeriodeForDagpenger
          landkoderList={landkoderList}
          parentNamespace={namespace}
          personID={currentMenu!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'inntekt' && (
        <InntektForm
          highContrast={highContrast}
          inntekter={inntekter}
          gettingInntekter={gettingInntekter}
          getInntekter={_getInntekter}
          parentNamespace={namespace}
          personID={currentMenu!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'retttilytelser' && (
        <RettTilYtelser
          parentNamespace={namespace}
          personID={currentMenu!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      )}
      {option === 'svarpåforespørsel' && (
        <SvarPåForespørsel
          highContrast={highContrast}
          parentNamespace={namespace}
          personID={currentMenu!}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
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
        <MenuDiv
          data-highContrast={highContrast}
        >
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
                label=''
                checked={selected}
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
                data-highContrast={highContrast}
                key={o.value}
                style={{ animationDelay: i * 0.03 + 's' }}
                className={classNames({
                  slideInFromLeft: true,
                  selected: currentMenu === personId && currentMenuOption === o.value
                })}
                onClick={() => changeMenu(personId, o.value, 'click')}
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

  const _getArbeidsperioder = () => {
    if (fnr) dispatch(getArbeidsperioder(fnr))
  }

  const _getInntekter = () => {
    if (fnr) dispatch(fetchInntekt(fnr))
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
          highContrast={highContrast}
          parentNamespace={namespace}
          replySed={replySed}
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
