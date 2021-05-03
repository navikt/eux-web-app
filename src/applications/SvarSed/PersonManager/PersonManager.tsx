import { fetchInntekt, getArbeidsperioder, searchPerson } from 'actions/svarpased'
import AddPersonModal from 'applications/SvarSed/PersonManager/AddPersonModal/AddPersonModal'
import Arbeidsforhold from 'applications/SvarSed/PersonManager/Arbeidsforhold/Arbeidsforhold'
import Add from 'assets/icons/Add'
import GreenCircle from 'assets/icons/GreenCircle'
import Barn from 'assets/icons/Child'
import RemoveCircle from 'assets/icons/RemoveCircle'
import classNames from 'classnames'
import { FlexCenterDiv, FormaalPanel, PileDiv } from 'components/StyledComponents'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { F002Sed, PersonInfo, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import Chevron from 'nav-frontend-chevron'
import { Checkbox, FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  theme,
  themeHighContrast,
  themeKeys,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { isFamilieytelser } from 'utils/sed'
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

const LeftDiv = styled.div`
  flex: 1;
  align-self: flex-start;
  border-right: 1px solid ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_COLOR]};
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

const PersonAndCheckboxDiv = styled.div`
  display: flex;
  justify-content: space-between;
  .skjemaelement {
     display: flex;
  }
`
const PersonCheckbox = styled(Checkbox)`
  padding: 1rem 0.5rem;
`
const PersonDiv = styled.div`
  display: flex;
  align-items: center;
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
  padding: 0.5rem;
  border-left: 1px solid ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_COLOR]};
  margin-left: -1px;
  align-self: flex-start;
  min-width: 200px;
`
const RightFlexCenterDiv = styled.div`
  text-align: center;
`
const CustomHighContrastPanel = styled(FormaalPanel)`
  padding: 0rem;
`
const MarginDiv = styled.div`
  padding: 1rem 0.5rem;
`
const LandSpan = styled.span`
  color: grey;
  white-space: nowrap;
