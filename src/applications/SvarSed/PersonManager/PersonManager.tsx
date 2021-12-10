import { Add, Child, ErrorFilled, ExpandFilled, NextFilled, SuccessFilled } from '@navikt/ds-icons'
import { BodyLong, Button, Checkbox } from '@navikt/ds-react'
import { finishMenuStatistic, logMenuStatistic, startMenuStatistic } from 'actions/statistics'
import Perioder from 'applications/PDU1/Perioder/Perioder'
import Person from 'applications/PDU1/Person/Person'
import SisteAnsettelseInfo from 'applications/PDU1/SisteAnsettelseInfo/SisteAnsettelseInfo'
import Statsborgerskap from 'applications/PDU1/Statsborgerskap/Statsborgerskap'
import UtbetalingFC from 'applications/PDU1/Utbetaling/Utbetaling'
import AddPersonModal from 'applications/SvarSed/PersonManager/AddPersonModal/AddPersonModal'
import Arbeidsperioder from 'applications/SvarSed/PersonManager/Arbeidsperioder/Arbeidsperioder'
import GrunnTilOpphør from 'applications/SvarSed/PersonManager/GrunnTilOpphør/GrunnTilOpphør'
import SisteAnsettelsesForhold from 'applications/SvarSed/PersonManager/SisteAnsettelsesForhold/SisteAnsettelsesForhold'
import classNames from 'classnames'
import { WithErrorPanel } from 'components/StyledComponents'
import { Option } from 'declarations/app'
import { ErrorElement } from 'declarations/app.d'
import { ReplyPdu1 } from 'declarations/pd'
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
import Adresse from './Adresser/Adresse'
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
  border-right: 1px solid var(--navds-color-border);
  border-width: 1px;
  border-style: solid;
  border-color: var(--navds-color-border);
  background-color: var(--navds-semantic-color-component-background-alternate);
  border-top-left-radius: var(--navds-border-radius);
  border-bottom-left-radius: var(--navds-border-radius);
`
const OptionDiv = styled.div`
  transition: all 0.2s ease-in-out;
  padding: 0.5rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: var(--navds-color-hover);
  }
  &.selected {
    font-weight: bold;
    background-color: var(--navds-semantic-color-component-background-alternate);
    border-left: 6px solid var(--navds-semantic-color-interaction-primary-default);
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
   background-color: var(--navds-color-hover);
  }
`
const CheckboxDiv = styled.div`
  transition: all 0.3s ease-in-out;
  &:hover {
   background-color: var(--navds-color-hover);
  }
`
const RightDiv = styled.div`
  flex: 3;
  border-left: 1px solid var(--navds-color-border);
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
  border-color: var(--navds-color-border);
  background-color: var(--navds-semantic-color-component-background-alternate);
  border-top-right-radius: var(--navds-border-radius);
  border-bottom-right-radius: var(--navds-border-radius);
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
const MenuLabelText = styled(BodyLong)`
  &.selected {
    font-weight: bold;
  }
`

export interface PersonManagerProps {
  replySed: ReplySed | ReplyPdu1 | null | undefined
  viewValidation: boolean
  setReplySed: (replySed: ReplySed) => void
  updateReplySed: (needle: string, value: any) => void
}

export interface PersonManagerSelector extends PersonManagerFormSelector {
  gettingPerson: boolean
}

