import * as svarpasedActions from 'actions/svarpased'
import { setReplySed } from 'actions/svarpased'
import FilledCheckCircle from 'assets/icons/CheckCircle'
import FilledRemoveCircle from 'assets/icons/RemoveCircle'
import Barn from 'assets/icons/Child'
import Add from 'assets/icons/Add'
import classNames from 'classnames'
import Adresser from 'components/FamilyManager/Adresser'
import Familierelasjon from 'components/FamilyManager/Familierelasjon'
import FamilyManagerModal from 'components/FamilyManager/FamilyManagerModal'
import PersonensStatus from 'components/FamilyManager/PersonensStatus'
import Relasjon from 'components/FamilyManager/Relasjon'
import Trygdeordning from 'components/FamilyManager/Trygdeordning'
import { State } from 'declarations/reducers'
import { PersonInfo, ReplySed } from 'declarations/sed'
import _ from 'lodash'
import Chevron from 'nav-frontend-chevron'
import { Checkbox } from 'nav-frontend-skjema'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import {
  HighContrastFlatknapp,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  theme,
  themeHighContrast,
  themeKeys,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import BeløpNavnOgValuta from './BeløpNavnOgValuta'
import Familieytelser from './Familieytelser'
import GrunnlagForBosetting from './GrunnlagForBosetting'
import Kontaktinformasjon from './Kontaktinformasjon'
import Nasjonaliteter from './Nasjonaliteter'
import PersonOpplysninger from './PersonOpplysninger'

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`
const LeftDiv = styled.div`
  flex: 1;
  align-self: flex-start;
  border-right: 1px solid ${({ theme }: any) => theme[themeKeys.MAIN_BORDER_COLOR]};
`
const OptionDiv = styled.div`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${(props: any) => props['data-highContrast']
      ? themeHighContrast[themeKeys.MAIN_HOVER_COLOR]
      : theme[themeKeys.MAIN_HOVER_COLOR]};
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
const PanelDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
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
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1rem 0.5rem;
  flex: 1;
  &:hover {
   background-color: ${(props: any) => props['data-highContrast']
     ? themeHighContrast[themeKeys.MAIN_HOVER_COLOR]
     : theme[themeKeys.MAIN_HOVER_COLOR]};
  }
`
const CheckboxDiv = styled.div`
  &:hover {
   background-color: ${(props: any) => props['data-highContrast']
  ? themeHighContrast[themeKeys.MAIN_HOVER_COLOR]
  : theme[themeKeys.MAIN_HOVER_COLOR]};
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
const CustomHighContrastPanel = styled(HighContrastPanel)`
  padding: 0rem;
`
const MarginDiv = styled.div`
  padding: 1rem 0.5rem;
`

const mapState = (state: State): any => ({
  arbeidsforholdList: state.svarpased.arbeidsforholdList,
  familierelasjonKodeverk: state.app.familierelasjoner,
  highContrast: state.ui.highContrast,
  gettingArbeidsforholdList: state.loading.gettingArbeidsforholdList,
  gettingPerson: state.loading.gettingPerson,
  landkoderList: state.app.landkoder,
  replySed: state.svarpased.replySed,
  searchingPerson: state.loading.searchingPerson,
  searchedPerson: state.svarpased.searchedPerson,
  valgteArbeidsforhold: state.svarpased.valgteArbeidsforhold,
  validation: state.svarpased.validation
})

const FamilyManager: React.FC = () => {
  const {
    arbeidsforholdList,
    familierelasjonKodeverk,
    gettingArbeidsforholdList,
    gettingPerson,
    highContrast,
    landkoderList,
    replySed,
    searchingPerson,
    searchedPerson,
    validation
  }: any = useSelector<State, any>(mapState)
  // list of persons with open forms
  const [_editPersonIDs, setEditPersonIDs] = useState<Array<string>>([])
  // person with current form visible
  const [_editCurrentPersonID, setEditCurrentPersonID] = useState<string | undefined>(undefined)
  const [_modal, setModal] = useState<boolean>(false)
  // list of selected persons
  const [_selectedPersonIDs, setSelectedPersonIDs] = useState<Array<string>>([])
  // the name of person form currently selected
  const [_menuOption, setMenuOption] = useState<string | undefined>(undefined)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const brukerNr = 0
  const ektefelleNr = brukerNr + (replySed.ektefelle ? 1 : 0)
  const annenPersonNr = ektefelleNr + (replySed.annenPerson ? 1 : 0)
  const barnNr = annenPersonNr + (replySed.barn ? 1 : 0)
  const familieNr = barnNr + 1
  const totalPeople = annenPersonNr + (replySed.barn ? replySed.barn.length : 0) + 1 // 1 = bruker

  const changePersonOption = (personID: string | undefined, menuOption: string) => {
    if (personID) {
      setEditCurrentPersonID(personID)
      setMenuOption(menuOption)
    }
  }

  const options = [
    { label: t('elements:option-familymanager-1'), value: 'personopplysninger', normal: true, barn: true, family: false },
    { label: t('elements:option-familymanager-2'), value: 'nasjonaliteter', normal: true, barn: true, family: false },
    { label: t('elements:option-familymanager-3'), value: 'adresser', normal: true, barn: true, family: false },
    { label: t('elements:option-familymanager-4'), value: 'kontaktinformasjon', normal: true, barn: false, family: false },
    { label: t('elements:option-familymanager-5'), value: 'trygdeordninger', normal: true, barn: false, family: false },
    { label: t('elements:option-familymanager-6'), value: 'familierelasjon', normal: true, barn: false, family: false },
    { label: t('elements:option-familymanager-7'), value: 'personensstatus', normal: true, barn: false, family: false },
    { label: t('elements:option-familymanager-8'), value: 'relasjoner', normal: false, barn: true, family: false },
    { label: t('elements:option-familymanager-9'), value: 'grunnlagForBosetting', normal: false, barn: true, family: false },
    { label: t('elements:option-familymanager-10'), value: 'beløpNavnOgValuta', normal: false, barn: true, family: false },
    { label: t('elements:option-familymanager-11'), value: 'familieytelser', normal: false, barn: false, family: true }
  ]

  const onEditPerson = (id: string | undefined) => {
    if (id) {
      const alreadyEditingPerson = _.find(_editPersonIDs, _id => _id === id) !== undefined
      const isEditCurrentPerson = _editCurrentPersonID === id
      setEditCurrentPersonID(isEditCurrentPerson ? undefined : id)
      const newEditPersons = alreadyEditingPerson ? _.filter(_editPersonIDs, _id => _id !== id) : _editPersonIDs.concat(id)
      setEditPersonIDs(newEditPersons)
      setMenuOption(isEditCurrentPerson ? undefined :
        id === 'familie' ? _.find(options, o => o.family)?.value : options[0].value
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
      if (replySed.ektefelle) {
        allPersons.push('ektefelle')
      }
      if (replySed.annenPerson) {
        allPersons.push('annenPerson')
      }
      if (replySed.barn) {
        allPersons = allPersons.concat(replySed.barn.map((b: any, i: number) => `barn[${i}]`))
      }
      setSelectedPersonIDs(allPersons)
    } else {
      setSelectedPersonIDs([])
    }
  }

  const onValueChanged = (needleString: string | Array<string>, value: any) => {
    const newReplySed = _.cloneDeep(replySed)
    _.set(newReplySed, needleString, value)
    dispatch(setReplySed(newReplySed))
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
            {validation['person-' + personId] && (
              <>
                <FilledRemoveCircle color='red' />
                <HorizontalSeparatorDiv data-size='0.5' />
              </>
            )}
            {selected
              ? (
                <Undertittel style={{ whiteSpace: 'nowrap' }}>
                  {personId === 'familie'
                    ? t('label:whole-family')
                    : personInfo?.fornavn + ' ' + personInfo?.etternavn + ' (' + personInfo?.statsborgerskap.map(s => s.land).join(', ') + ')'}
                </Undertittel>
                )
              : (
                <Normaltekst style={{ whiteSpace: 'nowrap' }}>
                  {personId === 'familie'
                    ? t('label:whole-family')
                    : personInfo?.fornavn + ' ' + personInfo?.etternavn + ' (' + personInfo?.statsborgerskap.map(s => s.land).join(', ') + ')'}
                </Normaltekst>
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
          .filter(o => personId.startsWith('barn') ? o.barn
            : personId === 'familie' ? o.family : o.normal)
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
                {Object.prototype.hasOwnProperty.call(validation, 'person-' + personId + '-' + o.value) &&
              (validation['person-' + personId + '-' + o.value] === undefined
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

  return (
    <PanelDiv>
      {_modal && (
        <FamilyManagerModal
          highContrast={highContrast}
          replySed={replySed}
          onModalClose={() => setModal(false)}
        />
      )}
      <Undertittel>
        {t('label:familymanager-title')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <CustomHighContrastPanel>
        <FlexDiv>
          <LeftDiv>
            {replySed.bruker && renderPerson(replySed, 'bruker', brukerNr)}
            {replySed.ektefelle && renderPerson(replySed, 'ektefelle', ektefelleNr)}
            {replySed.annenPerson && renderPerson(replySed, 'annenPerson', annenPersonNr)}
            {replySed.barn && replySed.barn.map((b: PersonInfo, i: number) => renderPerson(replySed, `barn[${i}]`, barnNr + i))}
            {renderPerson(replySed, 'familie', familieNr)}
            <MarginDiv>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={onAddNewPerson}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('label:add-person')}
              </HighContrastFlatknapp>
            </MarginDiv>
          </LeftDiv>
          <RightDiv>
            {(gettingPerson || !_editCurrentPersonID)
              ? (
                <RightFlexCenterDiv>
                  {gettingPerson ? t('message:loading-getting-person') : undefined}
                  {!_editCurrentPersonID ? t('label:no-person-selected') : undefined}
                </RightFlexCenterDiv>
                )
              : (
                <>
                  {_menuOption === 'personopplysninger' && (
                    <PersonOpplysninger
                      highContrast={highContrast}
                      landkoderList={landkoderList}
                      onValueChanged={onValueChanged}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      searchingPerson={searchingPerson}
                      searchedPerson={searchedPerson}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'nasjonaliteter' && (
                    <Nasjonaliteter
                      highContrast={highContrast}
                      landkoderList={landkoderList}
                      onValueChanged={onValueChanged}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'adresser' && (
                    <Adresser
                      highContrast={highContrast}
                      landkoderList={landkoderList}
                      onValueChanged={onValueChanged}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'kontaktinformasjon' && (
                    <Kontaktinformasjon
                      highContrast={highContrast}
                      onValueChanged={onValueChanged}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'trygdeordninger' && (
                    <Trygdeordning
                      highContrast={highContrast}
                      onValueChanged={onValueChanged}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'familierelasjon' && (
                    <Familierelasjon
                      familierelasjonKodeverk={familierelasjonKodeverk}
                      highContrast={highContrast}
                      onValueChanged={onValueChanged}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'relasjoner' && (
                    <Relasjon
                      familierelasjonKodeverk={familierelasjonKodeverk}
                      highContrast={highContrast}
                      onValueChanged={onValueChanged}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'personensstatus' && (
                    <PersonensStatus
                      highContrast={highContrast}
                      onValueChanged={onValueChanged}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      validation={validation}
                      gettingArbeidsforholdList={gettingArbeidsforholdList}
                      getArbeidsforholdList={(fnr: string | undefined) => {
                        if (fnr) dispatch(svarpasedActions.getArbeidsforholdList(fnr))
                      }}
                      arbeidsforholdList={arbeidsforholdList}
                    />
                  )}
                  {_menuOption === 'grunnlagForBosetting' && (
                    <GrunnlagForBosetting
                      highContrast={highContrast}
                      onValueChanged={onValueChanged}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'beløpNavnOgValuta' && (
                    <BeløpNavnOgValuta
                      highContrast={highContrast}
                      onValueChanged={onValueChanged}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      validation={validation}
                    />
                  )}
                  {_menuOption === 'familieytelser' && (
                    <Familieytelser
                      highContrast={highContrast}
                      onValueChanged={onValueChanged}
                      personID={_editCurrentPersonID}
                      replySed={replySed}
                      validation={validation}
                    />
                  )}
                </>
                )}
          </RightDiv>
        </FlexDiv>
      </CustomHighContrastPanel>
    </PanelDiv>
  )
}

export default FamilyManager
