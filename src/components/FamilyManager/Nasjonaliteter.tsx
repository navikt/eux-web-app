import Tilsette from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { Kodeverk, Person } from 'declarations/types'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { UndertekstBold } from 'nav-frontend-typografi'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastInput,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

interface NasjonalitetProps {
  highContrast: boolean
  personID: string
  replySed: ReplySed
}
const NasjonalitetDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`
const AlignEndRow = styled(Row)`
  align-items: flex-end;
`

interface PersonOpplysningerSelector {
  landkoderList: any
}

const mapState = (state: State): PersonOpplysningerSelector => ({
  landkoderList: state.app.landkoder
})

interface Nationality {
  nasjonalitet: string
  fomdato: string
}

const Nasjonaliteter: React.FC<NasjonalitetProps> = ({
  // person
}:NasjonalitetProps): JSX.Element => {
  const [_nationalities, setNationalities] = useState<Array<Nationality>>([])
  const [_currentNationality, setCurrentNationality] = useState<string | undefined>(undefined)
  const [_currentFomdato, setCurrentFomdato] = useState<string>('')
  const [_seeNewNationalityForm, setSeeNewNationalityForm] = useState<boolean>(false)
  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { landkoderList }: PersonOpplysningerSelector = useSelector<State, PersonOpplysningerSelector>(mapState)
  const { t } = useTranslation()

  const onNationalityRemove = (i: number) => {
    const newNationalities = _.cloneDeep(_nationalities)
    newNationalities.splice(i, 1)
    setIsDirty(true)
    setNationalities(newNationalities)
  }

  const onNationalityAdd = (_n: Nationality) => {
    const newNationalities = _nationalities.concat(_n)
    setIsDirty(true)
    setNationalities(newNationalities)
    setCurrentNationality(undefined)
    setCurrentFomdato('')
  }

  const onFomdatoChanged = (e: string, i: number) => {
    setIsDirty(true)
    if (i < 0) {
      setCurrentFomdato(e)
    } else {
      const newNationalities = _.cloneDeep(_nationalities)
      newNationalities[i].fomdato = e
      setNationalities(newNationalities)
    }
  }

  const onNationalitySelected = (e: string, i: number) => {
    setIsDirty(true)
    if (i < 0) {
      setCurrentNationality(e)
    } else {
      const newNationalities = _.cloneDeep(_nationalities)
      _nationalities[i].nasjonalitet = e
      setNationalities(newNationalities)
    }
  }

  const renderRow = (n: Nationality, i: number) => (
    <>
      <AlignEndRow>
        <Column>
          <CountrySelect
            data-test-id={'c-familymanager-nasjonaliteter-' + i + '-land-countryselect'}
            id={'c-familymanager-personopplysninger-' + i + '-land'}
            label={t('ui:label-landkode')}
            menuPortalTarget={document.body}
            includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
            onOptionSelected={(e: any) => onNationalitySelected(e.value, i)}
            placeholder={t('ui:label-choose')}
            values={n.nasjonalitet}
          />
        </Column>
        <HorizontalSeparatorDiv />
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-nasjonaliteter-' + i + '-fomdato-input'}
            id={'c-familymanager-personopplysninger-' + i + '-fomdato'}
            onChange={(e: any) => onFomdatoChanged(e.target.value, i)}
            value={n.fomdato}
            label={t('ui:label-firstname')}
          />
        </Column>
        <HorizontalSeparatorDiv />
        <Column>
          {i < 0 ? (
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={() => onNationalityAdd(n)}
            >
              <Tilsette />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('ui:label-add')}
            </HighContrastFlatknapp>
          ) : (
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={() => onNationalityRemove(i)}
            >
              <Trashcan />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('ui:label-remove')}
            </HighContrastFlatknapp>
          )}
        </Column>
      </AlignEndRow>
      <HorizontalSeparatorDiv />
    </>
  )

  return (
    <NasjonalitetDiv>
      <Row>
        <Column>
          <UndertekstBold>
            {t('ui:label-nationality')}
          </UndertekstBold>
        </Column>
        <Column>
          <UndertekstBold>
            {t('ui:label-fomdato')}
          </UndertekstBold>
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      {_nationalities.map((n, i) => (renderRow(n, i)))}
      {_seeNewNationalityForm ? (
        renderRow({
          nasjonalitet: _currentNationality,
          fomdato: _currentFomdato
        } as Nationality, -1)
      ) : (
        <Row>
          <Column>
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={() => setSeeNewNationalityForm(true)}
            >
              <Tilsette />
              <HorizontalSeparatorDiv data-size='0.5' />
              {t('ui:label-add-nationality')}
            </HighContrastFlatknapp>

          </Column>
        </Row>
      )}
      {_isDirty && '*'}
    </NasjonalitetDiv>
  )
}

export default Nasjonaliteter
