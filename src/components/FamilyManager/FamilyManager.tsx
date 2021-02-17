import { setReplySed } from 'actions/svarpased'
import FilledCheckCircle from 'assets/icons/filled-version-check-circle-2'
import FilledRemoveCircle from 'assets/icons/filled-version-remove-circle'
import Barn from 'assets/icons/icon-barn'
import Tilsette from 'assets/icons/Tilsette'
import classNames from 'classnames'
import Adresser from 'components/FamilyManager/Adresser'
import Familierelasjon from 'components/FamilyManager/Familierelasjon'
import FamilyManagerModal from 'components/FamilyManager/FamilyManagerModal'
import PersonensStatus from 'components/FamilyManager/PersonensStatus'
import Trygdeordning from 'components/FamilyManager/Trygdeordning'
import { FadingLineSeparator } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { PersonInfo, ReplySed } from 'declarations/sed'
import _ from 'lodash'
import Chevron from 'nav-frontend-chevron'
import { Checkbox } from 'nav-frontend-skjema'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import { HighContrastFlatknapp, HighContrastPanel, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import { theme, themeHighContrast, themeKeys } from 'nav-styled-component-theme'
import Tooltip from 'rc-tooltip'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
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

const RightFlexStartDiv = styled.div`
  flex: 3;
  padding: 0.5rem;
  align-self: flex-start;
`
const RightFlexCenterDiv = styled.div`
  flex: 3;
  padding: 0.5rem;
  align-self: flex-center;
  text-align: center;
`
const CustomHighContrastPanel = styled(HighContrastPanel)`
  padding: 0rem;
`
const MarginDiv = styled.div`
  padding: 1rem 0.5rem;
`

const mapState = (state: State): any => ({
  familierelasjonKodeverk: state.app.familierelasjoner,
  highContrast: state.ui.highContrast,
  gettingPerson: state.loading.gettingPerson,
  landkoderList: state.app.landkoder,
  replySed: state.svarpased.replySed,
  searchingPerson: state.loading.searchingPerson,
  searchedPerson: state.svarpased.searchedPerson,
  validation: state.svarpased.validation
})

const FamilyManager: React.FC = () => {
  const {
    familierelasjonKodeverk,
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
  const totalPeople = annenPersonNr + (replySed.barn ? replySed.barn.length : 0) + 1 // 1 = bruker

  const changePersonOption = (personID: string | undefined, menuOption: string) => {
    if (personID) {
      setEditCurrentPersonID(personID)
      setMenuOption(menuOption)
    }
  }

  const options = [
    { label: t('ui:option-familymanager-1'), value: 'personopplysninger' },
    { label: t('ui:option-familymanager-2'), value: 'nasjonaliteter' },
    { label: t('ui:option-familymanager-3'), value: 'adresser' },
    { label: t('ui:option-familymanager-4'), value: 'kontaktinformasjon' },
    { label: t('ui:option-familymanager-5'), value: 'trygdeordninger' },
    { label: t('ui:option-familymanager-6'), value: 'familierelasjon' },
    { label: t('ui:option-familymanager-7'), value: 'personensstatus' }
  ]

  const onEditPerson = (id: string | undefined) => {
    if (id) {
      const alreadyEditingPerson = _.find(_editPersonIDs, _id => _id === id) !== undefined
      const isEditCurrentPerson = _editCurrentPersonID === id
      setEditCurrentPersonID(isEditCurrentPerson ? undefined : id)
      const newEditPersons = alreadyEditingPerson ? _.filter(_editPersonIDs, _id => _id !== id) : _editPersonIDs.concat(id)
      setEditPersonIDs(newEditPersons)
      setMenuOption(isEditCurrentPerson ? undefined : options[0].value)
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
    const personInfo: PersonInfo = _.get(replySed, `${personId}.personInfo`)
    const editing: boolean = _.find(_editPersonIDs, _id => _id === personId) !== undefined
    const selected: boolean = _.find(_selectedPersonIDs, _id => _id === personId) !== undefined
    return (
      <PersonsDiv>
        <PersonAndCheckboxDiv
          data-highContrast={highContrast}
        >
          <Tooltip
            overlay={(
              <span>
                {t('ui:label-click-for-menu', { person: personInfo?.fornavn + ' ' + personInfo?.etternavn })}
              </span>
            )}
            mouseEnterDelay={0.4}
            trigger={['hover']}
          >
            <PersonDiv
              onClick={() => {
                onEditPerson(personId)
                return false
              }}
              style={{ animationDelay: totalIndex * 0.1 + 's' }}
              className={classNames('personDiv', {
                slideAnimate: true,
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
                    {personInfo?.fornavn + ' ' + personInfo?.etternavn + ' (' + personInfo?.statsborgerskap.map(s => s.land).join(', ') + ')'}
                  </Undertittel>
                  )
                : (
                  <Normaltekst style={{ whiteSpace: 'nowrap' }}>
                    {personInfo?.fornavn + ' ' + personInfo?.etternavn + ' (' + personInfo?.statsborgerskap.map(s => s.land).join(', ') + ')'}
                  </Normaltekst>
                  )}
              {personId.startsWith('barn[') && (
                <>
                  <HorizontalSeparatorDiv data-size='0.5' />
                  <Barn />
                </>
              )}
            </PersonDiv>
          </Tooltip>
          <Tooltip
            overlay={(
              <span>
                {t('ui:label-click-for-select', { person: personInfo?.fornavn + ' ' + personInfo?.etternavn })}
              </span>
            )}
            mouseEnterDelay={0.4}
            trigger={['hover']}
          >
            <CheckboxDiv>
              <PersonCheckbox
                label=''
                checked={selected}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onSelectPerson(personId, e.target.checked)
                  e.stopPropagation()
                }}
              />
            </CheckboxDiv>
          </Tooltip>
        </PersonAndCheckboxDiv>
        {editing && options.map((o, i) => {
          return (
            <OptionDiv
              data-highContrast={highContrast}
              key={o.value}
              style={{ animationDelay: i * 0.1 + 's' }}
              className={classNames({
                slideAnimate: true,
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
        {t('ui:label-familymanager-title')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <CustomHighContrastPanel>
        <FlexDiv>
          <LeftDiv>
            {replySed.bruker && renderPerson(replySed, 'bruker', brukerNr)}
            {replySed.ektefelle && renderPerson(replySed, 'ektefelle', ektefelleNr)}
            {replySed.annenPerson && renderPerson(replySed, 'annenPerson', annenPersonNr)}
            {replySed.barn && replySed.barn.map((b: PersonInfo, i: number) => renderPerson(replySed, `barn[${i}]`, barnNr + i))}
            <PersonAndCheckboxDiv>
              <MarginDiv>
                <Normaltekst>
                  {t('ui:label-whole-family')}
                </Normaltekst>
              </MarginDiv>
              <PersonCheckbox
                label=''
                checked={_selectedPersonIDs.length === totalPeople}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSelectAllPersons(e.target.checked)}
              />
            </PersonAndCheckboxDiv>
            <MarginDiv>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={onAddNewPerson}
              >
                <Tilsette />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('ui:label-add-person')}
              </HighContrastFlatknapp>
            </MarginDiv>
          </LeftDiv>
          <FadingLineSeparator className='fadeIn' />
          {(gettingPerson || !_editCurrentPersonID)
            ? (
              <RightFlexCenterDiv>
                {gettingPerson ? t('ui:loading-getting-person') : undefined}
                {!_editCurrentPersonID ? t('ui:label-no-person-selected') : undefined}
              </RightFlexCenterDiv>
              )
            : (
              <RightFlexStartDiv>
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
                    personID={_editCurrentPersonID}
                    replySed={replySed}
                  />
                )}
                {_menuOption === 'familierelasjon' && (
                  <Familierelasjon
                    familierelasjonKodeverk={familierelasjonKodeverk}
                    highContrast={highContrast}
                    personID={_editCurrentPersonID}
                    replySed={replySed}
                  />
                )}
                {_menuOption === 'personensstatus' && (
                  <PersonensStatus
                    highContrast={highContrast}
                    personID={_editCurrentPersonID}
                    replySed={replySed}
                  />
                )}
              </RightFlexStartDiv>
              )}
        </FlexDiv>
      </CustomHighContrastPanel>
    </PanelDiv>
  )
}

export default FamilyManager
