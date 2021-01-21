//import FilledCheckCircle from 'assets/icons/filled-version-check-circle-2'
//import FilledRemoveCircle from 'assets/icons/filled-version-remove-circle'
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
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Kontaktinformasjon from './Kontaktinformasjon'
import Nasjonalitet from './Nasjonalitet'
import PersonOpplysninger from './PersonOpplysninger'

const CheckboxDiv = styled.div`
  display: flex;
  justify-content: space-between;
  .skjemaelement {
     display: flex;
  }
`
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
    background-color: ${(props: any) => props['data-highContrast'] ?
      themeHighContrast[themeKeys.MAIN_HOVER_COLOR] :
      theme[themeKeys.MAIN_HOVER_COLOR] };
  }
  &.selected {
    background-color: ${(props: any) => props['data-highContrast'] ?
      themeHighContrast[themeKeys.ALTERNATIVE_BACKGROUND_COLOR] :
      theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR] };
     border-left: 5px solid ${(props: any) => props['data-highContrast'] ?
      themeHighContrast[themeKeys.MAIN_INTERACTIVE_COLOR] :
      theme[themeKeys.MAIN_INTERACTIVE_COLOR] };
  }
`
const PanelDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
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
   background-color: ${(props: any) => props['data-highContrast'] ?
     themeHighContrast[themeKeys.MAIN_HOVER_COLOR] :
     theme[themeKeys.MAIN_HOVER_COLOR] };
  }
`
const RightFlexStartDiv = styled.div`
  flex: 2;
  padding: 0.5rem;
  align-self: flex-start;
`
const RightFlexCenterDiv = styled.div`
  flex: 2;
  padding: 0.5rem;
  align-self: flex-center;
  text-align: center;
`
const CustomHighContrastPanel = styled(HighContrastPanel)`
  padding: 0rem;
`

const mapState = (state: State): any => ({
  familierelasjonKodeverk: state.app.familierelasjoner,
  gettingPerson: state.loading.gettingPerson,
  person: state.svarpased.person,
  highContrast: state.ui.highContrast
})

const FamilyManager: React.FC = () => {
  const {
    familierelasjonKodeverk,
    gettingPerson,
    highContrast,
    person
  }: any = useSelector<State, any>(mapState)
  const [_editPersons, setEditPersons] = useState<Array<Person>>([])
  const [_editCurrentPerson, setEditCurrentPerson] = useState<Person | undefined>(undefined)
  const [_modal, setModal] = useState<boolean>(false)
  const [_selectedPersons, setSelectedPersons] = useState<Array<Person>>([])
  const [_personOption, setPersonOption] = useState<string | undefined>(undefined)
  const { t } = useTranslation()

  const changePersonOption = (p: Person, o: string) => {
    setEditCurrentPerson(p)
    setPersonOption(o)
  }

  const options = [
    { label: t('ui:option-familymanager-1'), value: 'personopplysninger' },
    { label: t('ui:option-familymanager-2'), value: 'nasjonalitet' },
    { label: t('ui:option-familymanager-3'), value: 'adresser' },
    { label: t('ui:option-familymanager-4'), value: 'kontaktinformasjon' },
    { label: t('ui:option-familymanager-5'), value: 'trygdeordninger' },
    { label: t('ui:option-familymanager-6'), value: 'familierelasjon' },
    { label: t('ui:option-familymanager-7'), value: 'personensstatus' }
  ]

  let personPlusRelations: Array<Person | FamilieRelasjon> = []
  if (person?.relasjoner) {
    personPlusRelations = personPlusRelations.concat(person?.relasjoner)
  }
  if (person) {
    personPlusRelations = personPlusRelations.concat(person).reverse()
  }

  // TODO
  const onPersonsChanged = (p: Array<Person | FamilieRelasjon>) => {}

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

  const onAddNewPerson = () => {
    setModal(true)
  }

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
            {personPlusRelations.map((person, i) => (
              <PersonsDiv>
                <CheckboxDiv
                  data-highContrast={highContrast}
                >
                  <PersonDiv
                    onClick={() => {
                      onEditPerson(person)
                      return false
                    }}
                    style={{animationDelay:  i * 0.1 + 's' }}
                    className={classNames('personDiv',{
                      slideAnimate: true,
                      selected: _editCurrentPerson && _editCurrentPerson.fnr === person.fnr })}
                  >
                    <Chevron type={_.find(_editPersons, p => p.fnr === person.fnr) !== undefined ? 'ned' : 'høyre'} />
                    <HorizontalSeparatorDiv data-size='0.5'/>
                    {_.find(_selectedPersons, p => p.fnr === person.fnr) !== undefined
                      ? (
                        <Undertittel>
                          {person?.fornavn + ' ' + person?.etternavn + ' (' + person?.kjoenn + ')'}
                        </Undertittel>
                        ) : (
                          <Normaltekst>
                            {person?.fornavn + ' ' + person?.etternavn + ' (' + person?.kjoenn + ')'}
                          </Normaltekst>
                        )}
                  </PersonDiv>
                  <PersonCheckbox
                    label=''
                    checked={_.find(_selectedPersons, p => p.fnr === person.fnr) !== undefined}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      onSelectPerson(person, e.target.checked)
                      e.stopPropagation()
                    }}
                  />
                </CheckboxDiv>
                {_.find(_editPersons, p => p.fnr === person.fnr) !== undefined && options.map((o, i) => {
                  return (
                    <OptionDiv
                      data-highContrast={highContrast}
                      key={o.value}
                      style={{animationDelay:  i * 0.1 + 's' }}
                      className={classNames({
                        slideAnimate: true,
                        selected: _editCurrentPerson && _editCurrentPerson.fnr === person.fnr && _personOption === o.value
                      })}
                      onClick={() => changePersonOption(person, o.value)}
                    >
                      {/*<FilledCheckCircle color='green' />*/}
                      {/*<FilledRemoveCircle color='red' />*/}
                      <HorizontalSeparatorDiv data-size='0.5' />
                      {o.label}
                    </OptionDiv>
                  )
                })}
              </PersonsDiv>
            ))}

              <CheckboxDiv>
                <div style={{padding: '1rem 0.5rem'}}>
                  <Normaltekst>
                  {t('ui:label-whole-family')}
                </Normaltekst>
                </div>
                <PersonCheckbox
                  label=''
                  checked={_selectedPersons.length === personPlusRelations.length}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSelectAllPersons(e.target.checked)}
                />
              </CheckboxDiv>
              <CheckboxDiv>
                <HighContrastFlatknapp
                  mini
                  kompakt
                  onClick={onAddNewPerson}
                >
                  <Tilsette />
                  <HorizontalSeparatorDiv data-size='0.5' />
                  {t('ui:label-add-person')}
                </HighContrastFlatknapp>
              </CheckboxDiv>
          </LeftDiv>
          <FadingLineSeparator className='fadeIn' />
          {(gettingPerson || !_editCurrentPerson) ? (
            <RightFlexCenterDiv>
              {gettingPerson ? t('ui:loading-getting-person') : undefined}
              {!_editCurrentPerson ? t('ui:label-no-person-selected') : undefined}
            </RightFlexCenterDiv>
          ) : (
            <RightFlexStartDiv>
              {_personOption === 'personopplysninger' && <PersonOpplysninger highContrast={highContrast} person={_editCurrentPerson} />}
              {_personOption === 'nasjonalitet' && <Nasjonalitet highContrast={highContrast} person={_editCurrentPerson} />}
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
