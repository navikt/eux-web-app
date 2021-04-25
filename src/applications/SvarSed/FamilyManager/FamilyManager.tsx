import { getArbeidsforholdList, searchPerson } from 'actions/svarpased'
import AddPersonModal from 'applications/SvarSed/FamilyManager/AddPersonModal/AddPersonModal'
import Add from 'assets/icons/Add'
import FilledCheckCircle from 'assets/icons/CheckCircle'
import Barn from 'assets/icons/Child'
import FilledRemoveCircle from 'assets/icons/RemoveCircle'
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
import Adresser from './Adresser/Adresser'
import BeløpNavnOgValuta from './BeløpNavnOgValuta/BeløpNavnOgValuta'
import Familierelasjon from './Familierelasjon/Familierelasjon'
import Familieytelser from './Familieytelser/Familieytelser'
import GrunnlagForBosetting from './GrunnlagForBosetting/GrunnlagForBosetting'
import Kontaktinformasjon from './Kontaktinformasjon/Kontaktinformasjon'
import Nasjonaliteter from './Nasjonaliteter/Nasjonaliteter'
import PersonensStatus from './PersonensStatus/PersonensStatus'
import PersonOpplysninger from './PersonOpplysninger/PersonOpplysninger'
import Relasjon from './Relasjon/Relasjon'
import Trygdeordning from './Trygdeordning/Trygdeordning'

const LeftDiv = styled.div`
  flex: 1;
  align-self: flex-start;
  border-right: 1px solid ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_COLOR]};
`
const OptionDiv = styled.div`
  transition: all 0.3s ease-in-out;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${(props: any) => props['data-highContrast']
      ? themeHighContrast[themeKeys.ALTERNATIVE_HOVER_COLOR]
      : theme[themeKeys.ALTERNATIVE_HOVER_COLOR]};
  }
  &.selected {
    background-color: ${(props: any) => props['data-highContrast']
      ? themeHighContrast[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]
      : theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
     border-left: 5px solid ${(props: any) => props['data-highContrast']
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
const PersonsDiv = styled.div`
  display: flex;
  flex-direction: column;
`
const PersonDiv = styled.div`
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1rem 0.5rem;
  flex: 1;
  transition: all 0.3s ease-in-out;
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

