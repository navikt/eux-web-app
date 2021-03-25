import Add from 'assets/icons/Add'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import { AlignStartRow, FlexCenterDiv, PaddedDiv } from 'components/StyledComponents'
import { ReplySed, Statsborgerskap } from 'declarations/sed'
import { Kodeverk, Validation } from 'declarations/types'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
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
import { validateNasjonalitet } from 'validation/nasjonaliteter'

interface NasjonalitetProps {
  highContrast: boolean
  landkoderList: Array<Kodeverk>
  onValueChanged: (needle: string, value: any) => void
  personID: string
  replySed: ReplySed
  validation: Validation
}

const Nasjonaliteter: React.FC<NasjonalitetProps> = ({
  landkoderList,
  onValueChanged,
  personID,
  replySed,
  validation
}:NasjonalitetProps): JSX.Element => {
  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])

  const [_newLand, setNewLand] = useState<string | undefined>(undefined)
  const [_newFomdato, setNewFomdato] = useState<string>('')
  const [_seeNewForm, setSeeNewForm] = useState<boolean>(false)
  const [_validation, setValidation] = useState<Validation>({})

  const { t } = useTranslation()
  const statsborgerskaper: Array<Statsborgerskap> = _.get(replySed, `${personID}.personInfo.statsborgerskap`)
  const namespace = 'familymanager-' + personID + '-nasjonaliteter'

  const p = _.get(replySed, personID)
  const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn

  const resetValidation = (key: string): void => {
    setValidation({
      ..._validation,
      [key]: undefined
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (): boolean => {
    const newValidation: Validation = {}
    validateNasjonalitet(
      newValidation,
      {
        land: _newLand || '',
        fomdato: _newFomdato
      },
      statsborgerskaper,
      -1,
      t,
      namespace,
      personName
    )
    setValidation(newValidation)
    return hasNoValidationErrors(newValidation)
  }

  const onAddNewClicked = () => setSeeNewForm(true)

  const addCandidateForDeletion = (key: string) => {
    setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const onFomdatoChanged = (e: string, i: number) => {
    if (i < 0) {
      setNewFomdato(e)
      resetValidation(namespace + '-fomdato')
    } else {
      const newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
      newStatsborgerskaper[i].fomdato = e
      onValueChanged(`${personID}.personInfo.statsborgerskap`, newStatsborgerskaper)
    }
  }

  const onLandSelected = (e: string, i: number) => {
    if (i < 0) {
      setNewLand(e)
      resetValidation(namespace + '-land')
    } else {
      const newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
      statsborgerskaper[i].land = e
      onValueChanged(`${personID}.personInfo.statsborgerskap`, newStatsborgerskaper)
    }
  }

  const resetForm = () => {
    setNewLand(undefined)
    setNewFomdato('')
    setValidation({})
  }

  const onCancel = () => {
    setSeeNewForm(false)
    resetForm()
  }

  const getKey = (s: Statsborgerskap): string => {
    return s.land
  }

  const onRemove = (i: number) => {
    const newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
    const deletedStatsborgerskaper: Array<Statsborgerskap> = newStatsborgerskaper.splice(i, 1)
    if (deletedStatsborgerskaper && deletedStatsborgerskaper.length > 0) {
      removeCandidateForDeletion(getKey(deletedStatsborgerskaper[0]))
    }
    onValueChanged(`${personID}.personInfo.statsborgerskap`, newStatsborgerskaper)
  }

  const onAdd = () => {
    if (performValidation()) {
      let newStatsborgerskaper = _.cloneDeep(statsborgerskaper)
      if (_.isNil(newStatsborgerskaper)) {
        newStatsborgerskaper = []
      }
      newStatsborgerskaper.push({
        land: _newLand!,
        fomdato: _newFomdato
      })
      resetForm()
      onValueChanged(`${personID}.personInfo.statsborgerskap`, newStatsborgerskaper)
    }
  }

  const getErrorFor = (index: number, el: string): string | undefined => {
    return index < 0 ? _validation[namespace + '-' + el]?.feilmelding : validation[namespace + '[' + index + ']-' + el]?.feilmelding
  }

  const renderRow = (s: Statsborgerskap | null, i: number) => {
    const key = s ? getKey(s) : 'new'
    const candidateForDeletion = i < 0 ? false : key && _confirmDelete.indexOf(key) >= 0

    return (
      <>
        <AlignStartRow className={classNames('slideInFromLeft')}>
          <Column>
            <CountrySelect
              data-test-id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-land-countryselect'}
              error={getErrorFor(i, 'land')}
              id={'c-' + namespace + (i >= 0 ? '[' + i + ']' : '') + '-land-countryselect'}
              menuPortalTarget={document.body}
              includeList={landkoderList ? landkoderList.map((l: Kodeverk) => l.kode) : []}
              onOptionSelected={(e: any) => onLandSelected(e.value, i)}
              placeholder={t('el:placeholder-select-default')}
              values={i < 0 ? _newLand : s!.land}
            />
          </Column>
          <Column>
            <HighContrastInput
              data-test-id={'c-familymanager-' + personID + '-nasjonaliteter-' + i + '-fomdato-input'}
              feil={getErrorFor(i, 'fomdato')}
              id={'c-familymanager-' + personID + '-nasjonaliteter-' + i + '-fomdato'}
              onChange={(e: any) => onFomdatoChanged(e.target.value, i)}
              value={i < 0 ? _newFomdato : s!.fomdato}
              placeholder={t('el:placeholder-date-default')}
            />
          </Column>
          <Column>
            {candidateForDeletion
              ? (
                <FlexCenterDiv className={classNames('slideInFromRight')}>
                  <Normaltekst>
                    {t('label:are-you-sure')}
                  </Normaltekst>
                  <HorizontalSeparatorDiv data-size='0.5' />
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => onRemove(i)}
                  >
                    {t('label:yes')}
                  </HighContrastFlatknapp>
                  <HorizontalSeparatorDiv data-size='0.5' />
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => removeCandidateForDeletion(key!)}
                  >
                    {t('label:no')}
                  </HighContrastFlatknapp>
                </FlexCenterDiv>
                )
              : (
                <div>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => i < 0 ? onAdd() : addCandidateForDeletion(key!)}
                  >
                    {i < 0 ? <Add /> : <Trashcan />}
                    <HorizontalSeparatorDiv data-size='0.5' />
                    {i < 0 ? t('el:button-add') : t('el:button-remove')}
                  </HighContrastFlatknapp>
                  {_seeNewForm && i < 0 && (
                    <>
                      <HorizontalSeparatorDiv />
                      <HighContrastFlatknapp
                        mini
                        kompakt
                        onClick={onCancel}
                      >
                        {t('el:button-cancel')}
                      </HighContrastFlatknapp>
                    </>
                  )}
                </div>
                )}
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv />
      </>
    )
  }

  return (
    <PaddedDiv>
      <Row className='slideInFromLeft'>
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
      {statsborgerskaper.map(renderRow)}
      <hr />
      <VerticalSeparatorDiv />
      {_seeNewForm
        ? renderRow(null, -1)
        : (
          <Row className='slideInFromLeft'>
            <Column>
              <HighContrastFlatknapp
                mini
                kompakt
                onClick={onAddNewClicked}
              >
                <Add />
                <HorizontalSeparatorDiv data-size='0.5' />
                {t('el:button-add-new-x', { x: t('label:nationality').toLowerCase() })}
              </HighContrastFlatknapp>

            </Column>
          </Row>
          )}
    </PaddedDiv>
  )
}

export default Nasjonaliteter
