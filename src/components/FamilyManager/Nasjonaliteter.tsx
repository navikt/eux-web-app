import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import { ReplySed, Statsborgerskap } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
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
import styled from 'styled-components'

interface NasjonalitetProps {
  highContrast: boolean
  landkoderList: Array<Kodeverk>
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}
const NasjonalitetDiv = styled.div`
  padding: 1rem;
  fieldset {
    width: 100%;
  }
`
const AlignStartRow = styled(Row)`
  align-items: flex-start;
`

const Nasjonaliteter: React.FC<NasjonalitetProps> = ({
  landkoderList,
  onValueChanged,
  personID,
  replySed,
  validation
}:NasjonalitetProps): JSX.Element => {
  const [_currentNationality, setCurrentNationality] = useState<string | undefined>(undefined)
  const [_currentFomdato, setCurrentFomdato] = useState<string>('')
  const [_seeNewNationalityForm, setSeeNewNationalityForm] = useState<boolean>(false)
  const [_isDirty, setIsDirty] = useState<boolean>(false)
  const { t } = useTranslation()
  const statsborgerskaps: Array<Statsborgerskap> = _.get(replySed, `${personID}.personInfo.statsborgerskap`)

  const onNationalityRemove = (i: number) => {
    const newStatsborgerskaps = _.cloneDeep(statsborgerskaps)
    newStatsborgerskaps.splice(i, 1)
    setIsDirty(true)
    onValueChanged(`${personID}.personInfo.statsborgerskap`, newStatsborgerskaps)
  }

  const onNationalityAdd = () => {
    const newStatsborgerskaps = _.cloneDeep(statsborgerskaps)
    newStatsborgerskaps.push({
      land: _currentNationality!,
      fomdato: _currentFomdato
    })
    setIsDirty(true)
    onValueChanged(`${personID}.personInfo.statsborgerskap`, newStatsborgerskaps)

    setCurrentNationality(undefined)
    setCurrentFomdato('')
  }

  const onFomdatoChanged = (e: string, i: number) => {
    if (i < 0) {
      setCurrentFomdato(e)
    } else {
      const newStatsborgerskaps = _.cloneDeep(statsborgerskaps)
      newStatsborgerskaps[i].fomdato = e
      setIsDirty(true)
      onValueChanged(`${personID}.personInfo.statsborgerskap`, newStatsborgerskaps)
    }
  }

  const onNationalitySelected = (e: string, i: number) => {
    if (i < 0) {
      setCurrentNationality(e)
    } else {
      const newStatsborgerskaps = _.cloneDeep(statsborgerskaps)
      statsborgerskaps[i].land = e
      setIsDirty(true)
      onValueChanged(`${personID}.personInfo.statsborgerskap`, newStatsborgerskaps)
    }
  }

  const renderRow = (s: Statsborgerskap | null, i: number) => (
    <>
      <AlignStartRow>
        <Column>
          <CountrySelect
            data-test-id={'c-familymanager-' + personID + '-nasjonaliteter-' + i + '-land-countryselect'}
            id={'c-familymanager-' + personID + '-nasjonaliteter-' + i + '-land-countryselect'}
            menuPortalTarget={document.body}
            includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
            onOptionSelected={(e: any) => onNationalitySelected(e.value, i)}
            placeholder={t('label:choose')}
            values={i < 0 ? _currentNationality : s!.land}
            error={validation['person-' + personID + '-nasjonaliteter-' + i + '-land']
              ? validation['person-' + personID + '-nasjonaliteter-' + i + '-land']!.feilmelding
              : undefined}
          />
        </Column>
        <HorizontalSeparatorDiv />
        <Column>
          <HighContrastInput
            data-test-id={'c-familymanager-' + personID + '-nasjonaliteter-' + i + '-fomdato-input'}
            feil={validation['person-' + personID + '-nasjonaliteter-' + i + '-fomdato']
              ? validation['person-' + personID + '-nasjonaliteter-' + i + '-fomdato']!.feilmelding
              : undefined}
            id={'c-familymanager-' + personID + '-nasjonaliteter-' + i + '-fomdato'}
            onChange={(e: any) => onFomdatoChanged(e.target.value, i)}
            value={i < 0 ? _currentFomdato : s!.fomdato}
            placeholder={t('elements:placeholder-date-default')}
          />
        </Column>
        <HorizontalSeparatorDiv />
        <Column>
          <HighContrastFlatknapp
            mini
            kompakt
            onClick={() => (i < 0 ? onNationalityAdd() : onNationalityRemove(i))}
          >
            {i < 0 ? <Add /> : <Trashcan />}
            <HorizontalSeparatorDiv data-size='0.5' />
            {i < 0 ? t('label:add') : t('label:remove')}
          </HighContrastFlatknapp>
        </Column>
      </AlignStartRow>
      <HorizontalSeparatorDiv />
    </>
  )

  return (
    <NasjonalitetDiv>
      <Row>
        <Column>
          <UndertekstBold>
            {t('label:nationality')}
          </UndertekstBold>
        </Column>
        <Column>
          <UndertekstBold>
            {t('label:fomdato')}
          </UndertekstBold>
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv />
      {statsborgerskaps.map(renderRow)}
      <hr />
      {_seeNewNationalityForm
        ? renderRow(null, -1)
        : (
          <Row>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={() => setSeeNewNationalityForm(true)}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('label:add-nationality')}
              </HighContrastFlatknapp>

            </Column>
          </Row>
          )}
      {_isDirty && '*'}
    </NasjonalitetDiv>
  )
}

export default Nasjonaliteter