export interface PersonManagerFormProps {
  replySed: ReplySed | ReplyPdu1 | null | undefined
  parentNamespace: string
  personID: string | undefined
  personName: string
  setReplySed: (replySed: ReplySed) => void
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

const mapState = (state: State): PersonManagerSelector => ({
  gettingPerson: state.loading.gettingPerson,
  validation: state.validation.status
})

const PersonManager: React.FC<PersonManagerProps> = ({
  replySed,
  setReplySed,
  updateReplySed,
  viewValidation
}: PersonManagerProps) => {
  const { t } = useTranslation()
  const {
    gettingPerson,
    validation
  }: any = useSelector<State, PersonManagerSelector>(mapState)
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
    const _type = (replySed as ReplySed).sedType ?? 'PDU1'
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

  const beløpNavnOgValutaCondition = () => (replySed as FSed)?.formaal?.indexOf('vedtak') >= 0 ?? false

  const forms: Array<Form> = [
    { label: t('el:option-personmanager-personopplyninger'), value: 'personopplysninger', component: PersonOpplysninger, type: 'F', barn: true },
    { label: t('el:option-personmanager-person'), value: 'person_h', component: PersonOpplysninger, type: ['U', 'H'] },
    { label: t('el:option-personmanager-nasjonaliteter'), value: 'nasjonaliteter', component: Nasjonaliteter, type: ['F'], barn: true },
    { label: t('el:option-personmanager-adresser'), value: 'adresser', component: Adresser, type: ['F', 'H'], barn: true },
    { label: t('el:option-personmanager-kontakt'), value: 'kontaktinformasjon', component: Kontaktinformasjon, type: 'F' },
    { label: t('el:option-personmanager-trygdeordninger'), value: 'trygdeordninger', component: Trygdeordning, type: 'F' },
    { label: t('el:option-personmanager-familierelasjon'), value: 'familierelasjon', component: Familierelasjon, type: 'F' },
    { label: t('el:option-personmanager-personensstatus'), value: 'personensstatus', component: PersonensStatus, type: 'F' },
    { label: t('el:option-personmanager-relasjon'), value: 'relasjon', component: Relasjon, type: 'F', barn: true },
    { label: t('el:option-personmanager-grunnlagforbosetting'), value: 'grunnlagforbosetting', component: GrunnlagForBosetting, type: 'F', barn: true },
    { label: t('el:option-personmanager-beløpnavnogvaluta'), value: 'beløpnavnogvaluta', component: BeløpNavnOgValuta, type: 'F', barn: true, condition: beløpNavnOgValutaCondition },
    { label: t('el:option-personmanager-familieytelser'), value: 'familieytelser', component: BeløpNavnOgValuta, type: 'F', family: true },
    { label: t('el:option-personmanager-referanseperiode'), value: 'referanseperiode', component: Referanseperiode, type: 'U' },
    { label: t('el:option-personmanager-arbeidsperioder'), value: 'arbeidsperioder', component: Arbeidsperioder, type: 'U002' },
    { label: t('el:option-personmanager-inntekt'), value: 'inntekt', component: InntektForm, type: 'U004' },
    { label: t('el:option-personmanager-retttilytelser'), value: 'retttilytelser', component: RettTilYtelser, type: ['U017'] },
    { label: t('el:option-personmanager-forsikring'), value: 'forsikring', component: Forsikring, type: ['U002', 'U017'] },
    { label: t('el:option-personmanager-sisteansettelsesforhold'), value: 'sisteansettelsesforhold', component: SisteAnsettelsesForhold, type: ['U002', 'U017'] },
    { label: t('el:option-personmanager-grunntilopphør'), value: 'grunntilopphør', component: GrunnTilOpphør, type: ['U002', 'U017'] },
    { label: t('el:option-personmanager-periodefordagpenger'), value: 'periodefordagpenger', component: PeriodeForDagpenger, type: ['U002', 'U017'] },
    { label: t('el:option-personmanager-svarpåforespørsel'), value: 'svarpåforespørsel', component: SvarPåForespørsel, type: 'H' },

    { label: t('el:option-personmanager-person'), value: 'person_pd', component: Person, type: 'PD' },
    { label: t('el:option-personmanager-statsborgerskap'), value: 'statsborgerskap', component: Statsborgerskap, type: 'PD' },
    { label: t('el:option-personmanager-adresse'), value: 'adresse', component: Adresse, type: ['PD'], options: { bygning: false, region: false } },
    { label: t('el:option-personmanager-perioder'), value: 'perioder', component: Perioder, type: 'PD' },
    { label: t('el:option-personmanager-sisteansettelseinfo'), value: 'sisteansettelseinfo', component: SisteAnsettelseInfo, type: 'PD' },
    { label: t('el:option-personmanager-utbetaling'), value: 'utbetaling', component: UtbetalingFC, type: 'PD' }

  ]

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
        const personName = !_.isEmpty(p.personInfo)
          ? p.personInfo.fornavn + ' ' + (p.personInfo.etternavn ?? '')
          : p.fornavn + ' ' + (p.etternavn ?? '')
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

  const renderMenu = (replySed: ReplySed | ReplyPdu1, personId: string, totalIndex: number) => {
    const personInfo: PersonInfo | undefined = _.get(replySed, `${personId}.personInfo`) // undefined for family pr pdu1
    const personName = personId === 'familie'
      ? t('label:hele-familien')
      : personInfo
        ? personInfo?.fornavn + ' ' + (personInfo?.etternavn ?? '')
        : (replySed as ReplyPdu1).bruker.fornavn + ' ' + ((replySed as ReplyPdu1).bruker.etternavn ?? '')

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
            const _type = (replySed as ReplySed).sedType ?? 'PDU1'
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
