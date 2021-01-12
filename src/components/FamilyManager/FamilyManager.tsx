import Tilsette from 'assets/icons/Tilsette'
import { FadingLineSeparator } from 'components/StyledComponents'
import { State } from 'declarations/reducers'
import { Person } from 'declarations/types'
import { Checkbox } from 'nav-frontend-skjema'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import { HighContrastFlatknapp, HighContrastPanel, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
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
  valgteFamilieRelasjoner: state.svarpased.familierelasjoner
})

const FamilyManager: React.FC<FamilyManagerProps> = ({
  person
}: FamilyManagerProps) => {

  const {
 //   familierelasjonKodeverk,
  //  personRelatert,
  //  valgteFamilieRelasjoner
  }: any = useSelector<State, any>(mapState)
  const { t } = useTranslation()

  const onAddNewPerson = () => {}

  return (
    <PanelDiv>
      <Undertittel>
        {t('ui:form-familymanager-title')}
      </Undertittel>
      <VerticalSeparatorDiv/>
      <HighContrastPanel>
        <FlexDiv>
          <LeftDiv>
            <CheckboxDiv>
              <Normaltekst>
                dfgdffdg  {person?.fornavn}
              </Normaltekst>
              <Checkbox label='' onChange={() => {}}
              />
            </CheckboxDiv>
            <VerticalSeparatorDiv/>
            {person?.relasjoner?.map(r => {
              return (
                <>
                <CheckboxDiv>
                  <Normaltekst>
                    dfgdffdg  {r.fornavn}
                  </Normaltekst>
                  <Checkbox label='' onChange={() => {}}
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
                {t('ui:form-add-person')}
              </HighContrastFlatknapp>
            </CheckboxDiv>
          </LeftDiv>
        <FadingLineSeparator className='fadeIn'/>
        <RightDiv>
          dgfhfgdgdfg
        </RightDiv>
        </FlexDiv>
      </HighContrastPanel>
    </PanelDiv>
  )
}

export default FamilyManager
