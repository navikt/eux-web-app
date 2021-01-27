import FilledCheckCircle from 'assets/icons/filled-version-check-circle-2'
import { setPersonPlusRelations } from 'actions/svarpased'
import FilledRemoveCircle from 'assets/icons/filled-version-remove-circle'
import Tilsette from 'assets/icons/Tilsette'
import classNames from 'classnames'
import Adresser from 'components/FamilyManager/Adresser'
import Familierelasjon from 'components/FamilyManager/Familierelasjon'
import FamilyManagerModal from 'components/FamilyManager/FamilyManagerModal'
import PersonensStatus from 'components/FamilyManager/PersonensStatus'
import Trygdeordning from 'components/FamilyManager/Trygdeordning'
import { FadingLineSeparator } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { FamilieRelasjon, Person } from 'declarations/types.d'
import _ from 'lodash'
import Chevron from 'nav-frontend-chevron'
import { Checkbox } from 'nav-frontend-skjema'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import { HighContrastFlatknapp, HighContrastPanel, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import { theme, themeHighContrast, themeKeys } from 'nav-styled-component-theme'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Kontaktinformasjon from './Kontaktinformasjon'
import Nasjonaliteter from './Nasjonaliteter'
import PersonOpplysninger from './PersonOpplysninger'
import Tooltip from 'rc-tooltip'


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
  landkoderList: state.app.landkoder,
  gettingPerson: state.loading.gettingPerson,
  personPlusRelations: state.svarpased.personPlusRelations,
  validation: state.svarpased.validation,
  highContrast: state.ui.highContrast
})

