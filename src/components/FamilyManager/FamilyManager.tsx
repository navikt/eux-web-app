import Tilsette from 'assets/icons/Tilsette'
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

interface FamilyManagerProps {
  person: Person | undefined
}

const LeftDiv = styled.div`
  flex: 1;
  padding: 0.5rem;
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
`
const FlexDiv = styled.div`
  display: flex;
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
  const [ _person, setPerson ] = useState<Person | undefined>(undefined)
  const { t } = useTranslation()

  const onAddNewPerson = () => {}

  const onSelectPerson = (p: Person) => {
    setPerson(p)
  }

  return (
    <PanelDiv>
      <Undertittel>
        {t('ui:label-familymanager-title')}
      </Undertittel>
      <VerticalSeparatorDiv/>
      <HighContrastPanel>
        <FlexDiv>
          <LeftDiv>
            { person && (
              <CheckboxDiv>
                <Normaltekst>
                   {person?.fornavn + ' ' + person?.etternavn + ' (' + person?.kjoenn + ')'}
                </Normaltekst>
                <Checkbox
                  label=''
                  checked={_person && _person.fnr === person.fnr}
                  onChange={() => onSelectPerson(person)}
                />
              </CheckboxDiv>
            )}
            <VerticalSeparatorDiv/>
            {person?.relasjoner?.map(r => {
              return (
                <>
                <CheckboxDiv>
                  <Normaltekst>
                    {r?.fornavn + ' ' + r?.etternavn + ' - ' + r.rolle + ' (' + r?.kjoenn + ')'}
                  </Normaltekst>
                  <Checkbox
                    label=''
                    checked={_person && _person.fnr === r.fnr}
                    onChange={() => onSelectPerson(r)}
                  />
                </CheckboxDiv>
                <VerticalSeparatorDiv/>
                </>
              )
            })}
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
        <FadingLineSeparator className='fadeIn'/>
        <RightDiv>
          { !_person ? t('ui:label-no-person-selected') : undefined}
          {gettingPerson ?  t('ui:loading-getting-person') : undefined}
        </RightDiv>
        </FlexDiv>
      </HighContrastPanel>
    </PanelDiv>
  )
}

export default FamilyManager
