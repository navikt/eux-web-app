import Tilsette from 'assets/icons/Tilsette'
import classNames from 'classnames'
import { FadingLineSeparator } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Person } from 'declarations/types'
import { Checkbox } from 'nav-frontend-skjema'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import { HighContrastFlatknapp, HighContrastPanel, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import FilledRemoveCircle from 'assets/icons/filled-version-remove-circle'
import FilledCheckCircle from 'assets/icons/filled-version-check-circle-2'
import PersonOpplysninger from './PersonOpplysninger'

interface FamilyManagerProps {
  person: Person | undefined
}

const LeftDiv = styled.div`
  flex: 1;
`

const RightDiv = styled.div`
  flex: 2;
  padding: 0.5rem;
`
const PanelDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const CheckboxDiv = styled.div`
  display: flex;
  justify-content: space-between;
  .skjemaelement {
     display: flex;
  }
  padding: 1rem 0.5rem;
`
const OptionDiv = styled.div`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  &.selected {
     background-color: lightgrey;
     border-left: 5px solid blue;
  }
`
const FlexDiv = styled.div`
  display: flex;
`
const CustomHighContrastPanel = styled(HighContrastPanel)`
  padding: 0rem;
`

const mapState = (state: State): any => ({
  familierelasjonKodeverk: state.app.familierelasjoner,
  personRelatert: state.svarpased.personRelatert,
  valgteFamilieRelasjoner: state.svarpased.familierelasjoner,

  gettingPerson: state.loading.gettingPerson
})

const FamilyManager: React.FC<FamilyManagerProps> = ({
  person
}: FamilyManagerProps) => {
  const {
    //   familierelasjonKodeverk,
  //  personRelatert,
  //  valgteFamilieRelasjoner
    gettingPerson
  }: any = useSelector<State, any>(mapState)
  const [_person, setPerson] = useState<Person | undefined>(undefined)
  const [_showPersonOption, setShowPersonOption] = useState<boolean>(false)

  const [_personOption, setPersonOption] = useState<string | undefined>(undefined)
  const { t } = useTranslation()

  const changePersonOption = (o: string) => {
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
  const onAddNewPerson = () => {}

  const onSelectPerson = (p: Person) => {
    const alreadySelectedPerson = _person && p === _person
    setPerson(alreadySelectedPerson ? undefined : p)
    setShowPersonOption(!alreadySelectedPerson)
    setPersonOption(alreadySelectedPerson ? undefined : 'personopplysninger')
  }

  return (
    <PanelDiv>
      <Undertittel>
        {t('ui:label-familymanager-title')}
      </Undertittel>
      <VerticalSeparatorDiv />
      <CustomHighContrastPanel>
        <FlexDiv>
          <LeftDiv>
            {person && (
              <>
                <CheckboxDiv>
                  {_person && person === _person
                    ? (
                      <Undertittel>
                        {person?.fornavn + ' ' + person?.etternavn + ' (' + person?.kjoenn + ')'}
                      </Undertittel>
                      ) : (
                        <Normaltekst>
                          {person?.fornavn + ' ' + person?.etternavn + ' (' + person?.kjoenn + ')'}
                        </Normaltekst>
                      )}
                  <Checkbox
                    label=''
                    checked={_person && _person.fnr === person.fnr}
                    onChange={() => onSelectPerson(person)}
                  />
                </CheckboxDiv>
                {_showPersonOption && options.map(o => {
                  return (
                    <OptionDiv
                      key={o.value}
                      className={classNames({ selected: _personOption === o.value })}
                      onClick={() => changePersonOption(o.value)}
                    >
                      <FilledCheckCircle color='green' />
                      <FilledRemoveCircle color='red' />
                      <HorizontalSeparatorDiv data-size='0.5' />
                      {o.label}
                    </OptionDiv>
                  )
                })}
              </>
            )}
            <VerticalSeparatorDiv />
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
          <RightDiv>
            {gettingPerson ? t('ui:loading-getting-person') : undefined}
            {!_person
              ? t('ui:label-no-person-selected')
              : (
                <>
                  {_personOption === 'personopplysninger' && <PersonOpplysninger person={_person} />}
                </>
                )}
          </RightDiv>
        </FlexDiv>
      </CustomHighContrastPanel>
    </PanelDiv>
  )
}

export default FamilyManager