`
const NormaltekstBold = styled(Normaltekst)`
  font-weight: bold;
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
  let initialSelectedPeople = ['bruker']
  const ektefelleNr = brukerNr + ((replySed as F002Sed).ektefelle ? 1 : 0)
  if (ektefelleNr > 0) initialSelectedPeople.push('ektefelle')
  const annenPersonNr = ektefelleNr + ((replySed as F002Sed).annenPerson ? 1 : 0)
  if (annenPersonNr > 0) initialSelectedPeople.push('annenPerson')
  const barnNr = annenPersonNr + ((replySed as F002Sed).barn ? 1 : 0)
  const totalPeopleNr = annenPersonNr + ((replySed as F002Sed).barn ? (replySed as F002Sed).barn.length : 0)
  if ((replySed as F002Sed).barn) {
    (replySed as F002Sed).barn.forEach((b, i) => initialSelectedPeople.push(`barn[${i}]`))
  }
  let familieNr: number | undefined = undefined
  if ((replySed as F002Sed).sedType.startsWith('F')) {
    familieNr = barnNr + 1
    initialSelectedPeople.push('familie')
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
  // list of persons with open forms. If SED only has bruker, open it by default
  const [_editPersonIDs, setEditPersonIDs] = useState<Array<string>>(totalPeopleNr === 1 ? ['bruker'] : [])
  // person with current form visible
  const [_editCurrentPersonID, setEditCurrentPersonID] = useState<string | undefined>(totalPeopleNr === 1 ? 'bruker': undefined)
  const [_editCurrentPersonName, setEditCurrentPersonName] = useState<string | undefined>(undefined)
  const [_modal, setModal] = useState<boolean>(false)
  // list of selected persons
  const [_selectedPersonIDs, setSelectedPersonIDs] = useState<Array<string>>(initialSelectedPeople)
  // the name of person form currently selected
  const [_menuOption, setMenuOption] = useState<string | undefined>(totalPeopleNr === 1 ? (
    isFamilieytelser(replySed) ? 'personopplysninger' : 'person'
  ) : undefined)


  const changePersonOption = (personID: string | undefined, menuOption: string) => {
    if (personID) {
      setEditCurrentPersonID(personID)
      const alreadyEditingPerson = _.find(_editPersonIDs, _id => _id === personID) !== undefined
      if (!alreadyEditingPerson) {
        const newEditPersons = _editPersonIDs.concat(personID)
        setEditPersonIDs(newEditPersons)
      }
      if (personID !== 'familie') {
        const p = _.get(replySed, personID)
        const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn
        setEditCurrentPersonName(personName)
      } else {
        setEditCurrentPersonName(t('label:hele-familien'))
      }
      setMenuOption(menuOption)
    }
  }

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
    { label: t('el:option-personmanager-14'), value: 'arbeidsforhold/arbeidsgivere', type: 'U', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-15'), value: 'forsikring', type: 'U', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-16'), value: 'sisteansettelsesforhold', type: 'U', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-17'), value: 'grunntilopphør', type: 'U', normal: true, barn: false, family: false },
    { label: t('el:option-personmanager-18'), value: 'periodefordagpenger', type: 'U', normal: true, barn: false, family: false }
  ]

  const onEditPerson = (id: string | undefined) => {
    if (id) {
      const alreadyEditingPerson = _.find(_editPersonIDs, _id => _id === id) !== undefined
      const isEditCurrentPerson = _editCurrentPersonID === id
      setEditCurrentPersonID(isEditCurrentPerson ? undefined : id)
      if (isEditCurrentPerson) {
        setEditCurrentPersonName(undefined)
      } else {
        if (id !== 'familie') {
          const p = _.get(replySed, id)
          const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn
          setEditCurrentPersonName(personName)
        } else {
          setEditCurrentPersonName(t('label:hele-familien'))
        }
      }
      const newEditPersons = alreadyEditingPerson ? _.filter(_editPersonIDs, _id => _id !== id) : _editPersonIDs.concat(id)
      setEditPersonIDs(newEditPersons)
      setMenuOption(isEditCurrentPerson
        ? undefined
        : id === 'familie'
          ? _.find(options, o => o.family === true)?.value
          : options[0].value
      )
    }
  }

  const onSelectPerson = (id: string | undefined, checked: boolean) => {
    if (id) {
      setSelectedPersonIDs(checked
        ? _selectedPersonIDs.concat(id)
        : _.filter(_selectedPersonIDs, _id => _id !== id)
      )
    }
  }

  const onAddNewPerson = () => {
    setModal(true)
  }

  const renderPerson = (replySed: ReplySed, personId: string, totalIndex: number) => {
    const personInfo: PersonInfo | undefined = _.get(replySed, `${personId}.personInfo`) // undefined for family
    const editing: boolean = _.find(_editPersonIDs, _id => _id === personId) !== undefined
    const selected: boolean = _.find(_selectedPersonIDs, _id => _id === personId) !== undefined
    return (
      <PileDiv>
        <PersonAndCheckboxDiv
          data-highContrast={highContrast}
        >
          <PersonDiv
            onClick={() => {
              onEditPerson(personId)
              return false
            }}
            style={{ animationDelay: totalIndex * 0.1 + 's' }}
            className={classNames('personDiv', {
              slideInFromLeft: true,
              selected: _editCurrentPersonID === personId
            })}
          >
            <Chevron type={editing ? 'ned' : 'høyre'} />
            <HorizontalSeparatorDiv data-size='0.5' />

            {viewValidation && (
              validation[namespace + '-' + personId] ? (
                <>
                  <RemoveCircle color='red' />
                  <HorizontalSeparatorDiv data-size='0.5' />
                </>
                ) : (
                <>
                  <GreenCircle />
                  <HorizontalSeparatorDiv data-size='0.5' />
                </>
              )
            )}
            {selected
              ? (
                <>
                  <NormaltekstBold style={{ whiteSpace: 'nowrap' }}>
                    {personId === 'familie'
                      ? t('label:hele-familien')
                      : personInfo?.fornavn + ' ' + personInfo?.etternavn}
                  </NormaltekstBold>
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {personInfo?.statsborgerskap && (
                    <LandSpan>
                      {' (' + personInfo?.statsborgerskap.map(s => s.land).join(', ') + ')'}
                    </LandSpan>
                  )}
                </>
                )
              : (
                <>
                  <Normaltekst style={{ whiteSpace: 'nowrap' }}>
                    {personId === 'familie'
                      ? t('label:hele-familien')
                      : personInfo?.fornavn + ' ' + personInfo?.etternavn}
                  </Normaltekst>
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {personInfo?.statsborgerskap && (
                    <LandSpan>
                      {' (' + personInfo?.statsborgerskap.map(s => s.land).join(', ') + ')'}
                    </LandSpan>
                  )}
                </>
                )}
            {personId.startsWith('barn[') && (
              <>
                <HorizontalSeparatorDiv data-size='0.5' />
                <Barn />
              </>
            )}
          </PersonDiv>
          {isFamilieytelser(replySed)  && (
            <CheckboxDiv>
              <PersonCheckbox
                label=''
                checked={selected}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.stopPropagation()
                  onSelectPerson(personId, e.target.checked)
                }}
              />
            </CheckboxDiv>
          )}
        </PersonAndCheckboxDiv>
        {editing && options
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
                style={{ animationDelay: i * 0.1 + 's' }}
                className={classNames({
                  slideInFromLeft: true,
                  selected: _editCurrentPersonID === personId && _menuOption === o.value
                })}
                onClick={() => changePersonOption(personId, o.value)}
              >
                {viewValidation && (
                  validation[namespace + '-' + personId + '-' + o.value] === undefined
                    ? <GreenCircle />
                    : <RemoveCircle color='red' />
                )}
                <HorizontalSeparatorDiv data-size='0.5' />
                {`${i}. ${o.label}`}
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
      const who = namespaceBits[1]
      const menu = namespaceBits[2]
      changePersonOption(who, menu)
      setTimeout(() => {
        const element = document.getElementById(feil.skjemaelementId)
        element?.scrollIntoView({
          behavior: 'smooth'
        })
        element?.focus()
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
      {_modal && (
        <AddPersonModal
          highContrast={highContrast}
          parentNamespace={namespace}
          replySed={replySed}
          onModalClose={() => setModal(false)}
        />
      )}
      <Undertittel>
        {t('el:title-personmanager')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <CustomHighContrastPanel className={classNames({ feil: validation[namespace]?.feilmelding })}>
        <FlexCenterDiv>
          <LeftDiv>
            {replySed.bruker && renderPerson(replySed, 'bruker', brukerNr)}
            {(replySed as F002Sed).ektefelle && renderPerson(replySed, 'ektefelle', ektefelleNr)}
            {(replySed as F002Sed).annenPerson && renderPerson(replySed, 'annenPerson', annenPersonNr)}
            {(replySed as F002Sed).barn && (replySed as F002Sed).barn.map((b: any, i: number) => renderPerson(replySed, `barn[${i}]`, barnNr + i))}
            {isFamilieytelser(replySed) && renderPerson(replySed, 'familie', familieNr as number)}
            {isFamilieytelser(replySed) && (
              <MarginDiv>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={onAddNewPerson}
                >
                  <Add />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('el:button-add-new-x', { x: t('label:person') })}
                </HighContrastFlatknapp>
              </MarginDiv>
            )}
            <VerticalSeparatorDiv/>
          </LeftDiv>
          <RightDiv>
            {(gettingPerson || !_editCurrentPersonID)
              ? (
                <RightFlexCenterDiv>
                  {gettingPerson ? t('message:loading-getting-person') : undefined}
                  {!_editCurrentPersonID ? t('label:velg-personer') : undefined}
                </RightFlexCenterDiv>
                )
              : (
                <>
                  {(_menuOption === 'personopplysninger' || _menuOption === 'person') && (
                    <PersonOpplysninger
                      highContrast={highContrast}
                      landkoderList={landkoderList}
                      parentNamespace={namespace}
                      onSearchingPerson={(id: string) => dispatch(searchPerson(id))}
                      personID={_editCurrentPersonID}
                      resetValidation={resetValidation}
                      replySed={replySed}
                      searchingPerson={searchingPerson}
                      searchedPerson={searchedPerson}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'nasjonaliteter' && (
                    <Nasjonaliteter
                      highContrast={highContrast}
                      landkoderList={landkoderList}
                      parentNamespace={namespace}
                      personID={_editCurrentPersonID}
                      personName={_editCurrentPersonName!}
                      resetValidation={resetValidation}
                      replySed={replySed}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'adresser' && (
                    <Adresser
                      highContrast={highContrast}
                      landkoderList={landkoderList}
                      parentNamespace={namespace}
                      personID={_editCurrentPersonID}
                      personName={_editCurrentPersonName!}
                      replySed={replySed}
                      resetValidation={resetValidation}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'kontaktinformasjon' && (
                    <Kontaktinformasjon
                      highContrast={highContrast}
                      parentNamespace={namespace}
                      personID={_editCurrentPersonID}
                      personName={_editCurrentPersonName!}
                      replySed={replySed}
                      resetValidation={resetValidation}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'trygdeordninger' && (
                    <Trygdeordning
                      highContrast={highContrast}
                      parentNamespace={namespace}
                      personID={_editCurrentPersonID}
                      personName={_editCurrentPersonName!}
                      replySed={replySed}
                      resetValidation={resetValidation}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'familierelasjon' && (
                    <Familierelasjon
                      familierelasjonKodeverk={familierelasjonKodeverk}
                      parentNamespace={namespace}
                      highContrast={highContrast}
                      personID={_editCurrentPersonID}
                      personName={_editCurrentPersonName!}
                      replySed={replySed}
                      resetValidation={resetValidation}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'relasjon' && (
                    <Relasjon
                      familierelasjonKodeverk={familierelasjonKodeverk}
                      highContrast={highContrast}
                      parentNamespace={namespace}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      resetValidation={resetValidation}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'personensstatus' && (
                    <PersonensStatus
                      arbeidsperioder={arbeidsperioder}
                      gettingArbeidsperioder={gettingArbeidsperioder}
                      getArbeidsperioder={_getArbeidsperioder}
                      highContrast={highContrast}
                      parentNamespace={namespace}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      resetValidation={resetValidation}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'grunnlagforbosetting' && (
                    <GrunnlagForBosetting
                      parentNamespace={namespace}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      resetValidation={resetValidation}
                      standalone
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'beløpnavnogvaluta' && (
                    <BeløpNavnOgValuta
                      parentNamespace={namespace}
                      highContrast={highContrast}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      resetValidation={resetValidation}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'familieytelser' && (
                    <Familieytelser
                      highContrast={highContrast}
                      parentNamespace={namespace}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      resetValidation={resetValidation}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'referanseperiode' && (
                    <Referanseperiode
                      parentNamespace={namespace}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      resetValidation={resetValidation}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'arbeidsforhold/arbeidsgivere' && (
                    <Arbeidsforhold
                      arbeidsperioder={arbeidsperioder}
                      gettingArbeidsperioder={gettingArbeidsperioder}
                      getArbeidsperioder={_getArbeidsperioder}
                      inntekter={inntekter}
                      gettingInntekter={gettingInntekter}
                      getInntekter={_getInntekter}
                      highContrast={highContrast}
                      parentNamespace={namespace}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      resetValidation={resetValidation}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'forsikring' && (
                    <Forsikring
                      arbeidsperioder={arbeidsperioder}
                      gettingArbeidsperioder={gettingArbeidsperioder}
                      getArbeidsperioder={_getArbeidsperioder}
                      inntekter={inntekter}
                      gettingInntekter={gettingInntekter}
                      getInntekter={_getInntekter}
                      highContrast={highContrast}
                      parentNamespace={namespace}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      resetValidation={resetValidation}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                </>
                )}
          </RightDiv>
        </FlexCenterDiv>
      </CustomHighContrastPanel>
    </PileDiv>
  )
}

export default PersonManager