const FamilyManager: React.FC = () => {
  const {
    familierelasjonKodeverk,
    gettingPerson,
    highContrast,
    landkoderList,
    personPlusRelations,
    validation
  }: any = useSelector<State, any>(mapState)
  // list of persons with open forms
  const [_editPersons, setEditPersons] = useState<Array<Person>>([])
  // person with current form selected
  const [_editCurrentPerson, setEditCurrentPerson] = useState<Person | undefined>(undefined)
  const [_modal, setModal] = useState<boolean>(false)
  // list of selected persons
  const [_selectedPersons, setSelectedPersons] = useState<Array<Person>>([])
  // the name of person form currently selected
  const [_personOption, setPersonOption] = useState<string | undefined>(undefined)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const changePersonOption = (p: Person, o: string) => {
    setEditCurrentPerson(p)
    setPersonOption(o)
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

  // TODO
  const onPersonsChanged = (p: Array<Person | FamilieRelasjon>) => { p }

  const onEditPerson = (person: Person) => {
    const alreadyEditingPerson = _.find(_editPersons, p => p.fnr === person.fnr) !== undefined
    const isEditCurrentPerson = _editCurrentPerson && _editCurrentPerson.fnr === person.fnr
    setEditCurrentPerson(isEditCurrentPerson ? undefined : person)
    let newEditPersons
    if (alreadyEditingPerson) {
      newEditPersons = _.filter(_editPersons, p => p.fnr !== person.fnr)
    } else {
      newEditPersons = _editPersons.concat(person)
    }
    setEditPersons(newEditPersons)
    setPersonOption(isEditCurrentPerson ? undefined : 'personopplysninger')
  }

  const onSelectPerson = (p: Person, checked: boolean) => {
    if (checked) {
      setSelectedPersons(_selectedPersons.concat(p))
    } else {
      setSelectedPersons(_.filter(_selectedPersons, _p => _p.fnr !== p.fnr))
    }
  }

  const onSelectAllPersons = (checked: boolean) => {
    if (checked) {
      setSelectedPersons(personPlusRelations)
    } else {
      setSelectedPersons([])
    }
  }

  const onValueChanged = (fnr: string, category: string, key: string, value: any) => {
    const newPersonsPlusRelations = personPlusRelations.map((p: Person) => {
      if (fnr !== p.fnr) {
        return p
      }
      const newP: Person = _.cloneDeep(p)
      // @ts-ignore
      newP[category][key] = value
      return newP
    })
    dispatch(setPersonPlusRelations(newPersonsPlusRelations))
  }

  const onAddNewPerson = () => {
    setModal(true)
  }

  // refresh _editCurrentPerson from personPlusRelations, as the forms update its data.
  useEffect(() => {
    if (_editCurrentPerson) {
      let person = _.find(personPlusRelations, p => p.fnr === _editCurrentPerson.fnr)
      if (person) {
        setEditCurrentPerson(person)
      }
    }
  }, [personPlusRelations])

  return (
    <PanelDiv>
      {_modal && (
        <FamilyManagerModal
          personPlusRelations={personPlusRelations}
          onPersonsChanged={onPersonsChanged}
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
            {personPlusRelations.map((person: Person, i: number) => (
              <PersonsDiv>
                <PersonAndCheckboxDiv
                  data-highContrast={highContrast}
                >
                  <Tooltip
                    overlay={(
                      <span>{t('ui:label-click-for-menu', {person: person?.fornavn + ' ' + person?.etternavn})}</span>
                    )}
                    mouseEnterDelay={0.4}
                    trigger={['hover']}
                  >
                  <PersonDiv
                    onClick={() => {
                      onEditPerson(person)
                      return false
                    }}
                    style={{ animationDelay: i * 0.1 + 's' }}
                    className={classNames('personDiv', {
                      slideAnimate: true,
                      selected: _editCurrentPerson && _editCurrentPerson.fnr === person.fnr
                    })}
                  >
                    <Chevron type={_.find(_editPersons, p => p.fnr === person.fnr) !== undefined ? 'ned' : 'høyre'} />
                    <HorizontalSeparatorDiv data-size='0.5' />
                    {validation['person-' + person.fnr] && (
                      <>
                        <FilledRemoveCircle color='red' />
                        <HorizontalSeparatorDiv data-size='0.5' />
                      </>
                    )}
                    {_.find(_selectedPersons, p => p.fnr === person.fnr) !== undefined
                      ? (
                        <Undertittel style={{whiteSpace: 'nowrap'}}>
                          {person?.fornavn + ' ' + person?.etternavn + ' (' + person?.kjoenn + ')'}
                        </Undertittel>
                        ) : (
                          <Normaltekst style={{whiteSpace: 'nowrap'}}>
                            {person?.fornavn + ' ' + person?.etternavn + ' (' + person?.kjoenn + ')'}
                          </Normaltekst>
                        )}
                  </PersonDiv>
                  </Tooltip>
                  <Tooltip
                      overlay={(
                      <span>{t('ui:label-click-for-select', {person: person?.fornavn + ' ' + person?.etternavn})}</span>
                      )}
                      mouseEnterDelay={0.4}
                      trigger={['hover']}
                      >
                        <CheckboxDiv>

                  <PersonCheckbox
                    label=''
                    checked={_.find(_selectedPersons, p => p.fnr === person.fnr) !== undefined}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      onSelectPerson(person, e.target.checked)
                      e.stopPropagation()
                    }}
                  />
                 </CheckboxDiv>
                 </Tooltip>
                </PersonAndCheckboxDiv>
                {_.find(_editPersons, p => p.fnr === person.fnr) !== undefined && options.map((o, i) => {
                  return (
                    <OptionDiv
                      data-highContrast={highContrast}
                      key={o.value}
                      style={{ animationDelay: i * 0.1 + 's' }}
                      className={classNames({
                        slideAnimate: true,
                        selected: _editCurrentPerson && _editCurrentPerson.fnr === person.fnr && _personOption === o.value
                      })}
                      onClick={() => changePersonOption(person, o.value)}
                    >
                      {validation.hasOwnProperty('person-' + person.fnr + '-' + o.value) &&
                      (validation['person-' + person.fnr + '-' + o.value] === undefined
                        ? <FilledCheckCircle color='green' />
                        : <FilledRemoveCircle color='red' />
                      )}
                      <HorizontalSeparatorDiv data-size='0.5' />
                      {o.label}
                    </OptionDiv>
                  )
                })}
              </PersonsDiv>
            ))}
            <PersonAndCheckboxDiv>
              <MarginDiv>
                <Normaltekst>
                  {t('ui:label-whole-family')}
                </Normaltekst>
              </MarginDiv>
              <PersonCheckbox
                label=''
                checked={_selectedPersons.length === personPlusRelations.length}
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
          {(gettingPerson || !_editCurrentPerson) ? (
            <RightFlexCenterDiv>
              {gettingPerson ? t('ui:loading-getting-person') : undefined}
              {!_editCurrentPerson ? t('ui:label-no-person-selected') : undefined}
            </RightFlexCenterDiv>
          ) : (
            <RightFlexStartDiv>
              {_personOption === 'personopplysninger' && (
                <PersonOpplysninger
                  highContrast={highContrast}
                  landkoderList={landkoderList}
                  onValueChanged={onValueChanged}
                  person={_editCurrentPerson}
                  validation={validation}
                />
              )}
              {_personOption === 'nasjonaliteter' && <Nasjonaliteter highContrast={highContrast} person={_editCurrentPerson} />}
              {_personOption === 'adresser' && <Adresser highContrast={highContrast} person={_editCurrentPerson} />}
              {_personOption === 'kontaktinformasjon' && <Kontaktinformasjon highContrast={highContrast} person={_editCurrentPerson} />}
              {_personOption === 'trygdeordninger' && <Trygdeordning highContrast={highContrast} person={_editCurrentPerson} />}
              {_personOption === 'familierelasjon' && <Familierelasjon familierelasjonKodeverk={familierelasjonKodeverk} highContrast={highContrast} person={_editCurrentPerson} />}
              {_personOption === 'personensstatus' && <PersonensStatus highContrast={highContrast} person={_editCurrentPerson} />}
            </RightFlexStartDiv>
          )}
        </FlexDiv>
      </CustomHighContrastPanel>
    </PanelDiv>
  )
}

export default FamilyManager