export interface FamilyManagerProps {
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const mapState = (state: State): any => ({
  arbeidsforholdList: state.svarpased.arbeidsforholdList,
  familierelasjonKodeverk: state.app.familierelasjoner,
  highContrast: state.ui.highContrast,
  gettingArbeidsforholdList: state.loading.gettingArbeidsforholdList,
  gettingPerson: state.loading.gettingPerson,
  landkoderList: state.app.landkoder,
  searchingPerson: state.loading.searchingPerson,
  searchedPerson: state.svarpased.searchedPerson,
  valgteArbeidsforhold: state.svarpased.valgteArbeidsforhold
})

const FamilyManager: React.FC<FamilyManagerProps> = ({
  replySed,
  resetValidation,
  updateReplySed,
  validation
}: FamilyManagerProps) => {
  const {
    arbeidsforholdList,
    familierelasjonKodeverk,
    gettingArbeidsforholdList,
    gettingPerson,
    highContrast,
    landkoderList,
    searchingPerson,
    searchedPerson
  }: any = useSelector<State, any>(mapState)
  // list of persons with open forms
  const [_editPersonIDs, setEditPersonIDs] = useState<Array<string>>([])
  // person with current form visible
  const [_editCurrentPersonID, setEditCurrentPersonID] = useState<string | undefined>(undefined)
  const [_editCurrentPersonName, setEditCurrentPersonName] = useState<string | undefined>(undefined)
  const [_modal, setModal] = useState<boolean>(false)
  // list of selected persons
  const [_selectedPersonIDs, setSelectedPersonIDs] = useState<Array<string>>([])
  // the name of person form currently selected
  const [_menuOption, setMenuOption] = useState<string | undefined>(undefined)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const brukerNr = 0
  const ektefelleNr = brukerNr + ((replySed as F002Sed).ektefelle ? 1 : 0)
  const annenPersonNr = ektefelleNr + ((replySed as F002Sed).annenPerson ? 1 : 0)
  const barnNr = annenPersonNr + ((replySed as F002Sed).barn ? 1 : 0)
  const familieNr = barnNr + 1
  const totalPeople = annenPersonNr + ((replySed as F002Sed).barn ? (replySed as F002Sed).barn.length : 0) + 1 // 1 = bruker
  const namespace = 'familymanager'

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
    { label: t('el:option-familymanager-1'), value: 'personopplysninger', normal: true, barn: true, family: false },
    { label: t('el:option-familymanager-2'), value: 'nasjonaliteter', normal: true, barn: true, family: false },
    { label: t('el:option-familymanager-3'), value: 'adresser', normal: true, barn: true, family: false },
    { label: t('el:option-familymanager-4'), value: 'kontaktinformasjon', normal: true, barn: false, family: false },
    { label: t('el:option-familymanager-5'), value: 'trygdeordninger', normal: true, barn: false, family: false },
    { label: t('el:option-familymanager-6'), value: 'familierelasjon', normal: true, barn: false, family: false },
    { label: t('el:option-familymanager-7'), value: 'personensstatus', normal: true, barn: false, family: false },
    { label: t('el:option-familymanager-8'), value: 'relasjon', normal: false, barn: true, family: false },
    { label: t('el:option-familymanager-9'), value: 'grunnlagforbosetting', normal: false, barn: true, family: false },
    { label: t('el:option-familymanager-10'), value: 'beløpnavnogvaluta', normal: false, barn: true, family: false },
    { label: t('el:option-familymanager-11'), value: 'familieytelser', normal: false, barn: false, family: true }
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

  const onSelectAllPersons = (checked: boolean) => {
    if (checked) {
      let allPersons = []
      allPersons.push('bruker')
      if ((replySed as F002Sed).ektefelle) {
        allPersons.push('ektefelle')
      }
      if ((replySed as F002Sed).annenPerson) {
        allPersons.push('annenPerson')
      }
      if ((replySed as F002Sed).barn) {
        allPersons = allPersons.concat((replySed as F002Sed).barn.map((b: any, i: number) => `barn[${i}]`))
      }
      setSelectedPersonIDs(allPersons)
    } else {
      setSelectedPersonIDs([])
    }
  }

  const onAddNewPerson = () => {
    setModal(true)
  }

  const renderPerson = (replySed: ReplySed, personId: string, totalIndex: number) => {
    const personInfo: PersonInfo | undefined = _.get(replySed, `${personId}.personInfo`) // undefined for family
    const editing: boolean = _.find(_editPersonIDs, _id => _id === personId) !== undefined
    const selected: boolean = personId === 'familie'
      ? _selectedPersonIDs.length === totalPeople
      : _.find(_selectedPersonIDs, _id => _id === personId) !== undefined
    return (
      <PersonsDiv>
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
            {validation[namespace + '-' + personId] && (
              <>
                <FilledRemoveCircle color='red' />
                <HorizontalSeparatorDiv data-size='0.5' />
              </>
            )}
            {selected
              ? (
                <>
                  <Undertittel style={{ whiteSpace: 'nowrap' }}>
                    {personId === 'familie'
                      ? t('label:hele-familien')
                      : personInfo?.fornavn + ' ' + personInfo?.etternavn}
                  </Undertittel>
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
          <CheckboxDiv>
            <PersonCheckbox
              label=''
              checked={selected}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (personId === 'familie') {
                  onSelectAllPersons(e.target.checked)
                } else {
                  onSelectPerson(personId, e.target.checked)
                }
                e.stopPropagation()
              }}
            />
          </CheckboxDiv>
        </PersonAndCheckboxDiv>
        {editing && options
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
                {Object.prototype.hasOwnProperty.call(validation, namespace + '-' + personId + '-' + o.value) &&
              (validation[namespace + '-' + personId + '-' + o.value] === undefined
                ? <FilledCheckCircle color='green' />
                : <FilledRemoveCircle color='red' />
              )}
                <HorizontalSeparatorDiv data-size='0.5' />
                {o.label}
              </OptionDiv>
            )
          })}
      </PersonsDiv>
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
        var element = document.getElementById(feil.skjemaelementId)
        element?.scrollIntoView({
          behavior: 'smooth'
        })
        element?.focus()
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
      {_modal && (
        <AddPersonModal
          highContrast={highContrast}
          replySed={replySed}
          onModalClose={() => setModal(false)}
        />
      )}
      <Undertittel>
        {t('el:title-familymanager')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <CustomHighContrastPanel className={classNames({feil: validation[namespace]?.feilmelding})}>
        <FlexCenterDiv>
          <LeftDiv>
            {replySed.bruker && renderPerson(replySed, 'bruker', brukerNr)}
            {(replySed as F002Sed).ektefelle && renderPerson(replySed, 'ektefelle', ektefelleNr)}
            {(replySed as F002Sed).annenPerson && renderPerson(replySed, 'annenPerson', annenPersonNr)}
            {(replySed as F002Sed).barn && (replySed as F002Sed).barn.map((b: any, i: number) => renderPerson(replySed, `barn[${i}]`, barnNr + i))}
            {renderPerson(replySed, 'familie', familieNr)}
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
                  {_menuOption === 'personopplysninger' && (
                    <PersonOpplysninger
                      highContrast={highContrast}
                      landkoderList={landkoderList}
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
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      resetValidation={resetValidation}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'personensstatus' && (
                    <PersonensStatus
                      arbeidsforholdList={arbeidsforholdList}
                      gettingArbeidsforholdList={gettingArbeidsforholdList}
                      getArbeidsforholdList={(fnr: string | undefined) => {
                        if (fnr) dispatch(getArbeidsforholdList(fnr))
                      }}
                      highContrast={highContrast}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      resetValidation={resetValidation}
                      updateReplySed={updateReplySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'grunnlagforbosetting' && (
                    <GrunnlagForBosetting
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

export default FamilyManager
